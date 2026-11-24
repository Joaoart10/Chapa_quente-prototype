// =========================================================
// Transição entre páginas: site (index.html) <-> pedido (pedido.html)
// =========================================================
(function () {
  const html = document.documentElement;
  const overlay = document.getElementById("transicao");
  if (!overlay) return;

  const CHAVE = "cq-transicao";
  const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let navegando = false;
  const DURACAO = 1000; // o botão carrega por 1 segundo antes de abrir a página
  const INICIO_TELA = 450; // a tela de transição começa a subir perto do meio da espera

  function restaurarBotoes() {
    document.querySelectorAll(".btn.carregando").forEach((b) => {
      b.classList.remove("carregando");
      b.removeAttribute("aria-busy");
      b.style.minWidth = "";
    });
  }

  function limpar() {
    overlay.classList.remove("cobrindo", "saindo");
    html.classList.remove("entrando");
    try {
      sessionStorage.removeItem(CHAVE);
    } catch {
      // sem sessionStorage: nada a limpar
    }
  }

  // ----- chegada: a página abre coberta e a tela sobe -----
  if (html.classList.contains("entrando")) {
    let saiu = false;
    const sair = () => {
      if (saiu) return;
      saiu = true;
      html.classList.add("revelando");
      overlay.classList.add("saindo");
      let terminou = false;
      const fim = () => {
        if (terminou) return;
        terminou = true;
        limpar();
        setTimeout(() => html.classList.remove("revelando"), 1500);
      };
      overlay.addEventListener("animationend", fim, { once: true });
      setTimeout(fim, 1400); // garantia
    };
    const iniciar = () => setTimeout(sair, 450);
    if (document.readyState === "complete") iniciar();
    else window.addEventListener("load", iniciar, { once: true });
    setTimeout(sair, 3500); // se a página demorar muito, não deixa a tela presa
  }

  // ----- saída: a tela sobe e só então troca de página -----
  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = e.target.closest("a[href]");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

    const url = new URL(link.href, location.href);
    if (url.protocol !== location.protocol || url.host !== location.host) return;
    if (url.pathname === location.pathname) return; // só âncora na mesma página

    if (navegando) return void e.preventDefault(); // já está abrindo: ignora cliques repetidos
    const destino = url.pathname.endsWith("/pedido.html") ? "pedido" : url.pathname.endsWith("/index.html") || url.pathname.endsWith("/") ? "site" : null;
    if (!destino) return;

    e.preventDefault();
    if (reduzMovimento) return void (location.href = link.href);

    try {
      sessionStorage.setItem(CHAVE, destino);
    } catch {
      // sem sessionStorage: a página nova só não faz a abertura
    }
    html.dataset.destino = destino;
    navegando = true;

    const cobrir = () => overlay.classList.add("cobrindo");
    if (link.classList.contains("btn")) {
      // botão: mantém o tamanho, mostra o carregamento e só depois cobre a página
      link.style.minWidth = link.offsetWidth + "px";
      link.classList.add("carregando");
      link.setAttribute("aria-busy", "true");
      setTimeout(cobrir, INICIO_TELA);
    } else {
      cobrir();
    }
    setTimeout(() => (location.href = link.href), DURACAO);
  });

  // voltar pelo botão do navegador: não deixa a tela de transição presa
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      navegando = false;
      restaurarBotoes();
      limpar();
    }
  });
})();
