// =========================================================
// Chapa Quente — site institucional
// =========================================================
const $ = (id) => document.getElementById(id);
const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ----- Menu no celular -----
const elMenu = $("menu");
const elHamb = $("hamb");

function menu(abrir) {
  elMenu.classList.toggle("aberto", abrir);
  elHamb.setAttribute("aria-expanded", String(abrir));
  elHamb.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
}

elHamb.addEventListener("click", () => menu(elHamb.getAttribute("aria-expanded") !== "true"));
elMenu.addEventListener("click", (e) => e.target.closest("a") && menu(false));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && elMenu.classList.contains("aberto")) {
    menu(false);
    elHamb.focus();
  }
});

// ----- Carrossel de destaques -----
(function carrossel() {
  const hero = $("inicio");
  const area = $("slides");
  const slides = [...hero.querySelectorAll(".slide")];
  const dots = [...hero.querySelectorAll(".dot")];
  const botaoPausa = $("pausa");
  const INTERVALO = 6500;

  let atual = 0;
  let timer = null;
  let pausadoPeloUsuario = reduzMovimento; // quem pede menos movimento começa pausado

  function ir(indice) {
    atual = (indice + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle("ativo", i === atual);
      slide.setAttribute("aria-hidden", String(i !== atual));
    });
    dots.forEach((dot, i) => dot.setAttribute("aria-current", String(i === atual)));
  }

  function parar() {
    clearInterval(timer);
    timer = null;
  }

  function tocar() {
    parar();
    if (!pausadoPeloUsuario) timer = setInterval(() => ir(atual + 1), INTERVALO);
  }

  function atualizarPausa() {
    botaoPausa.classList.toggle("parado", pausadoPeloUsuario);
    botaoPausa.setAttribute("aria-label", pausadoPeloUsuario ? "Retomar a troca automática" : "Pausar a troca automática");
    area.setAttribute("aria-live", pausadoPeloUsuario ? "polite" : "off");
  }

  function manual(indice) {
    ir(indice);
    area.setAttribute("aria-live", "polite");
    tocar();
  }

  $("ant").addEventListener("click", () => manual(atual - 1));
  $("prox").addEventListener("click", () => manual(atual + 1));
  dots.forEach((dot, i) => dot.addEventListener("click", () => manual(i)));

  botaoPausa.addEventListener("click", () => {
    pausadoPeloUsuario = !pausadoPeloUsuario;
    atualizarPausa();
    tocar();
  });

  // para enquanto o mouse ou o foco estão no carrossel
  hero.addEventListener("mouseenter", parar);
  hero.addEventListener("mouseleave", tocar);
  hero.addEventListener("focusin", parar);
  hero.addEventListener("focusout", tocar);

  // deslizar o dedo no celular
  let inicioX = null;
  hero.addEventListener("touchstart", (e) => (inicioX = e.touches[0].clientX), { passive: true });
  hero.addEventListener("touchend", (e) => {
    if (inicioX === null) return;
    const dx = e.changedTouches[0].clientX - inicioX;
    inicioX = null;
    if (Math.abs(dx) > 50) manual(atual + (dx < 0 ? 1 : -1));
  });

  // não troca de slide com a aba em segundo plano
  document.addEventListener("visibilitychange", () => (document.hidden ? parar() : tocar()));

  ir(0);
  atualizarPausa();
  tocar();
})();

// ----- Preços: acompanham o que o administrador alterou no cardápio -----
try {
  const salvos = JSON.parse(localStorage.getItem("chapa-quente-produtos-v1"));
  if (Array.isArray(salvos)) {
    document.querySelectorAll(".card[data-id]").forEach((card) => {
      const produto = salvos.find((p) => p.id === Number(card.dataset.id));
      if (produto) {
        card.querySelector("[data-preco]").textContent = produto.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
      }
    });
  }
} catch {
  // sem localStorage: ficam os preços do HTML
}

// ----- WhatsApp da loja (vem de config.js) -----
if (typeof WHATSAPP_LOJA !== "undefined") {
  const texto = encodeURIComponent("Olá! Vim pelo site da Chapa Quente.");
  document.querySelectorAll("[data-whats]").forEach((a) => (a.href = `https://wa.me/${WHATSAPP_LOJA}?text=${texto}`));
}

// ----- Voltar ao topo -----
const elTopo = $("voltar-topo");
function atualizarTopo() {
  elTopo.hidden = window.scrollY < 700;
}
window.addEventListener("scroll", atualizarTopo, { passive: true });
atualizarTopo();

// ----- Ano do rodapé -----
$("ano").textContent = new Date().getFullYear();
