// =========================================================
// Chapa Quente — cardápio digital
// =========================================================

// ----- Dados -----
// TAXA_ENTREGA, WHATSAPP_LOJA e SENHA_ADMIN ficam em config.js

const categorias = [
  { id: "burgers",    nome: "Burgers",    icone: "img/classico.png" },
  { id: "porcoes",    nome: "Porções",    icone: "img/batata.png" },
  { id: "drinks",     nome: "Drinks",     icone: "img/refrigerante.png" },
  { id: "sobremesas", nome: "Sobremesas", icone: "img/brownie.png" },
];

// "foto" é o caminho da imagem SEM extensão, dentro da pasta img/.
// O site procura .png, .jpg, .jpeg e .webp, nessa ordem; se não achar, usa img/padrao.svg.
const PRODUTOS_PADRAO = [
  { id: 1,  cat: "burgers",    nome: "Clássico da Chapa",   preco: 24.9, foto: "img/classico",     tag: "Mais pedido", desc: "Pão brioche, blend de 150g, queijo cheddar, alface e tomate." },
  { id: 2,  cat: "burgers",    nome: "Cheddar Bacon",       preco: 29.9, foto: "img/cheddar",      tag: "Mais pedido", desc: "Blend de 150g, bacon crocante, cheddar derretido e molho da casa." },
  { id: 3,  cat: "burgers",    nome: "Barbecue",            preco: 31.9, foto: "img/barbecue",     desc: "Blend de 150g, bacon, cebola crispy, cheddar e molho barbecue." },
  { id: 4,  cat: "burgers",    nome: "Duplo Quente",        preco: 34.9, foto: "img/duplo_quente", tag: "Fome braba",  desc: "Dois blends de 150g, queijo em dobro e muito cheddar derretido." },
  { id: 5,  cat: "burgers",    nome: "Especial da Casa",    preco: 36.9, foto: "img/especial",     tag: "Chef indica", desc: "Blend de 150g, bacon, ovo, cheddar e molho especial da casa." },
  { id: 6,  cat: "burgers",    nome: "Veggie Grill",        preco: 27.9, foto: "img/veggie", desc: "Hambúrguer de grão-de-bico, rúcula, tomate seco e maionese verde." },
  { id: 7,  cat: "porcoes",    nome: "Batata Frita",        preco: 16.0, foto: "img/batata",       desc: "Porção crocante com sal e orégano." },
  { id: 8,  cat: "porcoes",    nome: "Anéis de Cebola",     preco: 18.0, foto: "img/aneis", desc: "Cebola empanada com molho barbecue." },
  { id: 9,  cat: "drinks",     nome: "Refrigerante Lata",   preco: 6.0,  foto: "img/refrigerante", ajuste: "contain", desc: "Cola, guaraná ou limão. 350ml." },
  { id: 10, cat: "drinks",     nome: "Suco Natural",        preco: 9.0,  foto: "img/suco", desc: "Laranja ou limão, feito na hora. 400ml." },
  { id: 11, cat: "sobremesas", nome: "Brownie com Sorvete", preco: 17.0, foto: "img/brownie",      desc: "Brownie quentinho com uma bola de sorvete de creme." },
  { id: 12, cat: "sobremesas", nome: "Milkshake",           preco: 19.0, foto: "img/milk",    desc: "Chocolate, morango ou baunilha. 400ml." },
];

// itens do cardápio: o que o administrador cadastra fica salvo neste navegador
const CHAVE_PRODUTOS = "chapa-quente-produtos-v1";

function carregarProdutos() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE_PRODUTOS));
    if (Array.isArray(salvo) && salvo.length) return salvo;
  } catch {
    // usa o cardápio original
  }
  return PRODUTOS_PADRAO.map((p) => ({ ...p }));
}

function salvarProdutos() {
  try {
    localStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(produtos));
    return true;
  } catch {
    return false;
  }
}

let produtos = carregarProdutos();

const EXTENSOES = [".png", ".jpg", ".jpeg", ".webp"];
const FOTO_PADRAO = "img/padrao.svg";

const ICONE_CORACAO = `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path stroke-linejoin="round" d="M12 21.350l-1.450-1.320C5.400 15.360 2 12.280 2 8.500 2 5.420 4.420 3 7.500 3c1.740 0 3.410.810 4.500 2.090C13.090 3.810 14.760 3 16.500 3 19.580 3 22 5.420 22 8.500c0 3.780-3.400 6.860-8.550 11.540L12 21.350z"/></svg>`;

const ICONE_CHAMA = `<svg viewBox="0 0 24 28" width="34" height="40" aria-hidden="true"><path d="M12 1c1 5 7 8 7 15a7 7 0 0 1-14 0c0-3 1.500-5 3-6.500.2 2 1.200 3 2.200 3.500C10 9 10.500 5 12 1z" fill="#E8812F"/><path d="M12 14c.6 2.500 3.500 3.500 3.500 6.500a3.500 3.500 0 0 1-7 0c0-1.800.8-2.800 1.800-3.800.2 1 .8 1.500 1.200 1.700-.3-1.800 0-3 .5-4.400z" fill="#F4E3B8"/></svg>`;

// ----- Estado (salvo no navegador) -----
const CHAVE = "chapa-quente-v3";

function carregar() {
  const padrao = { itens: {}, favoritos: {}, modo: "retirada", proximo: 427 };
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE));
    return salvo ? { ...padrao, ...salvo } : padrao;
  } catch {
    return padrao;
  }
}

