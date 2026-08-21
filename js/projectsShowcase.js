// projectsShowcase.js — interactive extras for the dynamically loaded
// "Projects" (#projects) section:
//   1. Mouse-tracking 3D tilt + glare on the project cards.
//
// Note: the memory mini-game and inline renderer were removed to keep the
// projects section focused on curated, hand-picked work.
(function () {
  var isCoarse = window.matchMedia("(pointer: coarse)").matches;

  /* ---------- 1. Tilt & glare on the dynamic project cards ---------- */
  function bindTilt(card) {
    if (isCoarse) return;
    card.classList.add("tilt-enabled");

    card.addEventListener("mousemove", function (event) {
      var rect = card.getBoundingClientRect();
      var px = (event.clientX - rect.left) / rect.width;
      var py = (event.clientY - rect.top) / rect.height;
      card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
      card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
      card.style.setProperty("--rx", ((py - 0.5) * -10).toFixed(2) + "deg");
      card.style.setProperty("--ry", ((px - 0.5) * 12).toFixed(2) + "deg");
    });

    card.addEventListener("mouseleave", function () {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  }

  function bindTiltToCards() {
    document.querySelectorAll("#projects .project-card").forEach(bindTilt);
  }

  // The inline renderer injects cards after projects.json loads; it calls
  // this hook once rendering is done.
  window.__bindProjectTilts = function () {
    setTimeout(bindTiltToCards, 0);
  };

})();
