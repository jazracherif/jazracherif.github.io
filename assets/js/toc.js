/* global document, window */
/**
 * toc.js — "On this page" sidebar + mobile dialog
 *
 * Desktop: fixed sidebar positioned just right of the centered content column.
 *          Visible at ≥1240px viewport width.
 * Mobile:  floating "☰ Contents" button → native <dialog> slide-up sheet.
 *
 * Expand/collapse: only the children of the currently active section are
 * shown. When you scroll into a new section, its children expand and all
 * sibling sections' children collapse. The full ancestor chain is expanded
 * so nested groups (e.g. h2→h3→h4) stay open correctly.
 *
 * Scroll-spy: rAF-throttled scroll listener. Active = last heading whose
 * top edge has crossed 90px from the viewport top.
 */
(function () {
  'use strict';

  /* ── Locate required DOM elements ─────────────────────────────────────── */
  var sidebar   = document.getElementById('toc-sidebar');
  var toggleBtn = document.getElementById('toc-toggle-btn');
  var dialog    = document.getElementById('toc-dialog');
  var closeBtn  = document.getElementById('toc-dialog-close');

  if (!sidebar) return;

  var content = document.querySelector('.post-content');
  if (!content) return;

  /* ── Collect headings (h2, h3, h4) that have an id ──────────────────── */
  var headings = Array.from(
    content.querySelectorAll('h2[id], h3[id], h4[id]')
  );
  if (headings.length === 0) return;

  /* ── Strip 🔗 emoji and heading-anchor links from heading text ───────── */
  function cleanText(h) {
    var clone = h.cloneNode(true);
    clone.querySelectorAll('.heading-anchor').forEach(function (el) { el.remove(); });
    return clone.textContent.replace(/🔗\s*/g, '').trim();
  }

  /* ── Build item list with depth and parent references ───────────────── */
  var items = headings.map(function (h) {
    return {
      heading:           h,
      depth:             parseInt(h.tagName[1], 10) - 2, // h2→0, h3→1, h4→2
      parent:            null,
      children:          [],
      sidebarLink:       null,
      sidebarChildrenUl: null,
      dialogLink:        null,
      dialogChildrenUl:  null,
    };
  });

  /* Link each item to its nearest ancestor with lower depth */
  for (var i = 1; i < items.length; i++) {
    for (var j = i - 1; j >= 0; j--) {
      if (items[j].depth < items[i].depth) {
        items[i].parent = items[j];
        items[j].children.push(items[i]);
        break;
      }
    }
  }

  /* ── DOM builder: creates the nested <ul> structure for a container ──── */
  function buildList(container, linkProp, childrenUlProp, onLinkClick) {
    /* Recursive: appends only direct children of `parentItem` (or root items
       if parentItem is null) into `ulEl`. */
    function appendChildren(ulEl, parentItem) {
      var directChildren = items.filter(function (it) {
        return it.parent === parentItem;
      });

      directChildren.forEach(function (item) {
        var a = document.createElement('a');
        a.href        = '#' + item.heading.id;
        a.textContent = cleanText(item.heading);
        a.className   = 'toc-link';
        a.setAttribute('data-depth', item.depth);
        a.addEventListener('click', onLinkClick);
        item[linkProp] = a;

        var li = document.createElement('li');
        li.appendChild(a);

        if (item.children.length > 0) {
          var childUl = document.createElement('ul');
          childUl.className = 'toc-list toc-children'; /* collapsed by default */
          item[childrenUlProp] = childUl;
          appendChildren(childUl, item);
          li.appendChild(childUl);
        }

        ulEl.appendChild(li);
      });
    }

    appendChildren(container, null);
  }

  /* ── Sidebar ─────────────────────────────────────────────────────────── */
  var sidebarList = sidebar.querySelector('.toc-list');

  function onSidebarLinkClick(e) {
    handleLinkClick(e.currentTarget.getAttribute('href'));
  }

  /* buildList is called separately for sidebar and dialog so each container
     gets its own <a> element references (stored as sidebarLink / dialogLink
     on each item). activate() then updates both sets independently. */
  buildList(sidebarList, 'sidebarLink', 'sidebarChildrenUl', onSidebarLinkClick);

  /* ── Dialog ──────────────────────────────────────────────────────────── */
  var dialogInnerList = dialog ? dialog.querySelector('#toc-dialog-list') : null;

  function onDialogLinkClick(e) {
    if (dialog && dialog.open) dialog.close();
    handleLinkClick(e.currentTarget.getAttribute('href'));
  }

  if (dialogInnerList) {
    buildList(dialogInnerList, 'dialogLink', 'dialogChildrenUl', onDialogLinkClick);
  }

  /* ── Active-link + expand/collapse management ───────────────────────── */
  var activeItem = null;

  /* Returns a Set containing item and all its ancestors */
  function ancestorSet(item) {
    var s = [];
    var cur = item;
    while (cur) { s.push(cur); cur = cur.parent; }
    return s;
  }

  function activate(item) {
    if (activeItem === item) return;

    /* Deactivate previous */
    if (activeItem) {
      activeItem.sidebarLink.classList.remove('is-active');
      if (activeItem.dialogLink) activeItem.dialogLink.classList.remove('is-active');
    }

    activeItem = item;
    if (!item) return;

    item.sidebarLink.classList.add('is-active');
    if (item.dialogLink) item.dialogLink.classList.add('is-active');

    /* Expand/collapse children ULs:
       - open  → item is an ancestor of (or equal to) the active item
       - close → all others */
    var ancestors = ancestorSet(item);
    items.forEach(function (it) {
      if (it.sidebarChildrenUl) {
        var open = ancestors.indexOf(it) !== -1;
        it.sidebarChildrenUl.classList.toggle('toc-children--open', open);
      }
      if (it.dialogChildrenUl) {
        var open2 = ancestors.indexOf(it) !== -1;
        it.dialogChildrenUl.classList.toggle('toc-children--open', open2);
      }
    });

    /* Scroll sidebar so the active link stays visible */
    var sbRect   = sidebar.getBoundingClientRect();
    var linkRect = item.sidebarLink.getBoundingClientRect();
    if (linkRect.top < sbRect.top + 16) {
      sidebar.scrollTop -= (sbRect.top - linkRect.top) + 16;
    } else if (linkRect.bottom > sbRect.bottom - 16) {
      sidebar.scrollTop += (linkRect.bottom - sbRect.bottom) + 16;
    }
  }

  /* ── Scroll-spy ──────────────────────────────────────────────────────── */
  /* THRESHOLD: px from viewport top at which a heading is considered "active".
     ~90px matches the fixed header height so a heading feels fully in view
     before it's highlighted. */
  var THRESHOLD    = 90;
  /* updateLocked: true while a click-initiated scroll is in flight.
     Prevents scroll-spy from overriding the just-clicked item before the
     browser finishes smooth-scrolling to the target (~600-800ms). */
  var updateLocked = false;
  /* ticking: rAF gate — ensures at most one updateActive() is queued per
     animation frame, so rapid scroll events don't pile up. */
  var ticking      = false;

  function updateActive() {
    var active = null;
    for (var i = 0; i < items.length; i++) {
      if (items[i].heading.getBoundingClientRect().top <= THRESHOLD) {
        active = items[i];
      } else {
        break;
      }
    }
    /* Fall back to the first item when no heading has crossed the threshold
       (i.e. user is at the very top of the page). */
    activate(active || items[0]);
  }

  function onScroll() {
    if (updateLocked) return;
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateActive();
        ticking = false;
      });
      ticking = true;
    }
  }

  /* passive: true — tells the browser this handler never calls preventDefault(),
     allowing it to start scrolling immediately without waiting for JS. */
  window.addEventListener('scroll', onScroll, { passive: true });
  /* Run once on load so the first TOC item is highlighted before any scrolling. */
  updateActive();

  /* ── Link click: immediate activate + suppress scroll-spy briefly ────── */
  function handleLinkClick(href) {
    for (var i = 0; i < items.length; i++) {
      if ('#' + items[i].heading.id === href) {
        activate(items[i]);
        break;
      }
    }
    updateLocked = true;
    /* 900ms > longest typical smooth-scroll duration (~600-800ms).  After this
       delay scroll-spy resumes and takes over from the click-activated state. */
    setTimeout(function () { updateLocked = false; }, 900);
  }

  /* ── Mobile dialog controls ──────────────────────────────────────────── */
  if (toggleBtn && dialog) {
    toggleBtn.addEventListener('click', function () {
      if (dialog.open) { dialog.close(); } else { dialog.showModal(); }
    });

    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) dialog.close();
    });
  }

  if (closeBtn && dialog) {
    closeBtn.addEventListener('click', function () { dialog.close(); });
  }
}());
