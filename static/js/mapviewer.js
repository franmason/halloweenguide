(function () {
  var visor = document.getElementById('visor-mapa');
  var img = document.getElementById('imagem-mapa');
  if (!visor || !img) return;

  var escala = 1, minEscala = 1, maxEscala = 5;
  var deslocX = 0, deslocY = 0;
  var arrastando = false;
  var inicioX = 0, inicioY = 0;

  function aplicar() {
    img.style.transform =
      'translate(-50%, -50%) scale(' + escala + ') translate(' + deslocX + 'px, ' + deslocY + 'px)';
  }

  function limitarEscala(valor) {
    return Math.min(maxEscala, Math.max(minEscala, valor));
  }

  function zoomEm(fator) {
    var novaEscala = limitarEscala(escala * fator);
    if (novaEscala === minEscala) { deslocX = 0; deslocY = 0; }
    escala = novaEscala;
    aplicar();
  }

  function resetar() {
    escala = 1; deslocX = 0; deslocY = 0;
    aplicar();
  }

  // --- Mouse: arrastar ---
  visor.addEventListener('mousedown', function (e) {
    if (escala === 1) return;
    arrastando = true;
    visor.classList.add('arrastando');
    inicioX = e.clientX - deslocX * escala;
    inicioY = e.clientY - deslocY * escala;
  });
  window.addEventListener('mousemove', function (e) {
    if (!arrastando) return;
    deslocX = (e.clientX - inicioX) / escala;
    deslocY = (e.clientY - inicioY) / escala;
    aplicar();
  });
  window.addEventListener('mouseup', function () {
    arrastando = false;
    visor.classList.remove('arrastando');
  });

  // --- Mouse: scroll pra zoom ---
  visor.addEventListener('wheel', function (e) {
    e.preventDefault();
    var fator = e.deltaY < 0 ? 1.15 : 1 / 1.15;
    zoomEm(fator);
  }, { passive: false });

  // --- Touch: arrastar com 1 dedo, pinça com 2 ---
  var toques = {};
  var distanciaInicial = 0;
  var escalaInicial = 1;

  visor.addEventListener('touchstart', function (e) {
    for (var i = 0; i < e.changedTouches.length; i++) {
      var t = e.changedTouches[i];
      toques[t.identifier] = { x: t.clientX, y: t.clientY };
    }
    var pontos = Object.values(toques);
    if (pontos.length === 1 && escala > 1) {
      arrastando = true;
      inicioX = pontos[0].x - deslocX * escala;
      inicioY = pontos[0].y - deslocY * escala;
    } else if (pontos.length === 2) {
      arrastando = false;
      distanciaInicial = distanciaEntre(pontos[0], pontos[1]);
      escalaInicial = escala;
    }
  }, { passive: true });

  visor.addEventListener('touchmove', function (e) {
    e.preventDefault();
    for (var i = 0; i < e.changedTouches.length; i++) {
      var t = e.changedTouches[i];
      if (toques[t.identifier]) toques[t.identifier] = { x: t.clientX, y: t.clientY };
    }
    var pontos = Object.values(toques);
    if (pontos.length === 2) {
      var distanciaAtual = distanciaEntre(pontos[0], pontos[1]);
      var fator = distanciaAtual / (distanciaInicial || distanciaAtual);
      escala = limitarEscala(escalaInicial * fator);
      aplicar();
    } else if (pontos.length === 1 && arrastando) {
      deslocX = (pontos[0].x - inicioX) / escala;
      deslocY = (pontos[0].y - inicioY) / escala;
      aplicar();
    }
  }, { passive: false });

  visor.addEventListener('touchend', function (e) {
    for (var i = 0; i < e.changedTouches.length; i++) {
      delete toques[e.changedTouches[i].identifier];
    }
    if (Object.keys(toques).length === 0) arrastando = false;
  }, { passive: true });

  function distanciaEntre(a, b) {
    var dx = a.x - b.x, dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // --- Botões ---
  document.getElementById('btn-mais').addEventListener('click', function () { zoomEm(1.3); });
  document.getElementById('btn-menos').addEventListener('click', function () { zoomEm(1 / 1.3); });
  document.getElementById('btn-reset').addEventListener('click', resetar);

  // --- Tela cheia com fundo desfocado ---
  var overlay = document.getElementById('mapa-overlay');
  var btnTelaCheia = document.getElementById('btn-tela-cheia');

  function pedirFullscreenNativo() {
    var pedir = visor.requestFullscreen || visor.webkitRequestFullscreen;
    if (!pedir) return;
    var resultado = pedir.call(visor);
    if (resultado && resultado.then) {
      resultado.then(travarPaisagem).catch(function () {});
    } else {
      // Safari antigo dispara webkitfullscreenchange em vez de retornar promise
      travarPaisagem();
    }
  }

  function travarPaisagem() {
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(function () {});
    }
  }

  function destravarOrientacao() {
    if (screen.orientation && screen.orientation.unlock) {
      try { screen.orientation.unlock(); } catch (e) {}
    }
  }

  function sairFullscreenNativo() {
    var elementoAtivo = document.fullscreenElement || document.webkitFullscreenElement;
    if (!elementoAtivo) return;
    var sair = document.exitFullscreen || document.webkitExitFullscreen;
    if (sair) sair.call(document).catch(function () {});
  }

  function abrirTelaCheia(comFullscreenNativo) {
    visor.classList.add('tela-cheia');
    overlay.classList.add('ativo');
    document.body.classList.add('mapa-tela-cheia-ativa');
    btnTelaCheia.setAttribute('aria-label', 'Sair da tela cheia');
    if (comFullscreenNativo) pedirFullscreenNativo();
  }

  function fecharTelaCheia() {
    visor.classList.remove('tela-cheia');
    overlay.classList.remove('ativo');
    document.body.classList.remove('mapa-tela-cheia-ativa');
    btnTelaCheia.setAttribute('aria-label', 'Abrir em tela cheia');
    sairFullscreenNativo();
    destravarOrientacao();
  }

  if (btnTelaCheia && overlay) {
    btnTelaCheia.addEventListener('click', function () {
      visor.classList.contains('tela-cheia') ? fecharTelaCheia() : abrirTelaCheia(true);
    });
    overlay.addEventListener('click', fecharTelaCheia);
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') fecharTelaCheia();
    });

    // Se o fullscreen nativo for encerrado por fora (gesto do sistema, botão
    // voltar do Android etc.), sincroniza nossa visualização com esse estado.
    ['fullscreenchange', 'webkitfullscreenchange'].forEach(function (evento) {
      document.addEventListener(evento, function () {
        var ativo = document.fullscreenElement || document.webkitFullscreenElement;
        if (!ativo && visor.classList.contains('tela-cheia')) {
          visor.classList.remove('tela-cheia');
          overlay.classList.remove('ativo');
          document.body.classList.remove('mapa-tela-cheia-ativa');
          btnTelaCheia.setAttribute('aria-label', 'Abrir em tela cheia');
          destravarOrientacao();
        }
      });
    });

    // No celular, o mapa já abre em tela cheia — não precisa tocar no botão.
    // (Não pede o fullscreen nativo aqui porque o navegador exige um toque
    // do usuário pra isso; o botão continua disponível pra ativar o modo
    // sem barra de endereço e tentar travar a tela em paisagem.)
    if (window.matchMedia('(max-width: 720px)').matches) {
      abrirTelaCheia(false);
    }
  }

  // Double click / double tap pra dar zoom rápido
  var ultimoTap = 0;
  visor.addEventListener('click', function () {
    var agora = Date.now();
    if (agora - ultimoTap < 300) {
      escala === 1 ? zoomEm(2) : resetar();
    }
    ultimoTap = agora;
  });
})();
