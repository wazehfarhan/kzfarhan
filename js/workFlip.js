
(function () {
  var workList = document.querySelector("#work .projects-list");
  if (!workList) return;


  if (window.matchMedia("(pointer: coarse)").matches) return;

  var wrappers = Array.prototype.slice.call(
    workList.querySelectorAll(".work-flip"),
  );
  if (wrappers.length === 0) return;

  var MAX_TILT = 30; 
  var MAX_HORIZONTAL_TILT = 6; 
  var PERSPECTIVE = 1400;
  var MAX_LIFT = 160; 

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function update() {
    var vh = window.innerHeight;
    var mid = vh / 2;

    var halfRange = vh * 0.6;

    for (var i = 0; i < wrappers.length; i++) {
      var wrap = wrappers[i];
      var rect = wrap.getBoundingClientRect();
      var cardCenter = rect.top + rect.height / 2;
      var dist = cardCenter - mid;

      var t = clamp(dist / halfRange, -1, 1);
      var angleX = t * MAX_TILT;

    
      var cardCenterX = rect.left + rect.width / 2;
      var tH = clamp((cardCenterX - mid) / vh, -1, 1);
      var angleY = -tH * MAX_HORIZONTAL_TILT;

      var lift = (1 - Math.abs(t)) * MAX_LIFT;

      wrap.style.transform =
        "perspective(" +
        PERSPECTIVE +
        "px) rotateX(" +
        angleX.toFixed(2) +
        "deg) rotateY(" +
        angleY.toFixed(2) +
        "deg) translateZ(" +
        lift.toFixed(1) +
        "px)";
    }

    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
})();