function salvar() {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(estado));
  } catch {
    // sem localStorage, a comanda continua funcionando nesta visita
  }
}

let estado = carregar();

// ----- Histórico de pedidos (fica salvo neste aparelho, mesmo depois de sair do site) -----
const CHAVE_HISTORICO = "chapa-quente-historico-v1";
const MAX_HISTORICO = 30;

function carregarHistorico() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE_HISTORICO));
    return Array.isArray(salvo) ? salvo : [];
  } catch {
    return [];
  }
}

function salvarHistorico() {
  try {
    localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(historico));
  } catch {
    // sem localStorage: o histórico vale só nesta visita
  }
}

let historico = carregarHistorico();

// ----- Elementos -----
const $ = (id) => document.getElementById(id);
const elAbas = $("abas");
const elFolha = $("folha");
const elComanda = $("comanda");
const elTitulo = $("comanda-titulo");
const elNumero = $("numero");
const elVazio = $("vazio");
const elItens = $("itens");
const elResumo = $("resumo");
const elSubtotal = $("subtotal");
const elEntrega = $("entrega");
const elTotal = $("total");
const elContador = $("contador");
const elBarra = $("barra");
const elBarraQtd = $("barra-qtd");
const elBarraTotal = $("barra-total");
const elAviso = $("aviso");
const elNome = $("nome");
const elEndereco = $("endereco");
const elCampoEndereco = $("campo-endereco");
const elFundo = $("fundo");
const elDialog = $("confirmacao");
const elConferir = $("conferir");
const elHist = $("historico");
const elToast = $("toast");
const gatilhos = [$("abrir-topo"), $("abrir-barra")];
const desktop = window.matchMedia("(min-width: 900px)");

// ----- Utilidades -----
const moeda = (valor) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// evita que texto digitado pelo administrador vire HTML
const esc = (t) =>
  String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const buscar = (id) => produtos.find((p) => p.id === id);

// ----- Cardápio -----
function htmlAcao(p) {
  const qtd = estado.itens[p.id] || 0;
  if (!qtd) {
    return `<button type="button" class="btn" data-acao="add" data-id="${p.id}"
              aria-label="Adicionar ${esc(p.nome)}">Adicionar</button>`;
  }
  return `
    <div class="stepper" role="group" aria-label="Quantidade de ${esc(p.nome)}">
      <button type="button" data-acao="menos" data-id="${p.id}" aria-label="Diminuir quantidade de ${esc(p.nome)}">−</button>
      <output aria-live="off">${qtd}</output>
      <button type="button" data-acao="mais" data-id="${p.id}" aria-label="Aumentar quantidade de ${esc(p.nome)}">+</button>
    </div>`;
}

function htmlFoto(p) {
  const fim = EXTENSOES.length - 1; // depois da última extensão vem a imagem padrão
  if (p.fotoData) return `<img src="${p.fotoData}" data-i="${fim}" alt="" width="132" height="132">`;
  if (!p.foto) return `<img src="${FOTO_PADRAO}" data-i="${fim}" data-padrao="1" alt="" width="132" height="132">`;
  return `<img src="${p.foto}${EXTENSOES[0]}" data-base="${p.foto}" data-i="0" alt="" width="132" height="132">`;
}

function htmlItem(p) {
  const favorito = Boolean(estado.favoritos[p.id]);
  return `
    <li class="item" id="item-${p.id}">
      <div class="item__foto${p.ajuste ? " item__foto--" + p.ajuste : ""}">
        ${htmlFoto(p)}
        ${p.tag ? `<span class="item__tag">${esc(p.tag)}</span>` : ""}
        <button type="button" class="coracao" data-acao="fav" data-id="${p.id}"
                aria-pressed="${favorito}" aria-label="Favoritar ${esc(p.nome)}">${ICONE_CORACAO}</button>
      </div>
      <div class="item__corpo">
        <h3 class="item__nome">${esc(p.nome)}</h3>
        <p class="item__desc">${esc(p.desc)}</p>
        <div class="item__rodape">
          <div class="item__acao">${htmlAcao(p)}</div>
          <span class="item__preco">${moeda(p.preco)}</span>
        </div>
      </div>
    </li>`;
}

// foto não encontrada: tenta a próxima extensão, depois a imagem padrão; se tudo falhar, mostra o espaço reservado
elFolha.addEventListener(
  "error",
  (evento) => {
    const img = evento.target;
    if (!(img instanceof HTMLImageElement)) return;
    const proxima = Number(img.dataset.i) + 1;
    if (proxima < EXTENSOES.length) {
      img.dataset.i = proxima;
      img.src = img.dataset.base + EXTENSOES[proxima];
    } else if (!img.dataset.padrao) {
      img.dataset.padrao = "1";
      img.src = FOTO_PADRAO;
    } else {
      const vazio = document.createElement("span");
      vazio.className = "foto-vazia";
      vazio.setAttribute("aria-hidden", "true");
      vazio.innerHTML = ICONE_CHAMA;
      img.replaceWith(vazio);
    }
  },
  true
);

