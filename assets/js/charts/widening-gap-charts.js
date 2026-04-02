/**
 * widening-gap-charts.js
 *
 * Renders the four-line Chart.js comparison chart embedded in:
 *   _posts/2026-03-25-the-narrowing-gap-gpu-vs-cpu-memory.markdown
 *
 * Chart overview
 * --------------
 * Each data point represents one GPU superchip generation compared against
 * an AMD EPYC cluster sized to match the GPU's FP32 throughput (compute parity).
 * The Y-axis is logarithmic so the wide range of values (0.56× to 91×) can be
 * read on the same chart without compression.
 *
 * Four metrics are plotted:
 *
 *   1. Memory Bandwidth (green, solid)
 *      GPU HBM bandwidth ÷ CPU-cluster aggregate DDR bandwidth.
 *      Rising = GPU gaining. Crossed above 1× between GH200 and GB200.
 *
 *   2. Memory Capacity (blue, dashed 6-4)
 *      CPU-cluster total DRAM ÷ GPU total unified memory (HBM + LPDDR5X).
 *      Falling = CPU advantage shrinking (good for GPU).
 *      Remains well above 1×; DDR is orders of magnitude cheaper per GB than HBM.
 *
 *   3. Cost at parity (amber, dashed 3-3)
 *      CPU parity-system CAPEX ÷ GPU single-chip-equivalent CAPEX.
 *      Single-chip equivalent = full-rack CAPEX ÷ superchips per rack
 *        (NVL32 = 32 chips; NVL72 = 36 chips).
 *      Falling = GPU's cost advantage over CPU is shrinking (bad for GPU).
 *
 *   4. Perf/W efficiency (purple, dashed 8-3)
 *      GPU FP32/W ÷ CPU-cluster FP32/W at parity.
 *      Falling = GPU's power-efficiency lead is shrinking (bad for GPU).
 *      NVIDIA is pushing thermal limits (2.3 kW per Rubin GPU) while CPU
 *      power curves have remained more conservative.
 *
 * End-of-line labels
 * ------------------
 * A custom Chart.js plugin (endLabelPlugin) draws a short trend annotation
 * (e.g. "↑ good for GPU") at the right-hand end of each line using the
 * afterDatasetsDraw hook. Right padding of 160 px is added to the layout so
 * the labels are not clipped by the canvas edge.
 *
 * Data sources
 * ------------
 * All values are derived from the comparison table in the companion post.
 * See the post for methodology notes and cost assumptions.
 */
