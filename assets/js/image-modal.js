/**
 * image-modal.js
 *
 * Lightbox modal for post images with grid-aware prev/next navigation.
 *
 * Behaviour:
 *  - Clicking any image inside .post-content opens a full-screen overlay.
 *  - When the clicked image lives inside an .image-grid, the modal collects
 *    all sibling images and exposes prev / next arrows to step through them.
 *  - The prev arrow is hidden on the first image; the next arrow is hidden
 *    on the last image (no wrapping) via visibility/pointer-events toggles.
 *    This preserves arrow slot width and prevents image shifting.
 *  - For standalone images (outside a grid) no arrows are shown.
 *  - The modal closes on: background click, × button, or Escape key.
 *  - Left / Right arrow keys navigate while the modal is open.
 */
(function () {
  const modal   = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const closeBtn = document.querySelector('.image-modal-close');
  const prevBtn  = document.querySelector('.image-modal-prev');
  const nextBtn  = document.querySelector('.image-modal-next');

  // Images belonging to the currently open grid, and the active index within it.
  // Both are reset to [] / 0 when the modal closes.
  let gridImages = [];
  let gridIndex  = 0;

  /* ── Core open / close ──────────────────────────────────────────────── */

  function openModal(src, alt) {
    modalImg.src = src;
    modalImg.alt = alt;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent page scroll behind overlay
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    gridImages = []; // clear grid context so stale state can't leak
  }

  /* ── Arrow visibility ───────────────────────────────────────────────── */

  function updateArrows() {
    const multi = gridImages.length > 1;
    const showPrev = multi && gridIndex > 0;
    const showNext = multi && gridIndex < gridImages.length - 1;

    // Hide using visibility so button width remains reserved and the image stays centered.
    prevBtn.style.visibility = showPrev ? 'visible' : 'hidden';
    prevBtn.style.pointerEvents = showPrev ? 'auto' : 'none';

    nextBtn.style.visibility = showNext ? 'visible' : 'hidden';
    nextBtn.style.pointerEvents = showNext ? 'auto' : 'none';
  }

  /* ── Image click — open and populate grid context ───────────────────── */

  document.querySelectorAll('.post-content img').forEach(function (img) {
    img.addEventListener('click', function (e) {
      e.stopPropagation();

      const grid = this.closest('.image-grid');
      if (grid) {
        // Collect every image in this specific grid for sequential navigation
        gridImages = Array.from(grid.querySelectorAll('img'));
        gridIndex  = gridImages.indexOf(this);
      } else {
        // Standalone image — no navigation context needed
        gridImages = [this];
        gridIndex  = 0;
      }

      openModal(this.src, this.alt);
      updateArrows();
    });
  });

  /* ── Arrow navigation ───────────────────────────────────────────────── */

  prevBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (gridIndex > 0) {
      gridIndex--;
      var img = gridImages[gridIndex];
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      updateArrows();
    }
  });

  nextBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (gridIndex < gridImages.length - 1) {
      gridIndex++;
      var img = gridImages[gridIndex];
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      updateArrows();
    }
  });

  /* ── Close handlers ─────────────────────────────────────────────────── */

  // Background overlay click closes the modal
  modal.addEventListener('click', closeModal);

  closeBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    closeModal();
  });

  // Clicking the image itself should not close the modal
  modalImg.addEventListener('click', function (e) {
    e.stopPropagation();
  });

  /* ── Keyboard navigation ────────────────────────────────────────────── */

  document.addEventListener('keydown', function (e) {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'ArrowLeft') {
      prevBtn.click();
    } else if (e.key === 'ArrowRight') {
      nextBtn.click();
    }
  });
})();
