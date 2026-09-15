(function () {
  function ativarAba(botao) {
    var barra = botao.closest('.abas-botoes');
    var container = botao.closest('.abas');
    if (!barra || !container) return;
    var alvo = botao.getAttribute('data-alvo');

    barra.querySelectorAll('.aba-botao').forEach(function (b) {
      b.classList.remove('ativo');
      b.setAttribute('aria-selected', 'false');
    });
    botao.classList.add('ativo');
    botao.setAttribute('aria-selected', 'true');

    container.querySelectorAll(':scope > .aba-painel').forEach(function (p) {
      p.classList.remove('ativo');
    });
    var painel = container.querySelector(':scope > .aba-painel[data-painel="' + alvo + '"]');
    if (painel) painel.classList.add('ativo');
  }

  document.querySelectorAll('.aba-botao').forEach(function (botao) {
    botao.addEventListener('click', function () { ativarAba(botao); });
  });

  // Abre a aba principal certa quando a página é acessada via #michael ou #sobreviventes
  var hash = window.location.hash.replace('#', '');
  if (hash) {
    var botaoAlvo = document.querySelector('.abas-principais > .abas-botoes > .aba-botao[data-alvo="' + hash + '"]');
    if (botaoAlvo) ativarAba(botaoAlvo);
  }
})();
