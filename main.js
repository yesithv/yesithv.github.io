(function () {
  function makeCarousel(trackId, prevId, nextId, dotsId, itemSel, label, desktopCount) {
    desktopCount = desktopCount || 3;
    const track = document.getElementById(trackId);
    const cards = track.querySelectorAll(itemSel);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    const dotsContainer = document.getElementById(dotsId);
    let current = 0;

    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', label + ' ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    function visibleCount() {
      const w = window.innerWidth;
      if (w >= 900) return desktopCount;
      if (w >= 600) return 2;
      return 1;
    }

    function goTo(index) {
      const max = cards.length - visibleCount();
      current = Math.max(0, Math.min(index, max));
      const gap = parseFloat(getComputedStyle(track).gap) || 24;
      track.style.transform = 'translateX(-' + (current * (cards[0].offsetWidth + gap)) + 'px)';
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
      prevBtn.disabled = current === 0;
      nextBtn.disabled = current >= max;
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));
    window.addEventListener('resize', () => goTo(Math.min(current, cards.length - visibleCount())));

    let dragStart = 0, dragDelta = 0, isDragging = false;

    function dragOffset() {
      const gap = parseFloat(getComputedStyle(track).gap) || 24;
      return current * (cards[0].offsetWidth + gap);
    }

    function onDragStart(x) {
      dragStart = x; dragDelta = 0; isDragging = true;
      track.classList.add('dragging');
    }

    function onDragMove(x) {
      if (!isDragging) return;
      dragDelta = x - dragStart;
      track.style.transform = 'translateX(' + (-dragOffset() + dragDelta) + 'px)';
    }

    function onDragEnd() {
      if (!isDragging) return;
      isDragging = false;
      track.classList.remove('dragging');
      const threshold = cards[0].offsetWidth * 0.25;
      if (dragDelta < -threshold) goTo(current + 1);
      else if (dragDelta > threshold) goTo(current - 1);
      else goTo(current);
    }

    track.addEventListener('mousedown', e => { e.preventDefault(); onDragStart(e.clientX); });
    window.addEventListener('mousemove', e => onDragMove(e.clientX));
    window.addEventListener('mouseup', onDragEnd);
    track.addEventListener('touchstart', e => onDragStart(e.touches[0].clientX), { passive: true });
    track.addEventListener('touchmove', e => onDragMove(e.touches[0].clientX), { passive: true });
    track.addEventListener('touchend', onDragEnd);
    track.addEventListener('click', e => { if (Math.abs(dragDelta) > 5) e.preventDefault(); }, true);

    goTo(0);
  }

  makeCarousel('skillsTrack',   'skillsPrev', 'skillsNext', 'skillsDots',   '.skill-card',   'Skill');
  makeCarousel('expTrack',       'expPrev',    'expNext',    'expDots',      '.exp-card',     'Job');
  makeCarousel('projectsTrack', 'prevBtn',    'nextBtn',    'carouselDots', '.project-card', 'Project', 4);
})();

// ── Hamburger nav ──
(function () {
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('mobileMenu');
  if (!toggle || !menu) return;

  function openMenu() {
    menu.classList.add('open');
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });

  const closeBtn = document.getElementById('mobileMenuClose');
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
})();

function openGifLightbox(img) {
  const lb = document.getElementById('gif-lightbox');
  document.getElementById('gif-lightbox-img').src = img.src;
  lb.classList.add('open');
}

function closeGifLightbox() {
  document.getElementById('gif-lightbox').classList.remove('open');
}

document.getElementById('gif-lightbox').addEventListener('click', function(e) {
  if (e.target === this) closeGifLightbox();
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeGifLightbox();
});