function renderCardapio() {
  const ativas = categorias.filter((c) => produtos.some((p) => p.cat === c.id));
  elAbas.innerHTML = ativas
    .map(
      (c) => `<a class="aba" href="#cat-${c.id}">
        <span class="aba__foto" aria-hidden="true"><img src="${c.icone || FOTO_PADRAO}" alt="" width="44" height="44"></span>
        <span class="aba__nome">${c.nome}</span>
      </a>`
    )
    .join("");

  elFolha.innerHTML = ativas
    .map((c) => {
      const itens = produtos.filter((p) => p.cat === c.id);
      return `
        <section class="grupo" id="cat-${c.id}" aria-labelledby="t-${c.id}">
          <h2 class="grupo__titulo" id="t-${c.id}">${c.nome}</h2>
          <ul class="grupo__lista">${itens.map(htmlItem).join("")}</ul>
        </section>`;
    })
    .join("");
}

function atualizarItem(id) {
  const li = $("item-" + id);
  if (li) li.querySelector(".item__acao").innerHTML = htmlAcao(buscar(id));
}

// destaca a aba da categoria que está na tela
let observador = null;

function observarCategorias() {
  const abas = [...elAbas.querySelectorAll(".aba")];
  if (observador) observador.disconnect();
  observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        abas.forEach((aba) => {
          const ativa = aba.getAttribute("href") === "#" + entrada.target.id;
          aba.classList.toggle("aba--ativa", ativa);
          if (ativa) {
            aba.setAttribute("aria-current", "true");
            elAbas.scrollTo({ left: aba.offsetLeft - 16, behavior: "smooth" });
          } else {
            aba.removeAttribute("aria-current");
          }
        });
      });
    },
    { rootMargin: "-25% 0px -65% 0px" }
  );
  document.querySelectorAll(".grupo").forEach((g) => observador.observe(g));
}

// ----- Comanda -----
function totais() {
  const ids = Object.keys(estado.itens).map(Number).filter(buscar);
  const subtotal = ids.reduce((s, id) => s + buscar(id).preco * estado.itens[id], 0);
  const quantidade = ids.reduce((s, id) => s + estado.itens[id], 0);
  const taxa = ids.length && estado.modo === "entrega" ? TAXA_ENTREGA : 0;
  return { ids, subtotal, quantidade, taxa, total: subtotal + taxa };
}

function renderComanda() {
  const { ids, subtotal, quantidade, taxa, total } = totais();
  const vazio = ids.length === 0;

  elNumero.textContent = "nº " + String(estado.proximo).padStart(4, "0");
  elVazio.hidden = !vazio;
  elResumo.hidden = vazio;

  elItens.innerHTML = ids
    .map((id) => {
      const p = buscar(id);
      const qtd = estado.itens[id];
      return `
        <li class="linha">
          <div class="linha__topo">
            <span class="linha__nome">${qtd}× ${esc(p.nome)}</span>
            <span class="linha__pontos" aria-hidden="true"></span>
            <span class="linha__preco">${moeda(p.preco * qtd)}</span>
          </div>
          <div class="linha__acoes">
            <div class="stepper stepper--p" role="group" aria-label="Quantidade de ${esc(p.nome)}">
              <button type="button" data-acao="menos" data-id="${id}" aria-label="Diminuir quantidade de ${esc(p.nome)}">−</button>
              <output>${qtd}</output>
              <button type="button" data-acao="mais" data-id="${id}" aria-label="Aumentar quantidade de ${esc(p.nome)}">+</button>
            </div>
            <button type="button" class="link" data-acao="remover" data-id="${id}"
                    aria-label="Remover ${esc(p.nome)} da sacola">Remover</button>
          </div>
        </li>`;
    })
    .join("");

  $("subtotal-sacola").textContent = moeda(subtotal);
  elSubtotal.textContent = moeda(subtotal);
  elEntrega.textContent = estado.modo === "entrega" ? moeda(TAXA_ENTREGA) : "Grátis";
  elTotal.textContent = moeda(total);
  elCampoEndereco.hidden = estado.modo !== "entrega";
  document.querySelector(`input[name="modo"][value="${estado.modo}"]`).checked = true;

  const textoQtd = `${quantidade} ${quantidade === 1 ? "item" : "itens"}`;
  elContador.textContent = quantidade;
  elBarraQtd.textContent = textoQtd;
  elBarraTotal.textContent = moeda(total);
  elBarra.hidden = vazio;

  renderConferirItens(ids);

  elAviso.textContent = vazio
    ? "Sacola vazia."
    : `${textoQtd} na sacola. Total ${moeda(total)}.`;
}

// lista (somente leitura) da tela "Conferir pedido"
function renderConferirItens(ids) {
  $("conf-itens").innerHTML = ids
    .map((id) => {
      const p = buscar(id);
      const qtd = estado.itens[id];
      return `
        <li class="linha">
          <div class="linha__topo">
            <span class="linha__nome">${qtd}× ${esc(p.nome)}</span>
            <span class="linha__pontos" aria-hidden="true"></span>
            <span class="linha__preco">${moeda(p.preco * qtd)}</span>
          </div>
        </li>`;
    })
    .join("");
}

function mudar(id, delta) {
  const nova = (estado.itens[id] || 0) + delta;
  if (nova <= 0) delete estado.itens[id];
  else estado.itens[id] = Math.min(nova, 20);
  if (delta > 0) toast(`Adicionado à sacola: ${buscar(id).nome}`);
  depoisDeMudar(id);
}

function remover(id) {
  delete estado.itens[id];
  depoisDeMudar(id);
}

function depoisDeMudar(id) {
  salvar();
  atualizarItem(id);
  renderComanda();
}

