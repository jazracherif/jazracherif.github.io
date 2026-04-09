---
name: extract-nvidia-takeaways
description: "Use when: extracting takeaways from an NVIDIA session transcript, processing a GTC session transcript file, generating technical observations from a video transcript, adding Takeaways to a session. Accepts a transcript file path, saves it to nvidia/transcripts/, parses timestamps, and produces timestamped technical bullet points with accurate quotes."
argument-hint: "path to the transcript .txt file"
---

# Extract NVIDIA Session Takeaways

## When to Use

- User provides a transcript file and asks to extract takeaways, insights, or observations
- User wants to add a "Cherif's Take" section to a session entry in a blog draft
- User drops a `.txt` transcript from an NVIDIA On-Demand session

---

## Transcript Format

Transcripts use the following repeating block structure:

```
MM:SS
Line one of spoken text
line two of spoken text

MM:SS
Next line...
```

Timestamps are standalone lines in `MM:SS` format (e.g. `04:27`). The text that follows each timestamp belongs to that segment until the next timestamp line.

---

## Procedure

### Step 1 — Save the transcript

Copy the provided transcript file into the `_data/nvidia/transcripts/` folder at the root of the workspace. Create the folder if it does not exist.

```bash
mkdir -p nvidia/transcripts
cp "<source_path>" "nvidia/transcripts/<filename>"
```

The `_data/nvidia/` folder is excluded from the Jekyll site build via `exclude` in `_config.yml` — the transcripts are committed to git but never shipped to the public website. Confirm `_data/nvidia` is listed under `exclude:` in `_config.yml`. If it is not, add it.

### Step 2 — Parse the transcript

Read the saved transcript file. Reconstruct each timestamp → text segment by:

1. Splitting the file on lines that match `^\d{2}:\d{2}$`
2. Joining the lines that follow each timestamp into a single text block
3. Building a list of `(timestamp, text)` pairs

### Step 3 — Identify technical takeaways

Scan the segments for content worth surfacing. Good takeaway candidates:

- Specific benchmark numbers or performance comparisons (e.g. "7× TCO", "21 seconds TPC-H 1TB")
- Architectural insights or design decisions (e.g. "async mini-executor decomposition")
- Surprising or counterintuitive facts (e.g. opening a GPU talk with a CPU story)
- Strategic announcements (e.g. "open sourcing full platform Q2 2026")
- Quotable statistics from third parties (e.g. "2% of queries consume 92% of resources")

Aim for up to 7 takeaways. Each takeaway must be grounded in a specific segment from the transcript.

### Step 4 — Assign category tags

Each takeaway gets **as many category tags as genuinely apply**. Apply every tag whose topic is meaningfully present in the takeaway body — a takeaway about a benchmark result that also reveals a memory-capacity constraint and carries a cost implication should get `tag-benchmark`, `tag-memory-cap`, and `tag-tco`. Do not pad with loosely related tags, but do not artificially limit either.

#### Known categories

| CSS class | Label | When to use |
|---|---|---|
| `tag-benchmark` | Benchmark | Any perf number, speedup ratio, throughput figure, latency result, or leaderboard position |
| `tag-memory-bw` | Memory BW | GB/s or TB/s figures, bandwidth saturation, transfer rates, bus utilization |
| `tag-memory-cap` | Memory Capacity | Memory Hardware Specs, HBM limits, spill ratios, data-to-GPU-memory ratios |
| `tag-tco` | TCO | Cost per query, hourly rates, price/perf comparisons, cloud spend |
| `tag-comm` | Communication | GPU-to-GPU interconnects, NVLink, UCX, shuffle bandwidth, multi-GPU routing |
| `tag-storage` | Storage I/O | Parquet reads, S3, NVMe, GDS, disk spill, read coalescing |
| `tag-design` | Design | Deliberate system or software design decisions: execution models, memory management strategies, fallback policies, component decomposition. Only apply when the takeaway is *primarily* about a design choice — not when `tag-algo`, `tag-oss`, `tag-comm`, or `tag-storage` already captures the key insight. |
| `tag-pain` | Pain Point | Limitations, bottlenecks, unsolved problems, known gaps, OOM failures |
| `tag-oss` | Open Source | Open source releases, public repos, community upstreaming, official endorsements |
| `tag-algo` | Algorithm | Novel algorithmic techniques, iteration fusion, adaptive strategies, lazy evaluation, radix methods |

Tag format (placed inline in `tk-content`, see Step 5):
```html
<takeaway-tag name="benchmark"></takeaway-tag><takeaway-tag name="tco"></takeaway-tag>
```

