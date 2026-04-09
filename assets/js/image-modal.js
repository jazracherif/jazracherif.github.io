/**
 * image-modal.js
 *
 * Lightbox modal for post images with grid-aware prev/next navigation.
 *
 * Behaviour:
 *  - Clicking any image inside .post-content opens a full-screen overlay.
 *  - When the clicked image lives inside an .image-grid, the modal collects
 *    all sibling images and exposes ‹ / › arrows to step through them.
 *  - The prev arrow is hidden on the first image; the next arrow is hidden
 *    on the last image (no wrapping).
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
    // Show prev only when there is a preceding image in the grid
    prevBtn.style.display = (multi && gridIndex > 0) ? 'flex' : 'none';
    // Show next only when there is a following image in the grid
    nextBtn.style.display = (multi && gridIndex < gridImages.length - 1) ? 'flex' : 'none';
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