// cliques nos botões do cardápio e da comanda (delegação de eventos)
function aoClicar(evento) {
  const botao = evento.target.closest("button[data-acao]");
  if (!botao) return;

  const id = Number(botao.dataset.id);
  const acao = botao.dataset.acao;
  const area = botao.closest("#comanda") ? elItens : elFolha;

  // favoritar não redesenha nada: só troca o estado do coração
  if (acao === "fav") {
    const ativo = !estado.favoritos[id];
    if (ativo) estado.favoritos[id] = true;
    else delete estado.favoritos[id];
    botao.setAttribute("aria-pressed", String(ativo));
    salvar();
    return;
  }

  if (acao === "add" || acao === "mais") mudar(id, 1);
  else if (acao === "menos") mudar(id, -1);
  else if (acao === "remover") remover(id);

  // o HTML foi redesenhado: devolve o foco ao botão equivalente
  const noCarrinho = estado.itens[id] > 0;
  const alvo = acao === "remover" ? null : acao === "menos" && !noCarrinho ? "add" : "mais";
  const novo = alvo && area.querySelector(`button[data-acao="${alvo}"][data-id="${id}"]`);
  const destino = novo || (acao === "menos" || acao === "remover" ? elFolha.querySelector(`#item-${id} [data-acao="add"]`) : null);
  if (area === elItens && !noCarrinho) elTitulo.focus();
  else if (destino) destino.focus();
}

elFolha.addEventListener("click", aoClicar);
elComanda.addEventListener("click", aoClicar);

// ----- Retirada ou entrega -----
document.querySelectorAll('input[name="modo"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    estado.modo = radio.value;
    salvar();
    renderComanda();
  });
});

// ----- Gaveta da comanda (celular) -----
let ultimoGatilho = gatilhos[0];

function abrirComanda(gatilho) {
  if (desktop.matches) {
    elTitulo.focus();
    elComanda.scrollIntoView({ block: "nearest" });
    return;
  }
  ultimoGatilho = gatilho || ultimoGatilho;
  elToast.hidden = true; // o aviso não cobre os botões da sacola
  document.body.classList.add("comanda-aberta");
  elFundo.hidden = false;
  gatilhos.forEach((g) => g.setAttribute("aria-expanded", "true"));
  elTitulo.focus({ preventScroll: true });
}

function fecharComanda(devolverFoco = true) {
  document.body.classList.remove("comanda-aberta");
  elFundo.hidden = true;
  gatilhos.forEach((g) => g.setAttribute("aria-expanded", "false"));
  if (devolverFoco && ultimoGatilho && !ultimoGatilho.closest("[hidden]")) ultimoGatilho.focus();
}

gatilhos.forEach((g) => g.addEventListener("click", () => abrirComanda(g)));
$("fechar-comanda").addEventListener("click", () => fecharComanda());
elFundo.addEventListener("click", () => fecharComanda());
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && document.body.classList.contains("comanda-aberta")) fecharComanda();
});
desktop.addEventListener("change", () => fecharComanda(false));

// ----- Enviar pedido -----
function marcarErro(campo, erroId, temErro) {
  campo.setAttribute("aria-invalid", temErro ? "true" : "false");
  $(erroId).hidden = !temErro;
}

// texto do pedido que chega no WhatsApp da loja (feito a partir do pedido salvo)
function mensagemDoPedido(p) {
  const linhas = p.itens.map((i) => `• ${i.qtd}x ${i.nome} — ${moeda(i.preco * i.qtd)}`);
  return [
    `*Novo pedido nº ${p.numero} — Chapa Quente*`,
    "",
    `Cliente: ${p.nome}`,
    p.modo === "entrega" ? `Entrega em: ${p.endereco}` : "Retirada no balcão",
    ...(p.modo === "entrega" && p.referencia ? [`Referência: ${p.referencia}`] : []),
    "",
    "*Itens*",
    ...linhas,
    "",
    `Subtotal: ${moeda(p.subtotal)}`,
    ...(p.taxa ? [`Taxa de entrega: ${moeda(p.taxa)}`] : []),
    `*Total: ${moeda(p.total)}*`,
    `Pagamento: ${p.pagamento}`,
  ].join("\n");
}

const linkWhats = (p) => `https://wa.me/${WHATSAPP_LOJA}?text=${encodeURIComponent(mensagemDoPedido(p))}`;

// valida os dados e abre a tela de pagamento
function enviarPedido() {
  const nome = elNome.value.trim();
  const rua = elEndereco.value.trim();
  const numeroEnd = $("end-numero").value.trim();
  const complemento = $("end-complemento").value.trim();
  const referencia = $("end-referencia").value.trim();
  const precisaEndereco = estado.modo === "entrega";

  const nomeInvalido = nome.length < 2;
  const enderecoInvalido = precisaEndereco && rua.length < 5;
  const numeroInvalido = precisaEndereco && numeroEnd.length < 1;

  marcarErro(elNome, "erro-nome", nomeInvalido);
  marcarErro(elEndereco, "erro-endereco", enderecoInvalido);
  marcarErro($("end-numero"), "erro-end-numero", numeroInvalido);

  if (nomeInvalido) return elNome.focus();
  if (enderecoInvalido) return elEndereco.focus();
  if (numeroInvalido) return $("end-numero").focus();

  const endereco = precisaEndereco ? `${rua}, nº ${numeroEnd}${complemento ? ` — ${complemento}` : ""}` : "";

  abrirPagamento({
    numero: String(estado.proximo).padStart(4, "0"),
    nome,
    endereco,
    referencia: precisaEndereco ? referencia : "",
    entrega: precisaEndereco ? { rua, numero: numeroEnd, complemento, referencia } : null,
    resumo: totais(),
  });
}