**New category rule:** After processing a transcript, if you encounter a salient recurring theme that is not covered by any existing category, list it at the end of your response under a heading **"Suggested new tags"** with the theme, a proposed CSS class name, and 1–2 example takeaways from the session that would use it.

### Step 5 — Format the output

Each takeaway is a 2-row table entry inside a single `<table class="takeaway-table">`. Output the full block like this:

```html
**Takeaways**

<table class="takeaway-table">

<tr>
  <td class="tk-head"><strong>1. Short bold headline</strong></td>
  <td class="tk-time">@ MM:SS</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="X"></takeaway-tag>
    <takeaway-tag name="Y"></takeaway-tag>
    <span class="tk-body">
      One to three sentence elaboration with specific numbers and context. If a direct quote sharpens the point, include it in quotation marks exactly as spoken.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>2. Next headline</strong></td>
  <td class="tk-time">@ MM:SS</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="Z"></takeaway-tag>
    <span class="tk-body">
      Elaboration...
    </span>
  </td>
</tr>

</table>
```

Rules:
- The headline is the sharpest distillation of the insight — make it specific, not generic
- The timestamp goes in the `takeaway-time` span; use the segment where the key claim first appears
- If a takeaway spans two distinct moments (e.g. setup at 04:27, payoff at 12:20), include both inline in `takeaway-body` as `<em>(@ 12:20)</em>`
- **Takeaways must be ordered chronologically by their leading timestamp** — earliest first, latest last
- **Quote accuracy is mandatory.** Any number, stat, or named result must be taken verbatim from the transcript segment at the cited timestamp — do not paraphrase or round figures
- When a direct quote from the speaker adds clarity or punch, include it in double quotation marks with the speaker's words preserved exactly
- Write in first-person-observer voice — analytical, not marketing
- **Maximum 7 takeaways per session.** If you identify more, combine closely related points into a single card
- Takeaway headlines must be prefixed with their index number: `1. Headline`, `2. Headline`, etc.
- Apply all tags that meaningfully apply to the takeaway content — see the category table in Step 4 for guidance on what co-occurs
- **Images:** when a takeaway has a single image, use a plain `<img>` tag. When it has two or more, wrap them in `<div class="image-grid">` (defined in `post-images.css`) — this renders a 2-column responsive grid on desktop, single column on mobile:

```html
<div class="image-grid">
  <img src="/assets/img/gtc-2026/sessions/image-one.png" alt="...">
  <img src="/assets/img/gtc-2026/sessions/image-two.png" alt="...">
</div>
```

### Step 6 — Insert into the draft (if applicable)

If the user is working on a blog post draft and a session entry already exists for this transcript:

1. Locate the session block by matching the session title
2. Insert the formatted takeaways block directly after the `> abstract` blockquote
3. Leave one blank line between the blockquote and `**Takeaways**`

---

## Example Output

```html
**Takeaways**

<table class="takeaway-table">

<tr>
  <td class="tk-head"><strong>1. CPU TPC-H price/performance has flatlined</strong></td>
  <td class="tk-time">@ 04:27</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <takeaway-tag name="pain"></takeaway-tag>
    <span class="tk-body">
      SQL Server and peers show only 15–20% gains per 2-year cycle. The Airbnb stat <em>(@ 12:20)</em> seals it: "2% of their queries basically eat up 92% of their cluster resources."
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>2. GPU Direct Storage collapses the memory hierarchy</strong></td>
  <td class="tk-time">@ 20:41</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="storage"></takeaway-tag>
    <takeaway-tag name="memory-cap"></takeaway-tag>
    <span class="tk-body">
      Theseus ran TPC-H 100 TB on "1.25 terabytes of GPU memory" — "we could take data from storage, move it directly to the GPU faster than we could actually get data from system memory."
    </span>
  </td>
</tr>

</table>
```

---

## Notes

- The `_data/nvidia/transcripts/` folder is committed to git but excluded from the Jekyll build via `_config.yml`. The transcripts never appear on the public website.
- Session transcripts from NVIDIA On-Demand are AI-generated and may contain speaker-name errors or garbled technical terms. If a number looks suspicious, flag it rather than silently correcting it.

## Related Skills

- **compress-images** — Before adding any screenshot or image to a takeaway, always load and follow the compress-images skill (`/.github/skills/compress-images/SKILL.md`). Use `sips -Z 1200` to resize PNGs to a 1200 px max edge and rename the file to a descriptive slug (e.g. `s81769-gpu-data-processing-tpch-over-time.png`) before referencing it in the post.
