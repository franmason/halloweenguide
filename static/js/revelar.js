(function () {
  var alvos = document.querySelectorAll('.reveal');
  if (!alvos.length) return;

  if (!('IntersectionObserver' in window)) {
    alvos.forEach(function (el) { el.classList.add('visivel'); });
    return;
  }

  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visivel');
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  alvos.forEach(function (el) { observador.observe(el); });
})();