// ----- Pagamento (simulado: nada é cobrado nem guardado) -----
const elPag = $("pagamento");
const elPagar = $("pagar");
const METODOS = { pix: "Pix", cartao: "Cartão de crédito", dinheiro: "Dinheiro" };
const CARTAO_RECUSADO = "4000000000000002";
let pedidoPendente = null;
let processando = false;

const metodoAtual = () => document.querySelector('input[name="metodo"]:checked').value;
const soDigitos = (t) => t.replace(/\D/g, "");

// QR Code só decorativo, gerado a partir do número do pedido
function gerarQr(semente) {
  const n = 25;
  let x = (semente + 7) * 9301;
  const rnd = () => (x = (x * 9301 + 49297) % 233280) / 233280;
  const finder = (ox, oy) =>
    `M${ox} ${oy}h7v7h-7zM${ox + 1} ${oy + 1}h5v5h-5zM${ox + 2} ${oy + 2}h3v3h-3z`;
  let pontos = "";
  for (let y = 0; y < n; y++) {
    for (let c = 0; c < n; c++) {
      const canto = (c < 8 && y < 8) || (c >= n - 8 && y < 8) || (c < 8 && y >= n - 8);
      if (!canto && rnd() > 0.5) pontos += `M${c} ${y}h1v1h-1z`;
    }
  }
  return `<svg viewBox="-1 -1 ${n + 2} ${n + 2}" shape-rendering="crispEdges" aria-hidden="true">
    <path fill="#1B130E" fill-rule="evenodd" d="${finder(0, 0)}${finder(n - 7, 0)}${finder(0, n - 7)}${pontos}"/></svg>`;
}

function atualizarBotaoPagar() {
  const metodo = metodoAtual();
  elPagar.disabled = false;
  elPagar.classList.remove("btn--carregando");
  elPagar.textContent =
    metodo === "dinheiro" ? "Confirmar pedido" : metodo === "pix" ? "Já paguei (simular Pix)" : `Pagar ${moeda(pedidoPendente.resumo.total)}`;
}

function trocarMetodo() {
  const metodo = metodoAtual();
  ["pix", "cartao", "dinheiro"].forEach((m) => ($("painel-" + m).hidden = m !== metodo));
  $("erro-pagamento").hidden = true;
  atualizarBotaoPagar();
}

function limparCartao() {
  ["cartao-num", "cartao-nome", "cartao-val", "cartao-cvv"].forEach((id) => {
    $(id).value = "";
    $(id).setAttribute("aria-invalid", "false");
  });
  document.querySelectorAll("#painel-cartao .campo__erro").forEach((e) => (e.hidden = true));
  atualizarPrevia();
}

function atualizarPrevia() {
  const num = soDigitos($("cartao-num").value).padEnd(16, "•").replace(/(.{4})/g, "$1 ").trim();
  $("prev-num").textContent = num;
  $("prev-nome").textContent = $("cartao-nome").value.trim() || "Nome no cartão";
  $("prev-val").textContent = $("cartao-val").value || "MM/AA";
}

function abrirPagamento(pedido) {
  pedidoPendente = pedido;
  processando = false;
  const { numero, resumo } = pedido;
  const entrega = estado.modo === "entrega";

  $("pag-total").textContent = moeda(resumo.total);
  $("pag-resumo").textContent = `Comanda nº ${numero} · ${resumo.quantidade} ${resumo.quantidade === 1 ? "item" : "itens"}`;
  $("pag-dinheiro-rotulo").textContent = entrega ? "Na entrega" : "Na retirada";
  $("pag-dinheiro-texto").textContent = entrega ? "na entrega" : "na retirada";
  $("pix-codigo").value = `CHAPAQUENTE-TESTE-${numero}-${Math.round(resumo.total * 100)}`;
  $("pix-qr").innerHTML = gerarQr(Number(numero));
  $("pix-aviso").textContent = "";
  limparCartao();
  document.querySelector('input[name="metodo"][value="pix"]').checked = true;
  trocarMetodo();
  elConferir.close();
  elPag.showModal();
}

function fecharPagamento() {
  if (processando) return;
  elPag.close();
  limparCartao(); // nada do cartão fica guardado
  if (totais().ids.length) elConferir.showModal(); // volta para a etapa anterior
}

document.querySelectorAll('input[name="metodo"]').forEach((r) => r.addEventListener("change", trocarMetodo));
$("pag-fechar").addEventListener("click", fecharPagamento);
elPag.addEventListener("cancel", (e) => processando && e.preventDefault());

$("pix-copiar").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText($("pix-codigo").value);
    $("pix-aviso").textContent = "Código de teste copiado.";
  } catch {
    $("pix-codigo").select();
    $("pix-aviso").textContent = "Selecione e copie o código acima.";
  }
});

// máscaras do cartão
$("cartao-num").addEventListener("input", (e) => {
  e.target.value = soDigitos(e.target.value).slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  marcarErro(e.target, "erro-c-num", false);
  atualizarPrevia();
});
$("cartao-nome").addEventListener("input", (e) => {
  marcarErro(e.target, "erro-c-nome", false);
  atualizarPrevia();
});
$("cartao-val").addEventListener("input", (e) => {
  const d = soDigitos(e.target.value).slice(0, 4);
  e.target.value = d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  marcarErro(e.target, "erro-c-val", false);
  atualizarPrevia();
});
$("cartao-cvv").addEventListener("input", (e) => {
  e.target.value = soDigitos(e.target.value).slice(0, 4);
  marcarErro(e.target, "erro-c-cvv", false);
});