(function () {

  // ── Shared colours ───────────────────────────────────────────────────────────
  var C = {
    green:  '#76b900',   // NVIDIA green  — GPU metrics
    blue:   '#4a7abf',   // AMD/Intel blue — CPU metrics
    black:  '#1a1a1a',   // Black          — Cost ratio
    purple: '#9b59b6',   // Purple         — Perf/W
    teal:   '#2ea8a8',   // Teal           — secondary GPU BW
    orange: '#e67e22'    // Orange         — inter-node BW
  };

  // ── Shared helpers ───────────────────────────────────────────────────────────

  /** Build a dataset object with common line-chart defaults. */
  function ds(label, data, color, dash) {
    var d = {
      label: label, data: data,
      borderColor: color, backgroundColor: color + '30',
      borderWidth: 3, pointRadius: 6, fill: false, tension: 0.1
    };
    if (dash) d.borderDash = dash;
    return d;
  }

  /** Chart.js plugin: draws a trend label at the right end of each visible line. */
  function makeEndLabelPlugin(id, labels) {
    return {
      id: id,
      afterDatasetsDraw: function (chart) {
        var ctx = chart.ctx;
        chart.data.datasets.forEach(function (dataset, i) {
          var meta = chart.getDatasetMeta(i);
          if (meta.hidden) return;
          var last = meta.data[meta.data.length - 1];
          if (!last) return;
          ctx.save();
          ctx.font = 'bold 10px sans-serif';
          ctx.fillStyle = dataset.borderColor;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(labels[i], last.x + 8, last.y);
          ctx.restore();
        });
      }
    };
  }

  /** Render a logarithmic multi-line chart with end-of-line trend labels. */
  function makeLineChart(canvasId, xLabels, datasets, endLabels, pluginId, rightPad, yTitle, yType) {
    var scaleType = yType || 'logarithmic';
    var yMin = scaleType === 'logarithmic' ? 0.5 : 0;
    new Chart(document.getElementById(canvasId), {
      type: 'line',
      data: { labels: xLabels, datasets: datasets },
      options: {
        responsive: true,
        scales: {
          y: {
            type: scaleType,
            min: yMin,
            title: { display: true, text: yTitle },
            ticks: { callback: function (v) { return v + '×'; } }
          }
        },
        layout: { padding: { right: rightPad } },
        plugins: {
          legend: {
            position: 'top', align: 'center',
            labels: { usePointStyle: true, pointStyle: 'line', padding: 16, font: { size: 11 } }
          },
          tooltip: {
            callbacks: { label: function (ctx) { return ctx.dataset.label + ': ' + ctx.parsed.y + '×'; } }
          }
        }
      },
      plugins: [makeEndLabelPlugin(pluginId, endLabels)]
    });
  }

  // ── Chart 1: Compute-parity gap ──────────────────────────────────────────────
  // Each point = one GPU generation vs an AMD EPYC cluster at FP32 compute parity.
  // GPU HBM BW / CPU DDR BW:  GH200: 4.9/8.8=0.56×  GB200: 16/12.1=1.32×  VR200: 44/20.7=2.13×
  // CPU DRAM / GPU memory:     GH200: 57TB/624GB=91×  GB200: 63/0.864=73×   VR200: 108/2.1=51×
  // CPU CAPEX / GPU per-chip:  GH200: $0.62M/$39k=15.9×  GB200: $0.69M/$87k=8×  VR200: $1.17M/$188k=6.8×
  // GPU FP32/W ÷ CPU FP32/W:  GH200: ~6.8×  GB200: ~3.9×  VR200: ~3.6×
  makeLineChart(
    /* canvasId  */ 'gapChart',
    /* xLabels   */ ['GH200 (2023) vs AMD EPYC 9654', 'GB200 (2024) vs AMD EPYC 9965', 'VR200 (2025) vs AMD EPYC 9965'],
    /* datasets  */ [
      ds('GPU Memory BW / CPU cluster BW (×)',          [0.56, 1.32, 2.13], C.green),
      ds('CPU Memory capacity / GPU total memory (×)',  [91, 73, 51],       C.blue,   [6, 4]),
      ds('CPU vs GPU Cost (×)',                         [15.9, 8.0, 6.8],   C.black,  [3, 3]),
      ds('GPU / CPU cluster Perf/W (×)',                [6.8, 3.9, 3.6],    C.purple, [8, 3])
    ],
    /* endLabels */ ['↑ GPU bandwidth lead growing ✅', '↓ capacity gap closing slowly ✅', '↓ cost advantage eroding ❌', '↓ efficiency lead shrinking ❌'],
    /* pluginId  */ 'endLabelsGap',
    /* rightPad  */ 170,
    /* yTitle    */ 'Advantage multiplier (×, log scale)'
  );

  // ── Chart 2: Bare-metal isocost at $1M ───────────────────────────────────────
  // Each point = GPU superchip fleet vs CPU socket fleet for $1M capital spend.
  // GPU FP32 / CPU FP32:       GH200: (25×67)/(125×2.5)=5.4×  GB200: (11×150)/(71×7.4)=3.1×  VR200: (5×260)/(71×7.4)=2.5×
  // GPU HBM BW / CPU DDR BW:   GH200: 122.5/25.6=4.8×  GB200: 176/40.9=4.3×  VR200: 220/40.9=5.4×
  // CPU DRAM / GPU memory:      GH200: 125/15.6=8.0×  GB200: 106.5/9.5=11.2×  VR200: 106.5/10.5=10.1×
  // GPU Perf/W / CPU Perf/W:    GH200: ~9.7×  GB200: ~4.9×  VR200: ~4.6×
  // Inter-node IB BW (per node): GH200 NDR/HDR=2.0×  GB200 NDR/NDR=1.0×  VR200 XDR/NDR=4.0× (est., ConnectX-9)
  makeLineChart(
    /* canvasId  */ 'isocostChart',
    /* xLabels   */ ['GH200 vs Milan', 'GB200 vs Turin', 'VR200 vs Turin'],
    /* datasets  */ [
      ds('GPU FP32 advantage (×)',                     [5.4, 3.1, 2.5],  C.green),
      ds('GPU HBM BW advantage (×) — intra-node',     [4.8, 4.3, 5.4],  C.teal,   [6, 4]),
      ds('CPU Capacity advantage over GPU (×)',        [8.0, 11.2, 10.1], C.blue,  [3, 3]),
      ds('GPU Perf/W advantage (×)',                   [9.7, 4.9, 4.6],  C.purple, [8, 3]),
      ds('GPU Inter-node BW advantage (×) — shuffle', [2.0, 1.0, 4.0],  C.orange, [4, 2])
    ],
    /* endLabels */ [
      '↓ compute advantage shrinking ❌',
      '→ BW lead stable ➡️',
      '↑ CPU holds ~8–11× capacity ❌',
      '↓ efficiency lead shrinking ❌',
      '↑ VR200 inter-node: ~4× per-node ✅'
    ],
    /* pluginId  */ 'endLabelsIsocost',
    /* rightPad  */ 180,
    /* yTitle    */ 'Advantage multiplier (×) — $1M budget',
    /* yType     */ 'linear'
  );

  // ── Chart 3: Cloud isocost at $1k/hr AWS ─────────────────────────────────────
  // A100/p4d ($21.96/hr) vs Milan/hpc6a ($2.88/hr)
  // H100/p5  ($55.04/hr) vs Genoa/hpc7a ($7.20/hr)
  // B200/p6-b200 ($113.93/hr) vs Turin/hpc8a ($7.92/hr)
  // Prices: AWS on-demand Linux, April 2026 (source: Vantage).
  // GPU FP32 / CPU FP32:        A100: 7020/1568=4.5×  H100: 9648/1021=9.5×  B200: 4800/932=5.2×
  // GPU HBM BW / CPU DDR BW:    A100: 560/142=3.9×  H100: 482/127=3.8×  B200: 512/145=3.5×
  // CPU DRAM / GPU HBM:          A100: 133/14.4=9.2×  H100: 104/11.3=9.2×  B200: 95/11.5=8.3×
  // EFA BW per node (GPU/CPU):   A100: 400/100=4×  H100: 3200/300=10.7×  B200: 3200/300=10.7×
  makeLineChart(
    /* canvasId  */ 'cloudIsocostChart',
    /* xLabels   */ ['A100 vs Milan ($1k/hr, AWS)', 'H100 vs Genoa ($1k/hr, AWS)', 'B200 vs Turin ($1k/hr, AWS)'],
    /* datasets  */ [
      ds('GPU FP32 advantage (×)',                     [4.5, 9.5, 5.2],   C.green),
      ds('GPU HBM BW advantage (×) — intra-node',     [3.9, 3.8, 3.5],   C.teal,   [6, 4]),
      ds('CPU Capacity advantage over GPU (×)',        [9.2, 9.2, 8.3],   C.blue,   [3, 3]),
      ds('GPU Inter-node BW advantage (×) — shuffle', [4.0, 10.7, 10.7], C.orange, [4, 2]),
      ds('GPU node price premium over CPU (×)',        [7.6, 7.6, 14.4],  C.black,  [3, 3])
    ],
    /* endLabels */ [
      '↑↓ peaked at H100 era ⚠️',
      '→ BW lead stable ➡️',
      '→ CPU ~8–9× capacity ❌',
      '↑ GPU Inter-Node 11× per-node ✅',
      '↑ pricing premium widening ❌'
    ],
    /* pluginId  */ 'endLabelsCloud',
    /* rightPad  */ 200,
    /* yTitle    */ 'Advantage multiplier (×) — $1k/hr AWS budget',
    /* yType     */ 'linear'
  );

})();
