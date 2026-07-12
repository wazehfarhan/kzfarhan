// projectCarousel.js
// Initializes a simple image carousel for a project card.
(function () {
  window.crossfadeProjectImage = function(mainImg, src, alt) {
    if (!mainImg || !src || mainImg.getAttribute("src") === src) return;
    const clone = mainImg.cloneNode(true);
    clone.style.position = 'absolute';
    clone.style.top = '0';
    clone.style.left = '0';
    clone.style.width = '100%';
    clone.style.height = '100%';
    clone.style.zIndex = '2';
    clone.style.transition = 'opacity 0.4s ease';
    clone.style.pointerEvents = 'none';
    
    mainImg.parentNode.appendChild(clone);
    
    mainImg.src = src;
    if (alt) mainImg.alt = alt;
    mainImg.style.opacity = '1';
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        clone.style.opacity = '0';
      });
    });
    
    setTimeout(() => {
      if (clone.parentNode) clone.parentNode.removeChild(clone);
    }, 450);
  };

  // Expose globally for initProjectCarousel(card)
  window.initProjectCarousel = function (card) {
    if (!card) return;
    const mainImg = card.querySelector('.project-preview-main-img');
    const thumbs = Array.from(card.querySelectorAll('.project-preview-thumb'));
    if (!mainImg || thumbs.length === 0) return;
    // Ensure one thumb is active
    let activeIdx = thumbs.findIndex((t) => t.classList.contains('active'));
    if (activeIdx === -1) {
      activeIdx = 0;
      thumbs[0].classList.add('active');
    }
    const updateMain = (idx) => {
      const thumb = thumbs[idx];
      const src = thumb.dataset.image;
      const alt = thumb.dataset.alt || thumb.querySelector('img')?.alt || '';
      if (src) {
        window.crossfadeProjectImage(mainImg, src, alt);
      }
    };
    // Set initial image
    updateMain(activeIdx);
    // Auto cycle every 4 seconds
    let interval = setInterval(() => {
      // remove active from current thumb
      thumbs[activeIdx].classList.remove('active');
      activeIdx = (activeIdx + 1) % thumbs.length;
      thumbs[activeIdx].classList.add('active');
      updateMain(activeIdx);
    }, 4000);
    // Cleanup on card removal (optional)
    card.addEventListener('remove', () => clearInterval(interval));
  };
})();