function validadeOk(texto) {
  const m = /^(\d{2})\/(\d{2})$/.exec(texto);
  if (!m) return false;
  const mes = Number(m[1]);
  const ano = 2000 + Number(m[2]);
  const hoje = new Date();
  return mes >= 1 && mes <= 12 && (ano > hoje.getFullYear() || (ano === hoje.getFullYear() && mes >= hoje.getMonth() + 1));
}

function validarCartao() {
  const erros = [
    ["cartao-num", "erro-c-num", soDigitos($("cartao-num").value).length !== 16],
    ["cartao-nome", "erro-c-nome", $("cartao-nome").value.trim().length < 2],
    ["cartao-val", "erro-c-val", !validadeOk($("cartao-val").value)],
    ["cartao-cvv", "erro-c-cvv", $("cartao-cvv").value.length < 3],
  ];
  erros.forEach(([campo, erro, invalido]) => marcarErro($(campo), erro, invalido));
  const primeiro = erros.find((e) => e[2]);
  if (primeiro) $(primeiro[0]).focus();
  return !primeiro;
}

elPagar.addEventListener("click", () => {
  if (processando) return;
  const metodo = metodoAtual();
  $("erro-pagamento").hidden = true;
  if (metodo === "cartao" && !validarCartao()) return;
  if (metodo === "dinheiro") return concluirPedido(metodo);

  const recusado = metodo === "cartao" && soDigitos($("cartao-num").value) === CARTAO_RECUSADO;
  processando = true;
  elPagar.disabled = true;
  elPagar.classList.add("btn--carregando");
  elPagar.textContent = "Processando pagamento…";
  setTimeout(() => {
    processando = false;
    if (recusado) {
      atualizarBotaoPagar();
      $("erro-pagamento").textContent = "Pagamento recusado (cartão de teste de recusa). Tente outro cartão ou outra forma de pagamento.";
      $("erro-pagamento").hidden = false;
      return;
    }
    concluirPedido(metodo);
  }, 1600);
});

// pagamento aprovado (ou combinado): salva no histórico e prepara o envio ao WhatsApp
function concluirPedido(metodo) {
  const { numero, nome, endereco, referencia, entrega, resumo } = pedidoPendente;
  const modoEntrega = estado.modo === "entrega";
  const pago = metodo !== "dinheiro";
  const quando = modoEntrega ? "na entrega" : "na retirada";

  const pedido = {
    numero,
    criadoEm: new Date().toISOString(),
    nome,
    modo: estado.modo,
    endereco: modoEntrega ? endereco : "",
    referencia: modoEntrega ? referencia : "",
    entrega: modoEntrega ? entrega : null,
    itens: resumo.ids.map((id) => ({ id, nome: buscar(id).nome, preco: buscar(id).preco, qtd: estado.itens[id] })),
    subtotal: resumo.subtotal,
    taxa: resumo.taxa,
    total: resumo.total,
    pagamento: pago ? `${METODOS[metodo]} (pago — teste)` : `Dinheiro ${quando} (a pagar)`,
  };
  historico = [pedido, ...historico].slice(0, MAX_HISTORICO);
  salvarHistorico();
  renderHistorico();

  const recado = modoEntrega ? "Vamos levar até o endereço informado." : "Avisamos quando estiver pronto para retirar no balcão.";
  $("confirma-texto").textContent =
    `${nome}, seu pedido nº ${numero} foi realizado com sucesso! ` +
    (pago ? "Pagamento aprovado (modo teste, nada foi cobrado). " : `O pagamento será em dinheiro ${quando}. `) +
    `${recado} Toque em “Enviar pedido pelo WhatsApp” para a loja receber o seu pedido.`;
  $("confirma-whats").href = linkWhats(pedido);

  estado.proximo += 1;
  estado.itens = {};
  salvar();

  produtos.forEach((p) => atualizarItem(p.id));
  renderComanda();
  elNome.value = "";
  elEndereco.value = "";
  ["end-numero", "end-complemento", "end-referencia"].forEach((id) => ($(id).value = ""));
  pedidoPendente = null;
  elPag.close();
  limparCartao();
  fecharComanda(false);
  elDialog.showModal();
}

$("enviar").addEventListener("click", enviarPedido);
$("fechar-confirmacao").addEventListener("click", () => elDialog.close());
elNome.addEventListener("input", () => marcarErro(elNome, "erro-nome", false));
elEndereco.addEventListener("input", () => marcarErro(elEndereco, "erro-endereco", false));
$("end-numero").addEventListener("input", () => marcarErro($("end-numero"), "erro-end-numero", false));

$("limpar").addEventListener("click", () => {
  estado.itens = {};
  salvar();
  produtos.forEach((p) => atualizarItem(p.id));
  renderComanda();
});

// ----- Aviso "Adicionado à sacola" -----
let timerToast = null;

function toast(texto) {
  elToast.querySelector("span").textContent = texto;
  elToast.hidden = false;
  elToast.classList.remove("toast--entra");
  void elToast.offsetWidth; // reinicia a animação a cada item
  elToast.classList.add("toast--entra");
  clearTimeout(timerToast);
  timerToast = setTimeout(() => (elToast.hidden = true), 2200);
}

