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
  // X-axis labels: one entry per GPU generation
  var gens = ['GH200 (2023) vs AMD EPYC 9654', 'GB200 (2024) vs AMD EPYC 9965', 'VR200 (2025) vs AMD EPYC 9965'];

  // Brand colours for each metric line
  var gpuGreen   = '#76b900'; // NVIDIA green  — Memory Bandwidth
  var cpuBlue    = '#4a7abf'; // AMD/Intel blue — Memory Capacity
  var costAmber  = '#d98c00'; // Amber          — Cost ratio
  var perfPurple = '#9b59b6'; // Purple         — Perf/W ratio

  // ── Dataset values ──────────────────────────────────────────────────────────

  // GPU HBM BW / CPU-cluster DDR BW at FP32 parity
  // GH200: 4.9 TB/s ÷ 8.8 TB/s = 0.56  (CPU ahead)
  // GB200: 16 TB/s ÷ 12.1 TB/s = 1.32  (GPU ahead)
  // VR200: 44 TB/s ÷ 20.7 TB/s = 2.13  (GPU ahead, widening)
  var bwRatio = [0.56, 1.32, 2.13];

  // CPU-cluster DRAM / GPU total unified memory at FP32 parity
  // GH200: ~57 TB ÷ 624 GB  = ~91×
  // GB200: ~63 TB ÷ 864 GB  = ~73×
  // VR200: ~108 TB ÷ 2.1 TB = ~51×
  var capRatio = [91, 73, 51];

  // CPU parity-system CAPEX / GPU single-chip-equivalent CAPEX
  // GH200: ~$0.62M ÷ ~$39k  = ~15.9×
  // GB200: ~$0.69M ÷ ~$87k  = ~8.0×
  // VR200: ~$1.17M ÷ ~$188k = ~6.8×
  var costRatio = [15.9, 8.0, 6.8];

  // GPU FP32/W ÷ CPU-cluster FP32/W at parity
  // GH200:  67 TFLOPS / ~1.0 kW ÷ (19 × 350 W) = ~6.8×
  // GB200: 150 TFLOPS / ~2.7 kW ÷ (21 × 500 W) = ~3.9×
  // VR200: 260 TFLOPS / ~5.0 kW ÷ (36 × 500 W) = ~3.6×
  var perfWRatio = [6.8, 3.9, 3.6];

  // ── End-of-line trend labels ─────────────────────────────────────────────────
  // Order must match the datasets array below.
  var endLineLabels = ['↑ Good for GPU', '↓ Good for GPU', '↓ Bad for GPU', '↓ Bad for GPU'];

  /**
   * endLabelPlugin — Chart.js inline plugin.
   * Draws a coloured trend label to the right of the last data point on each
   * visible line, so readers can quickly interpret the direction of each metric.
   */
  var endLabelPlugin = {
    id: 'endLabels',
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
        ctx.fillText(endLineLabels[i], last.x + 8, last.y);
        ctx.restore();
      });
    }
  };

  new Chart(document.getElementById('gapChart'), {
    type: 'line',
    data: {
      labels: gens,
      datasets: [
        {
          label: 'GPU Memory BW / CPU cluster BW (×)',
          data: bwRatio,
          borderColor: gpuGreen,
          backgroundColor: gpuGreen + '30',
          borderWidth: 3,
          pointRadius: 6,
          fill: false,
          tension: 0.1
        },
        {
          label: 'CPU Memory capacity / GPU total memory (×)',
          data: capRatio,
          borderColor: cpuBlue,
          backgroundColor: cpuBlue + '30',
          borderWidth: 3,
          pointRadius: 6,
          borderDash: [6, 4],
          fill: false,
          tension: 0.1
        },
        {
          label: 'CPU vs GPU Cost (×)',
          data: costRatio,
          borderColor: costAmber,
          backgroundColor: costAmber + '30',
          borderWidth: 3,
          pointRadius: 6,
          borderDash: [3, 3],
          fill: false,
          tension: 0.1
        },
        {
          label: 'GPU / CPU cluster Perf/W (×)',
          data: perfWRatio,
          borderColor: perfPurple,
          backgroundColor: perfPurple + '30',
          borderWidth: 3,
          pointRadius: 6,
          borderDash: [8, 3],
          fill: false,
          tension: 0.1
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          type: 'logarithmic',
          min: 0.5,
          title: { display: true, text: 'Advantage multiplier (×, log scale)' },
          ticks: {
            callback: function (val) { return val + '×'; }
          }
        }
      },
      layout: { padding: { right: 160 } },
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              return ctx.dataset.label + ': ' + ctx.parsed.y + '×';
            }
          }
        }
      }
    },
    plugins: [endLabelPlugin]
  });
})();