// ----- Etapa "Conferir pedido" -----
// reaproveita nome e endereço do último pedido, se os campos estiverem vazios
function preencherDadosAnteriores() {
  if (!historico.length) return;
  if (!elNome.value) elNome.value = historico[0].nome;
  const ultimaEntrega = historico.find((p) => p.entrega);
  if (!ultimaEntrega) return;
  const e = ultimaEntrega.entrega;
  if (!elEndereco.value) elEndereco.value = e.rua;
  if (!$("end-numero").value) $("end-numero").value = e.numero;
  if (!$("end-complemento").value) $("end-complemento").value = e.complemento || "";
  if (!$("end-referencia").value) $("end-referencia").value = e.referencia || "";
}

$("conferir-abrir").addEventListener("click", () => {
  if (!totais().ids.length) return;
  preencherDadosAnteriores();
  renderComanda();
  elConferir.showModal();
});
$("conf-fechar").addEventListener("click", () => elConferir.close());

// ----- Meus pedidos -----
function dataBR(iso) {
  const d = new Date(iso);
  return `${d.toLocaleDateString("pt-BR")} às ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
}

function renderHistorico() {
  const vazio = historico.length === 0;
  $("hist-vazio").hidden = !vazio;
  $("hist-limpar").hidden = vazio;
  $("contador-pedidos").hidden = vazio;
  $("contador-pedidos").textContent = historico.length;

  $("hist-lista").innerHTML = historico
    .map(
      (p, i) => `
      <li class="hist__pedido">
        <div class="hist__cab">
          <strong>Pedido nº ${esc(p.numero)}</strong>
          <time datetime="${esc(p.criadoEm)}">${dataBR(p.criadoEm)}</time>
        </div>
        <ul class="hist__itens">
          ${p.itens.map((it) => `<li><span>${it.qtd}× ${esc(it.nome)}</span><span>${moeda(it.preco * it.qtd)}</span></li>`).join("")}
        </ul>
        <dl class="hist__meta">
          <div><dt>Recebimento</dt><dd>${p.modo === "entrega" ? "Entrega — " + esc(p.endereco) : "Retirada no balcão"}</dd></div>
          <div><dt>Pagamento</dt><dd>${esc(p.pagamento)}</dd></div>
          <div class="hist__total"><dt>Total</dt><dd>${moeda(p.total)}</dd></div>
        </dl>
        <div class="hist__acoes">
          <button type="button" class="btn btn--laranja" data-hist="repetir" data-i="${i}">Pedir de novo</button>
          <a class="btn btn--escuro" href="${linkWhats(p)}" target="_blank" rel="noopener">Reenviar no WhatsApp</a>
        </div>
      </li>`
    )
    .join("");
}

function pedirDeNovo(pedido) {
  let faltou = false;
  pedido.itens.forEach((it) => {
    if (!buscar(it.id)) return void (faltou = true);
    estado.itens[it.id] = Math.min((estado.itens[it.id] || 0) + it.qtd, 20);
  });
  salvar();
  produtos.forEach((p) => atualizarItem(p.id));
  renderComanda();
  elHist.close();
  toast(faltou ? "Itens adicionados. Alguns já não estão no cardápio." : "Itens adicionados à sacola!");
  abrirComanda();
}

$("abrir-historico").addEventListener("click", () => {
  renderHistorico();
  elHist.showModal();
});
$("hist-fechar").addEventListener("click", () => elHist.close());
$("hist-lista").addEventListener("click", (e) => {
  const botao = e.target.closest("button[data-hist]");
  if (botao) pedirDeNovo(historico[Number(botao.dataset.i)]);
});
$("hist-limpar").addEventListener("click", () => {
  if (!confirm("Apagar todo o histórico de pedidos deste aparelho?")) return;
  historico = [];
  salvarHistorico();
  renderHistorico();
});
$("confirma-historico").addEventListener("click", () => {
  elDialog.close();
  renderHistorico();
  elHist.showModal();
});

// ----- Modo administrador -----
const elAdmin = $("admin");
const elSenha = $("admin-senha");
const elAdmAviso = $("admin-aviso");
let editandoId = null;
let fotoNova = null;

function abrirAdmin() {
  $("admin-login").hidden = false;
  $("admin-painel").hidden = true;
  elSenha.value = "";
  marcarErro(elSenha, "erro-senha", false);
  elAdmin.showModal();
  elSenha.focus();
}

$("abrir-admin").addEventListener("click", abrirAdmin);
$("admin-fechar").addEventListener("click", () => elAdmin.close());
$("admin-sair").addEventListener("click", () => elAdmin.close());
elSenha.addEventListener("input", () => marcarErro(elSenha, "erro-senha", false));

$("admin-login").addEventListener("submit", (e) => {
  e.preventDefault();
  if (elSenha.value !== SENHA_ADMIN) {
    marcarErro(elSenha, "erro-senha", true);
    return elSenha.focus();
  }
  $("admin-login").hidden = true;
  $("admin-painel").hidden = false;
  limparFormAdmin();
  renderListaAdmin();
  $("admin-nome").focus();
});

function renderListaAdmin() {
  const nomes = Object.fromEntries(categorias.map((c) => [c.id, c.nome]));
  $("admin-lista").innerHTML = produtos
    .map(
      (p) => `
      <li class="admin__item">
        <div><strong>${esc(p.nome)}</strong><small>${nomes[p.cat]} · ${moeda(p.preco)}</small></div>
        <div class="admin__acoes">
          <button type="button" class="link" data-admin="editar" data-id="${p.id}" aria-label="Editar ${esc(p.nome)}">Editar</button>
          <button type="button" class="link" data-admin="excluir" data-id="${p.id}" aria-label="Excluir ${esc(p.nome)}">Excluir</button>
        </div>
      </li>`
    )
    .join("");
}

function limparFormAdmin() {
  editandoId = null;
  fotoNova = null;
  $("admin-form").reset();
  $("admin-previa").hidden = true;
  $("admin-form-titulo").textContent = "Novo item";
  $("admin-salvar").textContent = "Adicionar ao cardápio";
  $("admin-cancelar").hidden = true;
  ["admin-nome", "admin-preco"].forEach((id) => marcarErro($(id), "erro-" + id.slice(6), false));
}

function atualizarCardapio() {
  renderCardapio();
  observarCategorias();
  renderComanda();
  renderListaAdmin();
}

function avisoAdmin(texto) {
  elAdmAviso.textContent = texto;
}

// recorta a foto em quadrado e reduz, para caber no armazenamento do navegador
$("admin-foto").addEventListener("change", (e) => {
  const arquivo = e.target.files[0];
  if (!arquivo) return;
  const leitor = new FileReader();
  leitor.onload = () => {
    const img = new Image();
    img.onload = () => {
      const lado = Math.min(img.width, img.height);
      const tela = document.createElement("canvas");
      tela.width = tela.height = 600;
      tela.getContext("2d").drawImage(img, (img.width - lado) / 2, (img.height - lado) / 2, lado, lado, 0, 0, 600, 600);
      fotoNova = tela.toDataURL("image/jpeg", 0.82);
      $("admin-previa").src = fotoNova;
      $("admin-previa").hidden = false;
    };
    img.onerror = () => avisoAdmin("Não foi possível ler essa imagem. Tente outro arquivo.");
    img.src = leitor.result;
  };
  leitor.readAsDataURL(arquivo);
});

$("admin-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const nome = $("admin-nome").value.trim();
  const preco = Number($("admin-preco").value);
  const nomeInvalido = nome.length < 2;
  const precoInvalido = !(preco > 0);
  marcarErro($("admin-nome"), "erro-nome-item", nomeInvalido);
  marcarErro($("admin-preco"), "erro-preco", precoInvalido);
  if (nomeInvalido) return $("admin-nome").focus();
  if (precoInvalido) return $("admin-preco").focus();

  const dados = {
    cat: $("admin-cat").value,
    nome,
    preco: Math.round(preco * 100) / 100,
    desc: $("admin-desc").value.trim(),
    tag: $("admin-tag").value.trim(),
  };

  const anteriores = JSON.stringify(produtos);
  if (editandoId) {
    const item = buscar(editandoId);
    Object.assign(item, dados);
    if (fotoNova) item.fotoData = fotoNova;
  } else {
    const id = Math.max(0, ...produtos.map((p) => p.id)) + 1;
    produtos.push({ id, ...dados, ...(fotoNova ? { fotoData: fotoNova } : {}) });
  }

  if (!salvarProdutos()) {
    produtos = JSON.parse(anteriores);
    return avisoAdmin("Não foi possível salvar: o armazenamento do navegador está cheio. Use uma foto menor.");
  }
  const foiEdicao = Boolean(editandoId);
  limparFormAdmin();
  atualizarCardapio();
  avisoAdmin(foiEdicao ? "Item atualizado." : "Item adicionado ao cardápio.");
  $("admin-nome").focus();
});

$("admin-cancelar").addEventListener("click", () => {
  limparFormAdmin();
  avisoAdmin("");
});

$("admin-lista").addEventListener("click", (e) => {
  const botao = e.target.closest("button[data-admin]");
  if (!botao) return;
  const id = Number(botao.dataset.id);
  const p = buscar(id);
  if (!p) return;

  if (botao.dataset.admin === "editar") {
    limparFormAdmin();
    editandoId = id;
    $("admin-nome").value = p.nome;
    $("admin-cat").value = p.cat;
    $("admin-preco").value = p.preco;
    $("admin-desc").value = p.desc || "";
    $("admin-tag").value = p.tag || "";
    $("admin-form-titulo").textContent = "Editar item";
    $("admin-salvar").textContent = "Salvar alterações";
    $("admin-cancelar").hidden = false;
    avisoAdmin("");
    $("admin-nome").focus();
  } else if (confirm(`Excluir "${p.nome}" do cardápio?`)) {
    produtos = produtos.filter((x) => x.id !== id);
    delete estado.itens[id];
    delete estado.favoritos[id];
    salvar();
    salvarProdutos();
    if (editandoId === id) limparFormAdmin();
    atualizarCardapio();
    avisoAdmin("Item excluído.");
  }
});

$("admin-restaurar").addEventListener("click", () => {
  if (!confirm("Voltar ao cardápio original? Os itens cadastrados serão perdidos.")) return;
  try {
    localStorage.removeItem(CHAVE_PRODUTOS);
  } catch {
    // nada a remover
  }
  produtos = PRODUTOS_PADRAO.map((p) => ({ ...p }));
  limparFormAdmin();
  atualizarCardapio();
  avisoAdmin("Cardápio original restaurado.");
});

// ----- Início -----
renderCardapio();
renderComanda();
renderHistorico();
observarCategorias();

// links vindos do site (pedido.html#item-4): rola até o item depois que o cardápio é desenhado
if (location.hash) {
  const alvo = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (alvo) alvo.scrollIntoView();
}
