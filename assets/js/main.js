/**
* Template Name: Bethany
* Template URL: https://bootstrapmade.com/bethany-free-onepage-bootstrap-theme/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function () {
  "use strict";

  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') &&
      !selectHeader.classList.contains('sticky-top') &&
      !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });
  });

  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  let scrollTop = document.querySelector('.scroll-top');
  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  new PureCounter();

  document.querySelectorAll('.isotope-layout').forEach(function (isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';
    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function () {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });
    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function (filters) {
      filters.addEventListener('click', function () {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });
  });

  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );
      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener('load', function () {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  let navmenulinks = document.querySelectorAll('.navmenu a');
  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();


document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("reportForm");
  const nomeUtilizadorInput = document.getElementById("nome-utilizador");

  // Preencher automaticamente o nome do utilizador
  const userLogado = localStorage.getItem("user_logado");
  if (nomeUtilizadorInput) {
    if (userLogado) {
      nomeUtilizadorInput.value = userLogado;
    } else {
      nomeUtilizadorInput.value = "anónimo";
    }
    nomeUtilizadorInput.readOnly = true; // Torna o campo não editável
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const jsonData = {};
    formData.forEach((value, key) => {
      jsonData[key] = value;
    });
    jsonData.estado = "em análise";
    jsonData.data_submissao = new Date().toISOString().slice(0, 10); // Formato: AAAA-MM-DD

    // Adiciona os campos de localização de forma clara para filtros futuros
    jsonData.distrito = formData.get("distrito") || "";
    jsonData.concelho = formData.get("concelho") || "";
    jsonData.freguesia = formData.get("freguesia") || "";

    // Remove campos antigos se existirem
    delete jsonData.local;

    // Validação dos campos obrigatórios
    if (!jsonData.tipo_ocorrencia || !jsonData.distrito || !jsonData.concelho || !jsonData.freguesia) {
      alert("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    const fileInput = document.getElementById("anexo");
    const file = fileInput && fileInput.files[0];

    const saveToStorage = () => {
      const storedReports = JSON.parse(localStorage.getItem("reports")) || [];
      storedReports.push(jsonData);
      localStorage.setItem("reports", JSON.stringify(storedReports));
      alert("Ocorrência enviada com sucesso!");
      form.reset();
      // Repõe o nome automaticamente após reset
      if (nomeUtilizadorInput) {
        if (userLogado) {
          nomeUtilizadorInput.value = userLogado;
        } else {
          nomeUtilizadorInput.value = "anónimo";
        }
      }
    };

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        jsonData.imagens = [e.target.result];
        saveToStorage();
      };
      reader.readAsDataURL(file);
    } else {
      saveToStorage();
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const serviceItems = document.querySelectorAll(".service-item");
  serviceItems.forEach((item) => {
    item.addEventListener("click", function () {
      const tipoOcorrencia = item.getAttribute("data-tipo");
      const tipoOcorrenciaSelect = document.getElementById("tipo-ocorrencia");
      tipoOcorrenciaSelect.value = tipoOcorrencia;
      document.getElementById("reportar").scrollIntoView({ behavior: "smooth" });
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  let peritos = JSON.parse(localStorage.getItem("peritos")) || [];
  if (peritos.length === 0) {
    peritos.push({ nome: "Perito Exemplo", especialidade: "Ambiente" });
    localStorage.setItem("peritos", JSON.stringify(peritos));
  }

  const reports = JSON.parse(localStorage.getItem("reports")) || [];
  document.getElementById("num-ocorrencias").textContent = reports.length;

  peritos = JSON.parse(localStorage.getItem("peritos")) || [];
  document.getElementById("num-peritos").textContent = peritos.length;
});

const peritos = JSON.parse(localStorage.getItem("peritos")) || [];
const numeroDePeritos = peritos.length;
console.log(numeroDePeritos);

document.addEventListener("DOMContentLoaded", function () {
  const reports = JSON.parse(localStorage.getItem("reports")) || [];
  const wrapper = document.getElementById("ultimas-ocorrencias-wrapper");
  if (wrapper) wrapper.innerHTML = "";

  // Mapa de estados para classes CSS
  const statusClassMap = {
    "concluida": "status-bar-completed",
    "pendente": "status-bar-pending",
    "aberto": "status-bar-open",
    "em análise": "status-bar-analysis"
  };

  reports.slice(-5).reverse().forEach(report => {
    let imgHtml = "";
    if (report.imagens && report.imagens.length > 0) {
      imgHtml = `<img src="${report.imagens[0]}" class="img-fluid" alt="">`;
    } else {
      imgHtml = `<img src="assets/img/portfolio/placeholder.png" class="img-fluid" alt="">`;
    }

    // Normaliza o estado para minúsculas e sem acentos
    const estado = (report.estado || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let statusClass = "";
    if (estado === "em analise" || estado === "em análise") {
      statusClass = "status-bar-analysis";
    } else {
      statusClass = statusClassMap[estado] || "status-bar";
    }

    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    slide.innerHTML = `
      <div class="portfolio-content h-100">
        <a href="#" class="glightbox">
          ${imgHtml}
        </a>
        <div class="portfolio-info">
          <h4 style="padding: 5px;">${report.tipo_ocorrencia || "Ocorrência"}</h4>
          <p class="${statusClass}">${report.estado}</p>
        </div>
      </div>
    `;
    wrapper.appendChild(slide);
  });

  // Inicializa ou reinicializa o Swiper após inserir os slides
  const swiperEl = document.querySelector("#ultimas .init-swiper");
  if (swiperEl) {
    // Destroi o Swiper antigo se existir
    if (window.ultimasSwiper && typeof window.ultimasSwiper.destroy === "function") {
      window.ultimasSwiper.destroy(true, true);
    }
    // Lê a configuração do Swiper do script JSON
    const config = JSON.parse(swiperEl.querySelector(".swiper-config").innerHTML.trim());
    window.ultimasSwiper = new Swiper(swiperEl, config);
  }
});

 const areaBtn       = document.getElementById('areaReservada');
    const mainModal     = new bootstrap.Modal('#mainModal');
    const modalTitle    = document.getElementById('modalTitle');
    const authContainer = document.getElementById('authContainer');
    const chatContainer = document.getElementById('chatContainer');
    const tabLogin      = document.getElementById('tabLogin');
    const tabRegister   = document.getElementById('tabRegister');
    const loginFormEl   = document.getElementById('loginForm');
    const registerFormEl= document.getElementById('registerForm');
    const loginUserEl   = document.getElementById('loginUsername');
    const loginPassEl   = document.getElementById('loginPassword');
    const regUserEl     = document.getElementById('regUsername');
    const regPassEl     = document.getElementById('regPassword');
    const loginError    = document.getElementById('loginError');
    const regError      = document.getElementById('regError');
    const btnLogin      = document.getElementById('btnLogin');
    const btnRegister   = document.getElementById('btnRegister');
    const chatMsgsEl    = document.getElementById('chatMessages');
    const chatInputEl   = document.getElementById('chatInput');
    const btnSend       = document.getElementById('btnSend');
    const btnLogout = document.getElementById('btnLogout');

    const USER_KEY = 'user_logado';

    // Inicialização: ajusta botão se já estiver logado
    document.addEventListener('DOMContentLoaded', () => {
      const logged = localStorage.getItem(USER_KEY);
      if (logged) {
        areaBtn.textContent = `Chat (${logged})`;
      }
    });

    // Alternar abas
    tabLogin.addEventListener('click', () => {
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      loginFormEl.classList.remove('d-none');
      registerFormEl.classList.add('d-none');
      loginError.textContent = '';
    });
    tabRegister.addEventListener('click', () => {
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      registerFormEl.classList.remove('d-none');
      loginFormEl.classList.add('d-none');
      regError.textContent = '';
    });

    // Abrir modal
    areaBtn.addEventListener('click', e => {
      e.preventDefault();
      const logged = localStorage.getItem(USER_KEY);
      if (!logged) {
        modalTitle.textContent = 'Login / Registo';
        authContainer.classList.remove('d-none');
        chatContainer.classList.add('d-none');
        mainModal.show();
      } else {
        openChatModal();
      }
    });

    // Função para abrir chat
    function openChatModal() {
      const u = localStorage.getItem(USER_KEY);
      modalTitle.textContent = `Chat`;
      authContainer.classList.add('d-none');
      chatContainer.classList.remove('d-none');
      loadChat();
      mainModal.show();
      areaBtn.textContent = `Chat (${u})`;
    }

    // Login
    btnLogin.addEventListener('click', () => {
      const u = loginUserEl.value.trim();
      const p = loginPassEl.value.trim();
      const stored = localStorage.getItem(`user_${u}`);
      if (!u || !p) { loginError.textContent = 'Preenche todos os campos.'; return; }
      if (!stored || JSON.parse(stored).password !== p) {
      loginError.textContent = 'Credenciais inválidas.'; return;
      }
      localStorage.setItem(USER_KEY, u);
      mainModal.hide(); 
      areaBtn.textContent = `Chat (${u})`;
    });

    // Registo
    btnRegister.addEventListener('click', () => {
      const u = regUserEl.value.trim();
      const p = regPassEl.value.trim();
      if (!u || !p) { regError.textContent = 'Preenche todos os campos.'; return; }
      if (localStorage.getItem(`user_${u}`)) { regError.textContent = 'Utilizador já existe.'; return; }
      localStorage.setItem(`user_${u}`, JSON.stringify({ password: p }));
      localStorage.setItem(USER_KEY, u);
      alert('Registo efetuado com sucesso! Já pode iniciar sessão.');
    });

    // Carregar chat
    function loadChat() {
      const u   = localStorage.getItem(USER_KEY);
      const key = `chat_${u}`;
      const raw = localStorage.getItem(key) || '[]';
      const msgs = JSON.parse(raw);

      chatMsgsEl.innerHTML = '';
      msgs.forEach(m => {
        const div = document.createElement('div');
        div.classList.add('mb-2', 'p-2', 'rounded', 'position-relative', 'w-75');

        if (m.from === u) {
          // mensagem do próprio utilizador
          div.classList.add('bg-light', 'text-dark', 'me-auto', 'border');
        } else {
          // mensagem do "perito" (ou outro remetente)
          div.classList.add('bg-success', 'text-white', 'ms-auto');
        }

        div.innerHTML = `
          <div><strong>${m.from}:</strong> ${m.text}</div>
          <small class="position-absolute text-muted" style="bottom:-1.2rem; right:0.5rem">
            ${new Date(m.time).toLocaleTimeString('pt-PT',{hour:'2-digit',minute:'2-digit'})}
          </small>
        `;
        chatMsgsEl.appendChild(div);
      });

      // descer scroll TESTEEEEE
      chatMsgsEl.scrollTop = chatMsgsEl.scrollHeight;
    }


    // Enviar mensagem
    function sendMessage() {
      const text = chatInputEl.value.trim();
      if (!text) return;

      const u   = localStorage.getItem(USER_KEY);
      const key = `chat_${u}`;
      const msgs = JSON.parse(localStorage.getItem(key) || '[]');

      msgs.push({ from: u, text, time: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(msgs));

      chatInputEl.value = '';
      loadChat();
    }

    // ←–– Aqui associas o botão e o Enter à função
    btnSend.addEventListener('click', sendMessage);
    chatInputEl.addEventListener('keyup', e => {
      if (e.key === 'Enter') sendMessage();
    });

    if (btnLogout) {
      btnLogout.addEventListener('click', function () {
        // Remove o utilizador logado
        localStorage.removeItem('user_logado');
        // Esconde o chat e mostra o login
        document.getElementById('chatContainer').classList.add('d-none');
        document.getElementById('authContainer').classList.remove('d-none');
        // (Opcional) Limpa o campo do nome de utilizador no formulário de reportar
        const nomeUtilizadorInput = document.getElementById("nome-utilizador");
        if (nomeUtilizadorInput) {
          nomeUtilizadorInput.value = "anónimo";
        }
      });
    }

const dadosLocais = {
  "Viana do Castelo": {
    "Arcos de Valdevez": ["Aboim das Choças", "Aguiã", "Ázere", "Cabana Maior", "Cabreiro", "Cendufe", "Couto", "Gavieira", "Gondoriz", "Jolda (São Paio)", "Miranda", "Monte Redondo", "Oliveira", "Paçô", "Padroso", "Prozelo", "Rio de Moinhos", "Rio Frio", "Sabadim", "Senharei", "Sistelo", "Soajo", "União das freguesias de Alvora e Loureda", "União das freguesias de Arcos de Valdevez (Salvador), Vila Fonche e Parada", "União das freguesias de Arcos de Valdevez (São Paio) e Giela", "União das freguesias de Eiras e Mei", "União das freguesias de Grade e Carralcova", "União das freguesias de Guilhadeses e Santar", "União das freguesias de Jolda (Madalena) e Rio Cabrão", "União das freguesias de Padreiro (Salvador e Santa Cristina)", "União das freguesias de Portela e Extremo", "União das freguesias de São Jorge e Ermelo", "União das freguesias de Souto e Tabaçô", "União das freguesias de Távora (Santa Maria e São Vicente)", "União das freguesias de Vilela, São Cosme e São Damião e Sá", "Vale"],
    "Caminha": ["Âncora", "Argela", "Dem", "Lanhelas", "Riba de Âncora", "Seixas", "União das freguesias de Arga (Baixo, Cima e São João)", "União das freguesias de Caminha (Matriz) e Vilarelho", "União das freguesias de Gondar e Orbacém", "União das freguesias de Moledo e Cristelo", "União das freguesias de Venade e Azevedo", "Vila Praia de Âncora", "Vilar de Mouros", "Vile"],
    "Melgaço": ["Alvaredo", "Cousso", "Cristoval", "Fiães", "Gave", "Paderne", "Penso", "São Paio", "União das freguesias de Castro Laboreiro e Lamas de Mouro", "União das freguesias de Chaviães e Paços", "União das freguesias de Parada do Monte e Cubalhão", "União das freguesias de Prado e Remoães", "União das freguesias de Vila e Roussas"],
    "Monção": ["Abedim", "Barbeita", "Barroças e Taias", "Bela", "Cambeses", "Lara", "Longos Vales", "Merufe", "Moreira", "Pias", "Pinheiros", "Podame", "Portela", "Riba de Mouro", "Segude", "Tangil", "Trute", "União das freguesias de Anhões e Luzio", "União das freguesias de Ceivães e Badim", "União das freguesias de Mazedo e Cortes", "União das freguesias de Messegães, Valadares e Sá", "União das freguesias de Monção e Troviscoso", "União das freguesias de Sago, Lordelo e Parada", "União das freguesias de Troporiz e Lapela"],
    "Paredes de Coura": ["Agualonga", "Castanheira", "Coura", "Cunha", "Infesta", "Mozelos", "Padornelo", "Parada", "Romarigães", "Rubiães", "União das freguesias de Bico e Cristelo", "União das freguesias de Cossourado e Linhares", "União das freguesias de Formariz e Ferreira", "União das freguesias de Insalde e Porreiras", "União das freguesias de Paredes de Coura e Resende", "Vascões"],
    "Ponte da Barca": ["Azias", "Boivães", "Bravães", "Britelo", "Cuide de Vila Verde", "Lavradas", "Lindoso", "Nogueira", "Oleiros", "Sampriz", "União das freguesias de Crasto, Ruivos e Grovelas", "União das freguesias de Entre Ambos-os-Rios, Ermida e Germil", "União das freguesias de Ponte da Barca, Vila Nova de Muía e Paço Vedro de Magalhães", "União das freguesias de Touvedo (São Lourenço e Salvador)", "União das freguesias de Vila Chã (São João Baptista e Santiago)", "Vade (São Pedro)", "Vade (São Tomé)"],
    "Ponte de Lima": ["Anais", "Arca e Ponte de Lima", "Arcozelo", "Ardegão, Freixo e Mato", "Associação de freguesias do Vale do Neiva", "Bárrio e Cepões", "Beiral do Lima", "Bertiandos", "Boalhosa", "Brandara", "Cabaços e Fojo Lobal", "Cabração e Moreira do Lima", "Calheiros", "Calvelo", "Correlhã", "Estorãos", "Facha", "Feitosa", "Fontão", "Fornelos e Queijada", "Friastelas", "Gandra", "Gemieira", "Gondufe", "Labruja", "Labrujó, Rendufe e Vilar do Monte", "Navió e Vitorino dos Piães", "Poiares", "Rebordões (Santa Maria)", "Rebordões (Souto)", "Refóios do Lima", "Ribeira", "Sá", "Santa Comba", "Santa Cruz do Lima", "São Pedro d'Arcos", "Seara", "Serdedelo", "Vitorino das Donas"],
    "Valença": ["Boivão", "Cerdal", "Fontoura", "Friestas", "Ganfei", "São Pedro da Torre", "União das freguesias de Gandra e Taião", "União das freguesias de Gondomil e Sanfins", "União das freguesias de São Julião e Silva", "União das freguesias de Valença, Cristelo Covo e Arão", "Verdoejo"],
    "Viana do Castelo": ["Afife", "Alvarães", "Amonde", "Anha", "Areosa", "Carreço", "Castelo do Neiva", "Chafé", "Darque", "Freixieiro de Soutelo", "Lanheses", "Montaria", "Mujães", "Outeiro", "Perre", "Santa Marta de Portuzelo", "São Romão de Neiva", "União das freguesias de Barroselas e Carvoeiro", "União das freguesias de Cardielos e Serreleis", "União das freguesias de Geraz do Lima (Santa Maria, Santa Leocádia e Moreira) e Deão", "União das freguesias de Mazarefes e Vila Fria", "União das freguesias de Nogueira, Meixedo e Vilar de Murteda", "União das freguesias de Subportela, Deocriste e Portela Susã", "União das freguesias de Torre e Vila Mou", "União das freguesias de Viana do Castelo (Santa Maria Maior e Monserrate) e Meadela", "Vila de Punhe", "Vila Franca"],
    "Vila Nova de Cerveira": ["Cornes", "Covas", "Gondarém", "Loivo", "Mentrestido", "Sapardos", "Sopo", "União das freguesias de Campos e Vila Meã", "União das freguesias de Candemil e Gondar", "União das freguesias de Reboreda e Nogueira", "União das freguesias de Vila Nova de Cerveira e Lovelhe"],
  },

  "Braga": {
    "Amares": ["Amares e Figueiredo", "Barreiros", "Bico", "Caires", "Caldelas", "Carrazedo", "Dornelas", "Ferreiros", "Fiscal", "Goães", "Lago", "Lamas", "Rendufe", "Santa Maria do Bouro", "Santa Marta do Bouro", "Sequeiros e Paranhos", "Torre e Portela", "Vilela, Seramil e Paredes Secas"],
    "Barcelos": ["Abade de Neiva", "Aborim", "Adães", "Airó", "Aldreu", "Alheira", "Alvelos", "Arcozelo", "Areias de Vilar e Encourados", "Balugães", "Barcelinhos", "Barcelos, Vila Boa e Vila Frescainha (São Martinho e São Pedro)", "Cambeses", "Carapeços", "Carvalhal", "Carvalhas", "Cossourado", "Cristelo", "Durrães e Tregosa", "Feitos", "Fragoso", "Gilmonde", "Gontinhães", "Gueral", "Lama", "Lijó", "Macieira de Rates", "Manhente", "Martim", "Moure", "Negreiros e Chavão", "Oliveira", "Palme", "Panque", "Paradela", "Pereira", "Perelhal", "Pousa", "Remelhe", "Roriz", "Rio Covo (Santa Eugénia)", "Rio Covo (Santa Eulália)", "Roriz", "Sequeade e Bastuço (São João e Santo Estevão)", "Silva", "Silveiros e Rio Covo (Santa Eulália)", "Tamel (Santa Leocádia) e Vilar do Monte", "Tamel (São Veríssimo)", "Ucha", "Várzea", "Vila Cova e Feitos", "Vila Seca", "Vilar de Figos", "Vilar do Monte"],
    "Braga": ["Adaúfe", "Arentim e Cunha", "Braga (Maximinos, Sé e Cividade)", "Braga (São José de São Lázaro e São João do Souto)", "Braga (São Vicente)", "Braga (São Vítor)", "Cabreiros e Passos (São Julião)", "Celeirós, Aveleda e Vimieiro", "Crespos e Pousada", "Escudeiros e Penso (Santo Estêvão e São Vicente)", "Espinho", "Esporões", "Este (São Pedro e São Mamede)", "Ferreiros e Gondizalves", "Figueiredo", "Gualtar", "Guisande e Oliveira (São Pedro)", "Lamas", "Lomar e Arcos", "Merelim (São Paio), Panóias e Parada de Tibães", "Merelim (São Pedro) e Frossos", "Mire de Tibães", "Morreira e Trandeiras", "Nogueira, Fraião e Lamaçães", "Nogueiró e Tenões", "Padim da Graça", "Palmeira", "Pedralva", "Priscos", "Real, Dume e Semelhe", "Ruilhe", "Santa Lucrécia de Algeriz e Navarra", "Sequeira", "Sobreposta", "Tadim", "Tebosa", "Vilaça e Fradelos"],
    "Cabeceiras de Basto": ["Abadim", "Alvite e Passos", "Arco de Baúlhe e Vila Nune", "Basto", "Bucos", "Cabeceiras de Basto", "Cavez", "Faia", "Gondiães e Vilar de Cunhas", "Pedraça", "Refojos de Basto, Outeiro e Painzela", "Rio Douro", "Riodouro", "Vilar de Cunhas"],
    "Celorico de Basto": ["Agilde", "Arnoia", "Borba de Montanha", "Britelo, Gémeos e Ourilhe", "Caçarilhe e Infesta", "Canedo de Basto e Corgo", "Codeçoso", "Fervença", "Moreira do Castelo", "Rego", "Ribas", "São Clemente de Basto", "Vale de Bouro", "Veade, Gagos e Molares", "Vila Nune"],
    "Esposende": ["Antas", "Apúlia e Fão", "Belinho e Mar", "Castelo do Neiva", "Esposende, Marinhas e Gandra", "Forjães", "Fonte Boa", "Gemeses", "Palmeira de Faro e Curvos", "Rio Tinto", "Vila Chã"],
    "Fafe": ["Aboim", "Agrela e Serafão", "Antime e Silvares (São Clemente)", "Ardegão, Arnozela e Seidões", "Armil", "Cepães e Fareja", "Estorãos", "Fafe", "Felgueiras", "Golães", "Medelo", "Monte e Queimadela", "Moreira do Rei e Várzea Cova", "Passos", "Quinchães", "Regadas", "Revelhe", "Ribeiros", "Santa Cristina de Arões", "São Gens", "São Martinho de Silvares", "São Romão de Arões", "Travassós", "Vinhós"],
    "Guimarães": ["Abação e Gémeos", "Aldão", "Arosa e Castelões", "Atães e Rendufe", "Azurém", "Barco", "Barco e São Paio", "Briteiros Santo Estêvão e Donim", "Briteiros São Salvador e Briteiros Santa Leocádia", "Caldelas", "Calvos e Souto da Velha", "Candoso (São Martinho)", "Candoso (São Tiago)", "Caneiros", "Costa", "Creixomil", "Fermentões", "Gonça", "Gondar", "Infantas", "Jugueiros", "Longos", "Lordelo", "Mesão Frio", "Moreira de Cónegos", "Nespereira", "Oliveira, São Paio e São Sebastião", "Pencelo", "Pinheiro", "Polvoreira", "Ponte", "Prazins (Santa Eufémia)", "Prazins (Santo Tirso)", "Ronfe", "Sande (São Lourenço e Balazar)", "Sande (São Martinho)", "Sande (São Miguel)", "Sande (Vila Nova)", "São Torcato", "Selho (São Cristóvão)", "Selho (São Jorge)", "Selho (São Lourenço)", "Serzedelo", "Serzedo e Calvos", "Silvares", "Tabuadelo e São Faustino", "Urgezes", "Vila Nova de Sande", "Vila Nova de São Bento e Vila Nova de São Martinho"],
    "Póvoa de Lanhoso": ["Águas Santas e Moure", "Ajude", "Brunhais", "Campos e Louredo", "Covelas", "Esperança e Brunhais", "Fonte Arcada e Oliveira", "Friande", "Galegos", "Geraz do Minho", "Lanhoso", "Monsul", "Póvoa de Lanhoso (Nossa Senhora do Amparo)", "Rendufinho", "Santo Emilião", "São João de Rei", "Serzedelo", "Sobradelo da Goma", "Taíde", "Travassos", "Vilela", "Vila Boa e Frades"],
    "Terras de Bouro": ["Balança", "Campo do Gerês", "Carvalheira", "Chamoim e Vilar", "Covide", "Gondoriz", "Moimenta", "Ribeira", "Rio Caldo", "Souto", "Valdosende", "Vilar da Veiga"],
    "Vieira do Minho": ["Anissó e Soutelo", "Anjos e Vilar do Chão", "Caniçada e Soengas", "Cantelães", "Eira Vedra", "Guilhofrei", "Lamedo", "Louredo", "Mosteiro", "Parada de Bouro", "Pinheiro", "Rossas", "Ruivães e Campos", "Salamonde", "Tabuaças", "Vieira do Minho"],
    "Vila Nova de Famalicão": ["Antas e Abade de Vermoim", "Arnoso (Santa Maria e Santa Eulália) e Sezures", "Avidos e Lagoa", "Brufe", "Calendário", "Carreira e Bente", "Castelões", "Cruz", "Delães", "Esmeriz e Cabeçudos", "Fradelos", "Gavião", "Gondifelos, Cavalões e Outiz", "Joane", "Landim", "Lemenhe, Mouquim e Jesufrei", "Louro", "Mogege", "Nine", "Oliveira (Santa Maria)", "Oliveira (São Mateus)", "Pedome", "Pousada de Saramagos", "Requião", "Riba de Ave", "Ribeirão", "Ruivães e Novais", "Seide", "Vale (São Cosme), Telhado e Portela", "Vermoim", "Vilarinho das Cambas", "Vila Nova de Famalicão e Calendário"],
    "Vila Verde": ["Atiães", "Barbudo", "Cabanelas", "Carreiras (São Miguel e Santiago)", "Cervães", "Coucieiro", "Dossãos", "Escariz (São Mamede e São Martinho)", "Esqueiros, Nevogilde e Travassós", "Freiriz", "Gême", "Lage", "Loureira", "Moure", "Oleiros", "Parada de Gatim", "Pico de Regalados, Gondiães e Mós", "Ponte", "Sabar"],
    "Vizela": ["Caldas de Vizela (São Miguel e São João)", "Infias", "Santa Eulália", "Santo Adrião", "Tagilde e Vizela (São Paio)"]
},

  "Porto": {
    "Amarante": ["Aboadela, Sanche e Várzea", "Ansiães", "Candemil", "Figueiró (Santiago e Santa Cristina)", "Freixo de Cima e de Baixo", "Gondar", "Jazente", "Lomba", "Louredo", "Lufrei", "Mancelos", "Olo e Canadelo", "Padronelo", "Rebordelo", "Salvador do Monte", "Travanca", "Vila Caiz", "Vila Chã do Marão", "Vila Garcia", "União das freguesias de Amarante (São Gonçalo), Madalena, Cepelos e Gatão"],
    "Baião": ["Ancede e Ribadouro", "Campelo e Ovil", "Frende", "Gestaçô", "Grilo", "Loivos do Monte", "Loivos da Ribeira e Tresouras", "Mesquinhata", "Santa Cruz do Douro e São Tomé de Covelas", "Santa Leocádia e Mesquinhata", "Teixeira e Teixeiró", "Valadares"],
    "Felgueiras": ["Airães", "Friande", "Idães", "Jugueiros", "Lagares e Figueira", "Macieira da Lixa e Caramos", "Margaride (Santa Eulália), Várzea, Lagares, Varziela e Moure", "Pedreira, Rande e Sernande", "Penacova", "Pombeiro de Ribavizela", "Refontoura", "Regilde", "Sendim", "Torrados e Sousa", "União das freguesias de Margaride (Santa Eulália), Várzea, Lagares, Varziela e Moure"],
    "Gondomar": ["Baguim do Monte (Rio Tinto)", "Fânzeres e São Pedro da Cova", "Foz do Sousa e Covelo", "Lomba", "Melres e Medas", "Rio Tinto", "Valbom", "União das freguesias de Gondomar (São Cosme), Valbom e Jovim"],
    "Lousada": ["Caíde de Rei", "Cristelos, Boim e Ordem", "Lodares", "Lousada (São Miguel e Santa Margarida)", "Macieira", "Meinedo", "Nevogilde", "Nespereira", "Sousela", "Torno", "Vilar do Torno e Alentém"],
    "Maia": ["Águas Santas", "Castêlo da Maia", "Cidade da Maia", "Folgosa", "Milheirós", "Moreira", "Nogueira e Silva Escura", "Pedrouços", "São Pedro Fins", "Vermoim"],
    "Marco de Canaveses": ["Alpendorada, Várzea e Torrão", "Avessadas e Rosém", "Banho e Carvalhosa", "Constance", "Freixo", "Maureles", "Paredes de Viadores e Manhuncelos", "Penhalonga e Paços de Gaiolo", "Santo Isidoro e Livração", "Soalhães", "Sobretâmega", "Tabuado", "Várzea, Aliviada e Folhada", "Vila Boa de Quires e Maureles", "Vila Boa do Bispo"],
    "Matosinhos": ["Custóias, Leça do Balio e Guifões", "Leça da Palmeira", "Matosinhos e Leça da Palmeira", "Perafita, Lavra e Santa Cruz do Bispo", "São Mamede de Infesta e Senhora da Hora"],
    "Paços de Ferreira": ["Carvalhosa", "Eiriz", "Ferreira", "Figueiró", "Frazão e Arreigada", "Meixomil", "Paços de Ferreira", "Penamaior", "Raimonda", "Sanfins Lamoso e Codessos", "Seroa"],
    "Paredes": ["Aguiar de Sousa", "Astromil", "Baltar", "Beire", "Cete", "Cristelo", "Duas Igrejas", "Gandra", "Lordelo", "Louredo", "Mouriz", "Parada de Todeia", "Paredes", "Rebordosa", "Recarei", "Sobreira", "Sobrosa", "Vandoma", "Vila Cova de Carros", "Vilela"],
    "Penafiel": ["Abragão", "Boelhe", "Bustelo", "Cabeça Santa", "Canelas", "Capela", "Castelões", "Croca", "Duas Igrejas", "Eja", "Fonte Arcada", "Galegos", "Irivo", "Lagares e Figueira", "Luzim e Vila Cova", "Milhundos", "Oldrões", "Paço de Sousa", "Penafiel", "Peroselo", "Rans", "Rio de Moinhos", "Sebolido", "Termas de São Vicente", "Valpedre", "Vila Cova"],
    "Porto": ["Bonfim", "Campanhã", "Paranhos", "Ramalde", "União das Freguesias de Aldoar, Foz do Douro e Nevogilde", "União das Freguesias de Cedofeita, Santo Ildefonso, Sé, Miragaia, São Nicolau e Vitória", "União das Freguesias de Lordelo do Ouro e Massarelos"],
    "Póvoa de Varzim": ["Aguçadoura e Navais", "Aver-o-Mar, Amorim e Terroso", "Balazar", "Beiriz", "Estela", "Laundos", "Póvoa de Varzim, Beiriz e Argivai"],
    "Santo Tirso": ["Agrela", "Água Longa", "Aves", "Campo (São Martinho)", "Monte Córdova", "Negrelos (São Tomé)", "Rebordões", "Roriz", "Santo Tirso, Couto (Santa Cristina e São Miguel) e Burgães", "Vilarinho"],
    "Trofa": ["Alvarelhos e Guidões", "Bougado (São Martinho e Santiago)", "Coronado (São Romão e São Mamede)", "Muro"],
    "Valongo": ["Alfena", "Ermesinde", "Campo e Sobrado", "Valongo"],
    "Vila do Conde": ["Árvore", "Azurara", "Bagunte, Ferreiró, Outeiro Maior e Parada", "Fajozes", "Fornelo e Vairão", "Gião", "Guilhabreu", "Junqueira", "Labruge", "Macieira da Maia", "Malta e Canidelo", "Mindelo", "Modivas", "Retorta e Tougues", "Vila Chã", "Vila do Conde", "Vilar e Mosteiró"],
    "Vila Nova de Gaia": ["Arcozelo", "Avintes", "Canelas", "Canidelo", "Grijó e Sermonde", "Gulpilhares e Valadares", "Madalena", "Mafamude e Vilar do Paraíso", "Oliveira do Douro", "Pedroso e Seixezelo", "Sandim, Olival, Lever e Crestuma", "Santa Marinha e São Pedro da Afurada", "São Félix da Marinha", "Serzedo e Perosinho", "Vilar de Andorinho"]
},

  "Vila Real": {
    "Alijó": ["Alijó", "Amieiro", "Carlão e Amieiro", "Castedo e Cotas", "Favaios", "Pegarinhos", "Pinhão", "Pópulo e Ribalonga", "Sanfins do Douro", "Santa Eugénia", "São Mamede de Ribatua", "Vales", "Vila Chã", "Vilar de Maçada"],
    "Boticas": ["Alturas do Barroso e Cerdedo", "Ardãos e Bobadela", "Beça", "Boticas e Granja", "Covas do Barroso", "Dornelas", "Pinho", "Sapiãos", "Vilar e Viveiro"],
    "Chaves": ["Águas Frias", "Anelhe", "Bustelo", "Calvão e Soutelinho da Raia", "Cimo de Vila da Castanheira", "Curalha", "Eiras, São Julião de Montenegro e Cela", "Ervededo", "Faiões", "Lama de Arcos", "Loivos e Póvoa de Agrações", "Madalena e Samaiões", "Mairos", "Moreiras", "Nogueira da Montanha", "Oura", "Outeiro Seco", "Paradela de Monforte", "Planalto de Monforte", "Redondelo", "Sanfins", "Santa Cruz/Trindade e Sanjurge", "Santa Leocádia", "Santa Maria Maior", "Santo António de Monforte", "Santo Estêvão", "São Pedro de Agostém", "São Vicente", "Soutelo e Seara Velha", "Travancas e Roriz", "Tronco", "Vale de Anta", "Vidago", "Vila Verde da Raia", "Vilar de Nantes", "Vilarelho da Raia", "Vilas Boas", "Vilela do Tâmega", "Vilela Seca"],
    "Mesão Frio": ["Cidadelhe", "Oliveira", "Santa Cristina", "São Nicolau", "Vila Marim"],
    "Mondim de Basto": ["Atei", "Bilhó", "Campanhó e Paradança", "Ermelo e Pardelhas", "Mondim de Basto", "Vilar de Ferreiros"],
    "Montalegre": ["Cabril", "Cervos", "Chã", "Covelães", "Donões", "Ferral", "Fiães do Rio", "Gralhas", "Meixedo e Padornelos", "Montalegre e Padroso", "Morgade", "Negrões", "Outeiro", "Paradela", "Pitões das Júnias", "Reigoso", "Salto", "Santo André", "Sarraquinhos", "Sezelhe e Covelães", "Solveira", "Tourém", "Vilar de Perdizes", "Viade de Baixo e Fervidelas"],
    "Murça": ["Candedo", "Carva e Vilares", "Fiolhoso", "Jou", "Murça", "Valongo de Milhais", "Vila Verde"],
    "Peso da Régua": ["Fontelas", "Galafura e Covelinhas", "Godim", "Loureiro", "Mouços e Lamares", "Peso da Régua e Godim", "Sedielos", "Vilarinho dos Freires"],
    "Ribeira de Pena": ["Alvadia", "Canedo", "Cerva e Limões", "Ribeira de Pena (Salvador) e Santo Aleixo de Além-Tâmega", "Santa Marinha", "São João Baptista de Ribeira de Pena"],
    "Sabrosa": ["Covas do Douro", "Gouvinhas", "Parada de Pinhão", "Paços", "Provesende, Gouvães do Douro e São Cristóvão do Douro", "Sabrosa", "São Lourenço de Ribapinhão", "São Martinho de Anta e Paradela de Guiães", "São Vicente de Barrosas", "Torre do Pinhão", "Vilarinho de São Romão", "Vilela"],
    "Santa Marta de Penaguião": ["Alvações do Corgo", "Cumieira", "Fontes", "Lobrigos (São Miguel e São João Baptista) e Sanhoane", "Medrões", "Sever", "São João de Lobrigos", "São Miguel de Lobrigos", "São João Baptista de Lobrigos", "Sanhoane", "Sever", "Vila Marim"],
    "Valpaços": ["Água Revés e Crasto", "Algeriz", "Bouçoães", "Canaveses", "Carrazedo de Montenegro e Curros", "Ervões", "Fornos do Pinhal", "Friões", "Lebução, Fiães e Nozelos", "Padrela e Tazem", "Possacos", "Rio Torto", "Santa Maria de Émeres", "Santa Valha", "Santiago da Ribeira de Alhariz", "São João da Corveira", "Serapicos", "Sonim e Barreiros", "Torrão", "Vales", "Valpaços e Sanfins", "Vassal", "Veiga de Lila", "Vilarandelo"],
    "Vila Pouca de Aguiar": ["Alfarela de Jales", "Bornes de Aguiar", "Bragado", "Capeludos", "Soutelinho do Mesio", "Telões", "Tresminas", "Valoura", "Vila Pouca de Aguiar", "Vreia de Bornes", "Vreia de Jales"],
    "Vila Real": ["Abaças", "Adoufe e Vilarinho de Samardã", "Andrães", "Arroios", "Borbela e Lamas de Olo", "Campeã", "Constantim e Vale de Nogueiras", "Folhadela", "Guiães", "Lordelo", "Mateus", "Mondrões", "Mouçós e Lamares", "Nogueira e Ermida", "Parada de Cunhos", "Pena, Quintã e Vila Cova", "São Tomé do Castelo e Justes", "Torgueda", "Vila Marim", "Vila Real (Nossa Senhora da Conceição, São Dinis e São Pedro)"]
  },

  "Bragança": {
    "Alfândega da Fé": ["Agrobom, Saldonha e Vale Pereiro", "Alfândega da Fé", "Cerejais", "Eucísia, Gouveia e Valverde", "Ferradosa e Sendim da Serra", "Gebelim e Soeima", "Parada e Sendim da Ribeira", "Pombal e Vales", "Sambade", "Vale Benfeito", "Vilar Chão", "Vilarelhos"],
    "Bragança": ["Alfaião", "Aveleda e Rio de Onor", "Babe", "Baçal", "Carragosa", "Castrelos e Carrazedo", "Castro de Avelãs", "Coelhoso", "Donai", "Espinhosela", "França", "Gimonde", "Gondesende", "Gostei", "Grijó de Parada", "Izeda, Calvelhe e Paradinha Nova", "Macedo do Mato", "Mós", "Nogueira", "Outeiro", "Parada e Faílde", "Parâmio", "Pinela", "Quintanilha", "Quintela de Lampaças", "Rabal", "Rebordainhos e Pombares", "Rebordãos", "Rio Frio e Milhão", "Salsas", "Samil", "Santa Comba de Rossas", "São Julião de Palácios e Deilão", "São Pedro de Sarracenos", "Sé, Santa Maria e Meixedo", "Sendas", "Serapicos", "Sortes", "Zoio"],
    "Carrazeda de Ansiães": ["Amedo e Zedes", "Belver e Mogo de Malta", "Carrazeda de Ansiães", "Castanheiro do Norte e Ribalonga", "Fonte Longa", "Lavandeira, Beira Grande e Selores", "Linhares", "Marzagão", "Parambos", "Pereiros", "Pinhal do Norte", "Pombal"],
    "Freixo de Espada à Cinta": ["Freixo de Espada à Cinta e Mazouco", "Lagoaça e Fornos", "Ligares", "Poiares"],
    "Macedo de Cavaleiros": ["Amendoeira", "Arcas", "Bornes e Burga", "Cortiços", "Corujas", "Ferreira", "Grijó", "Lagoa", "Lamalonga", "Lamas", "Macedo de Cavaleiros", "Morais", "Olmos", "Peredo", "Podence e Santa Combinha", "Salselas", "Sezulfe", "Talhas", "Vale Benfeito", "Vale da Porca", "Vale de Prados", "Vilarinho de Agrochão"],
    "Miranda do Douro": ["Aldeia Nova", "Ciclo", "Constantim e Cicouro", "Duas Igrejas", "Genísio", "Malhadas", "Miranda do Douro", "Palaçoulo", "Picote", "Póvoa", "São Martinho de Angueira", "Sendim e Atenor", "Silva e Águas Vivas"],
    "Mirandela": ["Abambres", "Abreiro", "Aguieiras", "Alvites", "Bouça", "Cabanelas", "Carvalhais", "Cedães", "Cobro", "Fradizela", "Frechas", "Freixeda", "Lamas de Orelhão", "Mascarenhas", "Mirandela", "Múrias", "Navalho", "Passos", "São Salvador", "Suçães", "Torre de Dona Chama", "Vale de Asnes", "Vale de Gouvinhas", "Vale de Salgueiro", "Vale de Telhas", "Vale de Touros", "Valverde da Gestosa", "Vila Boa", "Vila Verde", "Vilar de Ledra"],
    "Mogadouro": ["Azinhoso", "Bemposta", "Bruçó", "Castelo Branco", "Meirinhos", "Mogadouro, Valverde, Vale de Porco e Vilar de Rei", "Paradela", "Penas Roias", "Peredo da Bemposta", "Remondes e Soutelo", "Saldanha", "São Martinho do Peso", "Tó", "Travanca"],
    "Torre de Moncorvo": ["Adeganha e Cardanha", "Amedo e Zedes", "Carviçais", "Castedo", "Felgar e Souto da Velha", "Horta da Vilariça", "Larinho", "Lousa", "Maçores", "Mós", "Torre de Moncorvo", "Urrós", "Vila Flor e Nabo"],
    "Vila Flor": ["Assares", "Candoso", "Freixiel", "Lodões", "Mourão", "Roios", "Samões", "Sampaio", "Santa Comba da Vilariça", "Seixo de Manhoses", "Trindade", "Vale Frechoso", "Vila Flor", "Vilarinho das Azenhas"],
    "Vimioso": ["Algoso, Campo de Víboras e Uva", "Argozelo", "Caçarelhos e Angueira", "Carção", "Matela", "Pinelo", "Santulhão", "Vale de Frades e Avelanoso", "Vimioso", "Vilar Seco"],
    "Vinhais": ["Agrochão", "Candedo", "Celas", "Edral", "Ervedosa", "Moimenta", "Montesinho", "Nunes", "Paçó", "Penhas Juntas", "Quintela", "Rebordelo", "Rio de Fornos", "Santalha", "Santo António de Monforte", "Sobradais", "Tuizelo", "Vale das Fontes", "Vila Boa de Ousilhão", "Vila Verde", "Vilar de Lomba", "Vilar Seco de Lomba", "Vinhais"]
  },

  "Aveiro": {
    "Águeda": ["Águeda e Borralha", "Barrô e Aguada de Baixo", "Belazaima do Chão, Castanheira do Vouga e Agadão", "Fermentelos", "Macinhata do Vouga", "Préstimo e Macieira de Alcoba", "Recardães e Espinhel", "Travassô e Óis da Ribeira", "Trofa, Segadães e Lamas do Vouga", "Valongo do Vouga"],
    "Albergaria-a-Velha": ["Albergaria-a-Velha e Valmaior", "Alquerubim", "Angeja", "Branca", "Ribeira de Fráguas", "São João de Loure e Frossos"],
    "Anadia": ["Amoreira da Gândara, Paredes do Bairro e Ancas", "Arcos e Mogofores", "Avelãs de Caminho", "Avelãs de Cima", "Moita", "Sangalhos", "São Lourenço do Bairro", "Tamengos, Aguim e Óis do Bairro", "Vila Nova de Monsarros", "Vilarinho do Bairro"],
    "Arouca": ["Albergaria da Serra", "Arouca e Burgo", "Cabreiros e Albergaria da Serra", "Canelas e Espiunca", "Chave", "Covelo de Paivó e Janarde", "Escariz", "Fermedo", "Mansores", "Moldes", "Rossas", "Santa Eulália", "São Miguel do Mato", "Tropeço", "Urrô", "Várzea"],
    "Aveiro": ["Aradas", "Cacia", "Eixo e Eirol", "Esgueira", "Glória e Vera Cruz", "Oliveirinha", "Requeixo, Nossa Senhora de Fátima e Nariz", "Santa Joana", "São Bernardo", "São Jacinto"],
    "Castelo de Paiva": ["Fornos", "Raiva, Pedorido e Paraíso", "Santa Maria de Sardoura", "São Martinho de Sardoura", "Sobrado e Bairros"],
    "Espinho": ["Anta e Guetim", "Espinho", "Paramos", "Silvalde"],
    "Estarreja": ["Avanca", "Beduído e Veiros", "Canelas e Fermelã", "Pardilhó", "Salreu"],
    "Ílhavo": ["Gafanha da Encarnação", "Gafanha da Nazaré", "Gafanha do Carmo", "Ílhavo (São Salvador)"],
    "Mealhada": ["Barcouço", "Casal Comba", "Luso", "Mealhada, Ventosa do Bairro e Antes", "Pampilhosa", "Vacariça"],
    "Murtosa": ["Bunheiro", "Monte", "Murtosa", "Torreira"],
    "Oliveira de Azeméis": ["Carregosa", "Cesar", "Fajões", "Loureiro", "Macieira de Sarnes", "Nogueira do Cravo e Pindelo", "Oliveira de Azeméis, Santiago de Riba-Ul, Ul, Macinhata da Seixa e Madail", "Pinheiro da Bemposta, Palmaz e Travanca", "São Martinho da Gândara", "São Roque", "Vila de Cucujães"],
    "Oliveira do Bairro": ["Bustos, Troviscal e Mamarrosa", "Oiã", "Oliveira do Bairro", "Palhaça"],
    "Ovar": ["Cortegaça", "Esmoriz", "Maceda", "Ovar, São João, Arada e São Vicente de Pereira Jusã", "Válega"],
    "Santa Maria da Feira": ["Argoncilhe", "Arrifana", "Caldas de São Jorge e Pigeiros", "Canedo, Vale e Vila Maior", "Escapães", "Espargo", "Fiães", "Fornos", "Lamas", "Lobão, Gião, Louredo e Guisande", "Milheirós de Poiares", "Mozelos", "Nogueira da Regedoura", "Paços de Brandão", "Rio Meão", "Romariz", "Sanfins", "Santa Maria da Feira, Travanca, Sanfins e Espargo", "São João de Ver", "São Paio de Oleiros", "São Miguel do Souto e Mosteirô"],
    "São João da Madeira": ["São João da Madeira"],
    "Sever do Vouga": ["Cedrim e Paradela", "Couto de Esteves", "Pessegueiro do Vouga", "Rocas do Vouga", "Sever do Vouga", "Silva Escura e Dornelas", "Talhadas"],
    "Vagos": ["Calvão", "Fonte de Angeão e Covão do Lobo", "Gafanha da Boa Hora", "Ouca", "Ponte de Vagos e Santa Catarina", "Santo André de Vagos", "Sosa", "Vagos e Santo António"],
    "Vale de Cambra": ["Arões", "Cepelos", "Junqueira", "Macieira de Cambra", "Roge", "São Pedro de Castelões", "Vila Chã, Codal e Vila Cova de Perrinho"]
  },

  
  "Viseu": {
    "Armamar": ["Aldeias", "Aricera e Goujoim", "Armamar", "Cimbres", "Folgosa", "Fontelo", "Queimada", "Queimadela", "Santa Cruz", "São Cosmado", "São Martinho das Chãs", "São Romão e Santiago", "Vacalar", "Vila Seca e Santo Adrião"],
    "Carregal do Sal": ["Beijós", "Cabanas de Viriato", "Carregal do Sal", "Currelos, Papízios e Sobral", "Oliveira do Conde", "Parada"],
    "Castro Daire": ["Almofala", "Cabril", "Castro Daire", "Cujó", "Gosende", "Mamouros, Alva e Ribolhos", "Mezio e Moura Morta", "Mões", "Monteiras", "Moledo", "Parada de Ester e Ester", "Pepim", "Pinheiro", "Reriz e Gafanhão", "São Joaninho", "São Martinho das Moitas e Covas do Rio", "São Pedro do Sul", "Vila Maior"],
    "Cinfães": ["Cinfães", "Espadanedo", "Ferreiros de Tendais", "Fornelos", "Moimenta", "Nespereira", "Oliveira do Douro", "Santiago de Piães", "São Cristóvão de Nogueira", "Souselo", "Tarouquela", "Tendais"],
    "Lamego": ["Avões", "Britiande", "Cambres", "Ferreirim", "Ferreiros de Avões", "Lalim", "Lazarim", "Penajóia", "Penude", "Samodães", "Sande", "Várzea de Abrunhais", "Vila Nova de Souto d'El-Rei"],
    "Mangualde": ["Abrunhosa-a-Velha", "Alcafache", "Cunha Alta", "Espinho", "Fornos de Maceira Dão", "Freixiosa", "Mangualde, Mesquitela e Cunha Alta", "Moimenta de Maceira Dão e Lobelhe do Mato", "Quintela de Azurara", "São João da Fresta"],
    "Moimenta da Beira": ["Alvite", "Arcozelos", "Baldos", "Cabaços", "Caria", "Castelo", "Leomil", "Moimenta da Beira", "Paradinha e Nagosa", "Passô", "Peva e Segões", "Rua", "Sarzedo", "Sever e Soutosa", "Vila da Rua"],
    "Mortágua": ["Cercosa", "Espinho", "Marmeleira", "Mortágua, Vale de Remígio, Cortegaça e Almaça", "Pala", "Sobral", "Trezói"],
    "Nelas": ["Canas de Senhorim", "Nelas", "Senhorim", "Vilar Seco"],
    "Oliveira de Frades": ["Arcozelo das Maias", "Destriz e Reigoso", "Oliveira de Frades, Souto de Lafões e Sejães", "Pinheiro", "Ribeiradio", "São João da Serra", "São Vicente de Lafões"],
    "Penalva do Castelo": ["Antas e Matela", "Castelo de Penalva", "Esmolfe", "Germil", "Ínsua", "Lusinde", "Pindo", "Real", "Sezures", "Trancozelos", "Vila Cova do Covelo e Mareco"],
    "Penedono": ["Antas e Ourozinho", "Beselga", "Castainço", "Granja", "Penedono e Granja", "Penela da Beira", "Souto"],
    "Resende": ["Anreade e São Romão de Aregos", "Barrô", "Cárquere", "Felgueiras e Feirão", "Freigil e Miomães", "Ovadas e Panchorra", "Paços", "Resende", "São Cipriano", "São João de Fontoura"],
    "Santa Comba Dão": ["Ovoa e Vimieiro", "Pinheiro de Ázere", "Santa Comba Dão e Couto do Mosteiro", "São Joaninho", "Treixedo e Nagozela", "Vila Nova de Oliveirinha"],
    "São João da Pesqueira": ["Castanheiro do Sul", "Ervedosa do Douro", "Espinhosa", "Nagozelo do Douro", "Paredes da Beira", "Riodades", "Sambade", "São João da Pesqueira", "Trevões e Espinhosa", "Valongo dos Azeites", "Vilarouco e Pereiros", "Vilarinho do Castelo"],
    "São Pedro do Sul": ["Bordonhos", "Carvalhais", "Figueiredo de Alva", "Manhouce", "Pindelo dos Milagres", "Pinho", "Santa Cruz da Trapa e São Cristóvão de Lafões", "São Félix", "São Martinho das Moitas e Covas do Rio", "São Pedro do Sul, Várzea e Baiões", "Serrazes", "Valadares", "Vila Maior"],
    "Sátão": ["Águas Boas e Forles", "Avelal", "Ferreira de Aves", "Mioma", "Rio de Moinhos", "Romãs, Decermilo e Vila Longa", "São Miguel de Vila Boa", "Sátão", "Silvã de Cima"],
    "Sernancelhe": ["Arnas", "Carregal", "Chosendo", "Cunha", "Ferreirim", "Fonte Arcada e Escurquela", "Granjal", "Lamosa", "Quintela", "Sernancelhe e Sarzeda", "Vila da Ponte"],
    "Tabuaço": ["Adorigo", "Arcos", "Barcos e Santa Leocádia", "Chavães", "Desejosa", "Granja do Tedo", "Longa", "Paradela e Granjinha", "Pinheiros e Vale de Figueira", "Sendim", "Tabuaço", "Távora e Pereiro"],
    "Tarouca": ["Gouviães e Ucanha", "Granja Nova e Vila Chã da Beira", "Mondim da Beira", "Salzedas", "São João de Tarouca", "Tarouca e Dálvares", "Várzea da Serra"],
    "Tondela": ["Barreiro de Besteiros e Tourigo", "Campo de Besteiros", "Canas de Santa Maria", "Caparrosa e Silvares", "Castelões", "Dardavaz", "Ferreirós do Dão", "Guardão", "Lajeosa do Dão", "Lobão da Beira", "Molelos", "Mouraz e Vila Nova da Rainha", "Parada de Gonta", "Sabugosa", "São João do Monte e Mosteirinho", "Santiago de Besteiros", "Tonda", "Tondela e Nandufe"],
    "Vila Nova de Poiares": ["Arrifana", "Lavegadas", "Santo André de Poiares", "São Miguel de Poiares"]
  },

  "Castelo Branco": {
  "Belmonte": ["Belmonte e Colmeal da Torre", "Caria", "Inguias", "Maçainhas"],
  "Castelo Branco": ["Alcains", "Almaceda", "Benquerença", "Castelo Branco", "Cebolais de Cima e Retaxo", "Escalos de Baixo e Mata", "Escalos de Cima e Lousa", "Freixial do Campo e Juncal do Campo", "Lardosa", "Louriçal do Campo", "Malpica do Tejo", "Monforte da Beira", "Póvoa de Rio de Moinhos e Cafede", "Salgueiro do Campo", "Santo André das Tojeiras", "São Vicente da Beira", "Sarzedas", "Tinalhas"],
  "Covilhã": ["Aldeia de São Francisco de Assis", "Barco e Coutada", "Boidobra", "Cantar-Galo e Vila do Carvalho", "Casegas e Ourondo", "Covilhã e Canhoso", "Dominguizo", "Ferro", "Orjais", "Paul", "Peraboa", "Sobral de São Miguel", "Tortosendo", "Unhais da Serra", "Verde e Vale Formoso", "Teixoso e Sarzedo"],
  "Fundão": ["Alcaide", "Alcaria", "Alcongosta", "Aldeia de Joanes", "Aldeia Nova do Cabo", "Barroca", "Bogas de Cima", "Bogas de Baixo", "Capinha", "Castelejo", "Castelo Novo", "Donas", "Enxames", "Fatela", "Lavacolhos", "Orca", "Ourondo e Casegas", "Pêro Viseu", "Póvoa de Atalaia e Atalaia do Campo", "Silvares", "Soalheira", "Souto da Casa", "Telhado", "Vale de Prazeres e Mata da Rainha", "Fundão, Valverde, Donas, Aldeia de Joanes e Aldeia Nova do Cabo"],
  "Idanha-a-Nova": ["Aldeia de Santa Margarida", "Aldeia do Bispo", "Ladoeiro", "Medelim", "Monfortinho e Salvaterra do Extremo", "Oledo", "Penha Garcia", "Proença-a-Velha", "Rosmaninhal", "São Miguel de Acha", "Toulões", "Zebreira e Segura", "Idanha-a-Nova e Alcafozes"],
  "Oleiros": ["Álvaro", "Amieira", "Cambas", "Estreito-Vilar Barroco", "Madeirã", "Mosteiro", "Orvalho", "Sarnadas de São Simão", "Sobral", "Oleiros-Amieira"],
  "Penamacor": ["Águas", "Aldeia do Bispo", "Aranhas", "Benquerença", "Meimão", "Meimoa", "Penamacor", "Salvador", "Vale da Senhora da Póvoa"],
  "Proença-a-Nova": ["Montes da Senhora", "Peral", "Proença-a-Nova e Peral", "São Pedro do Esteval"],
  "Sertã": ["Cabeçudo", "Carvalhal", "Castelo", "Cernache do Bonjardim, Nesperal e Palhais", "Ermida e Figueiredo", "Pedrógão Pequeno", "Sertã", "Troviscal", "Várzea dos Cavaleiros"],
  "Vila de Rei": ["Fundada", "São João do Peso", "Vila de Rei"],
  "Vila Velha de Ródão": ["Fratel", "Perais", "Sarnadas de Ródão", "Vila Velha de Ródão"]
},

"Leiria": {
  "Alcobaça": ["Alcobaça e Vestiaria", "Alfeizerão", "Aljubarrota", "Bárrio", "Benedita", "Cela", "Évora de Alcobaça", "Maiorga", "São Martinho do Porto", "Turquel", "Vimeiro"],
  "Alvaiázere": ["Almoster", "Maçãs de Dona Maria", "Pelmá", "Pussos São Pedro", "Alvaiázere"],
  "Ansião": ["Avelar", "Chão de Couce", "Louriceira", "Santiago da Guarda", "Ansião"],
  "Batalha": ["Batalha", "Golpilheira", "Reguengo do Fetal", "São Mamede"],
  "Bombarral": ["Bombarral e Vale Covo", "Carvalhal", "Pó", "Roliça"],
  "Caldas da Rainha": ["A dos Francos", "Alvorninha", "Caldas da Rainha - Nossa Senhora do Pópulo, Coto e São Gregório", "Caldas da Rainha - Santo Onofre e Serra do Bouro", "Carvalhal Benfeito", "Foz do Arelho", "Landal", "Nadadouro", "Salir de Matos", "Santa Catarina", "Vidais"],
  "Castanheira de Pera": ["Castanheira de Pera e Coentral"],
  "Figueiró dos Vinhos": ["Aguda", "Arega", "Campelo", "Figueiró dos Vinhos e Bairradas"],
  "Leiria": ["Amor", "Arrabal", "Barreira", "Barosa", "Boa Vista", "Cortes", "Leiria, Pousos, Barreira e Cortes", "Caranguejeira", "Coimbrão", "Colmeias e Memória", "Marrazes e Barosa", "Milagres", "Monte Real e Carvide", "Maceira", "Regueira de Pontes", "Santa Catarina da Serra e Chainça", "Souto da Carpalhosa e Ortigosa"],
  "Marinha Grande": ["Marinha Grande", "Moita", "Vieira de Leiria"],
  "Nazaré": ["Famalicão", "Nazaré", "Valado dos Frades"],
  "Óbidos": ["A dos Negros", "Amoreira", "Gaeiras", "Olho Marinho", "Santa Maria, São Pedro e Sobral da Lagoa", "Usseira", "Vau"],
  "Pedrógão Grande": ["Graça", "Pedrógão Grande", "Vila Facaia"],
  "Peniche": ["Ajuda, Conceição e São Pedro", "Atouguia da Baleia", "Ferrel"],
  "Pombal": ["Abiul", "Almagreira", "Carnide", "Carriço", "Guia, Ilha e Mata Mourisca", "Louriçal", "Meirinhas", "Pelariga", "Pombal", "Redinha", "Santiago e São Simão de Litém e Albergaria dos Doze", "Vermoil", "Vila Cã"],
  "Porto de Mós": ["Alqueidão da Serra", "Arrimal e Mendiga", "Calvaria de Cima", "Juncal", "Mira de Aire", "Pedreiras", "Porto de Mós - São João Baptista e São Pedro", "São Bento", "Serro Ventoso"]
},

"Santarém": {
  "Abrantes": ["Aldeia do Mato e Souto", "Alferrarede", "Bemposta", "Carvalhal", "Fontes", "Martinchel", "Mouriscas", "Pego", "Rio de Moinhos", "São Facundo e Vale das Mós", "Tramagal", "União das Freguesias de Abrantes (São Vicente e São João) e Alferrarede"],
  "Alcanena": ["Alcanena e Vila Moreira", "Bugalhos", "Malhou, Louriceira e Espinheiro", "Minde", "Moitas Venda", "Monsanto", "Serra de Santo António"],
  "Almeirim": ["Almeirim", "Benfica do Ribatejo", "Fazendas de Almeirim", "Raposa"],
  "Alpiarça": ["Alpiarça"],
  "Barquinha": ["Atalaia", "Praia do Ribatejo", "Tancos", "Vila Nova da Barquinha"],
  "Cartaxo": ["Cartaxo e Vale da Pinta", "Ereira e Lapa", "Pontével", "Valada", "Vila Chã de Ourique"],
  "Chamusca": ["Carregueira", "Chamusca e Pinheiro Grande", "Parreira e Chouto", "Ulme", "Vale de Cavalos"],
  "Constância": ["Constância", "Montalvo", "Santa Margarida da Coutada"],
  "Coruche": ["Biscainho", "Branca", "Coruche, Fajarda e Erra", "Couço", "Santana do Mato"],
  "Entroncamento": ["Entroncamento"],
  "Ferreira do Zêzere": ["Águas Belas", "Areias e Pias", "Beco", "Chãos", "Ferreira do Zêzere", "Igreja Nova do Sobral"],
  "Golegã": ["Azinhaga", "Golegã", "Pombalinho"],
  "Mação": ["Aboboreira", "Amêndoa", "Cardigos", "Carvoeiro", "Envendos", "Ortiga", "Penhascoso", "São José das Matas", "União das Freguesias de Mação, Penhascoso e Aboboreira"],
  "Ourém": ["Alburitel", "Atouguia", "Caxarias", "Espite", "Fátima", "Freixianda, Ribeira do Fárrio e Formigais", "Gondemaria e Olival", "Matas e Cercal", "Nossa Senhora da Piedade", "Nossa Senhora das Misericórdias", "Rio de Couros e Casal dos Bernardos", "Seiça"],
  "Rio Maior": ["Alcobertas", "Arrouquelas", "Asseiceira", "Fráguas", "Outeiro da Cortiçada e Arruda dos Pisões", "Rio Maior", "São João da Ribeira e Ribeira de São João"],
  "Salvaterra de Magos": ["Glória do Ribatejo e Granho", "Marinhais", "Muge", "Salvaterra de Magos e Foros de Salvaterra"],
  "Santarém": ["Abitureiras", "Achete, Azoia de Baixo e Póvoa de Santarém", "Alcanhões", "Almoster", "Amiais de Baixo", "Arneiro das Milhariças", "Azoia de Cima e Tremês", "Casével e Vaqueiros", "Gançaria", "Moçarria", "Pernes", "Póvoa da Isenta", "Romeira e Várzea", "Santarém", "São Vicente do Paul e Vale de Figueira"],
  "Sardoal": ["Alcaravela", "Santiago de Montalegre", "Sardoal", "Valhascos"],
  "Tomar": ["Além da Ribeira e Pedreira", "Asseiceira", "Carregueiros", "Casais e Alviobeira", "Madalena e Beselga", "Olalhas", "Paialvo", "Sabacheira", "São João Baptista e Santa Maria dos Olivais"],
  "Torres Novas": ["Assentiz e Marmeleira", "Brogueira, Parceiros de Igreja e Alcorochel", "Chancelaria", "Meia Via", "Pedrógão", "Riachos", "Torres Novas (Santa Maria, Salvador e Santiago)", "Zibreira"],
  "Vila Nova da Barquinha": ["Atalaia", "Praia do Ribatejo", "Tancos", "Vila Nova da Barquinha"]
},

"Lisboa": {
  "Alenquer": ["Abrigada e Cabanas de Torres", "Aldeia Galega da Merceana e Aldeia Gavinha", "Alenquer (Santo Estêvão e Triana)", "Carnota", "Carregado e Cadafais", "Olhalvo", "Ota", "Ventosa"],
  "Amadora": ["Águas Livres", "Alfragide", "Encosta do Sol", "Falagueira-Venda Nova", "Mina de Água", "Venteira"],
  "Arruda dos Vinhos": ["Arranhó", "Arruda dos Vinhos", "Cardosas", "Santiago dos Velhos"],
  "Cadaval": ["Alguber", "Cadaval e Pêro Moniz", "Lamas e Cercal", "Painho e Figueiros", "Peral", "Vermelha", "Vilar"],
  "Cascais": ["Alcabideche", "Carcavelos e Parede", "Cascais e Estoril", "São Domingos de Rana"],
  "Lisboa": ["Ajuda", "Alcântara", "Areeiro", "Arroios", "Avenidas Novas", "Beato", "Belém", "Benfica", "Campo de Ourique", "Campolide", "Carnide", "Estrela", "Lumiar", "Marvila", "Misericórdia", "Olivais", "Parque das Nações", "Penha de França", "Santa Clara", "Santa Maria Maior", "Santo António", "São Domingos de Benfica", "São Vicente"],
  "Loures": ["Bobadela", "Bucelas", "Camarate, Unhos e Apelação", "Fanhões", "Loures", "Lousa", "Moscavide e Portela", "Sacavém e Prior Velho", "Santa Iria de Azoia, São João da Talha e Bobadela", "Santo Antão e São Julião do Tojal", "Santo António dos Cavaleiros e Frielas"],
  "Lourinhã": ["Lourinhã e Atalaia", "Miragaia e Marteleira", "Moita dos Ferreiros", "Reguengo Grande", "Ribamar", "Santa Bárbara", "São Bartolomeu dos Galegos e Moledo", "Vimeiro"],
  "Mafra": ["Encarnação", "Ericeira", "Mafra", "Malveira e São Miguel de Alcainça", "Milharado", "Santo Isidoro", "Venda do Pinheiro e Santo Estêvão das Galés", "Carvoeira", "Azueira e Sobral da Abelheira"],
  "Odivelas": ["Caneças", "Famões", "Odivelas", "Pontinha e Famões", "Póvoa de Santo Adrião e Olival Basto", "Ramada e Caneças"],
  "Oeiras": ["Algés, Linda-a-Velha e Cruz Quebrada-Dafundo", "Barcarena", "Carnaxide e Queijas", "Oeiras e São Julião da Barra, Paço de Arcos e Caxias", "Porto Salvo"],
  "Sintra": ["Agualva e Mira-Sintra", "Algueirão-Mem Martins", "Almargem do Bispo, Pêro Pinheiro e Montelavar", "Cacém e São Marcos", "Casal de Cambra", "Colares", "Massamá e Monte Abraão", "Queluz e Belas", "Rio de Mouro", "Santa Maria e São Miguel, São Martinho e São Pedro de Penaferrim"],
  "Sobral de Monte Agraço": ["Santo Quintino", "Sobral de Monte Agraço", "Sapataria"],
  "Torres Vedras": ["A dos Cunhados e Maceira", "Campelos e Outeiro da Cabeça", "Carvoeira e Carmões", "Dois Portos e Runa", "Freiria", "Maxial e Monte Redondo", "Ponte do Rol", "Ramalhal", "Santa Maria, São Pedro e Matacães", "São Pedro da Cadeira", "Silveira", "Turcifal", "Ventosa"],
  "Vila Franca de Xira": ["Alhandra, São João dos Montes e Calhandriz", "Alverca do Ribatejo e Sobralinho", "Castanheira do Ribatejo e Cachoeiras", "Forte da Casa", "Póvoa de Santa Iria e Forte da Casa", "Vialonga", "Vila Franca de Xira"]
},

"Portalegre": {
  "Alter do Chão": ["Alter do Chão", "Chancelaria", "Seda", "São Marcos"],
  "Arronches": ["Assunção", "Esperança", "Mosteiros"],
  "Avis": ["Aldeia Velha", "Avis", "Benavila", "Ervedal", "Figueira e Barros", "Valongo", "Alcórrego e Maranhão"],
  "Campo Maior": ["Nossa Senhora da Expectação", "Nossa Senhora da Graça dos Degolados", "São João Baptista"],
  "Castelo de Vide": ["Nossa Senhora da Graça de Póvoa e Meadas", "Santa Maria da Devesa", "São João Baptista", "Santiago Maior"],
  "Crato": ["Aldeia da Mata", "Crato e Mártires", "Flor da Rosa", "Gáfete", "Monte da Pedra"],
  "Elvas": ["Assunção, Ajuda, Salvador e Santo Ildefonso", "Caia, São Pedro e Alcáçova", "Barbacena e Vila Fernando", "Santa Eulália", "São Brás e São Lourenço", "Terrugem e Vila Boim"],
  "Fronteira": ["Cabeço de Vide", "Fronteira", "São Saturnino"],
  "Gavião": ["Atalaia", "Belver", "Comenda", "Gavião e Atalaia"],
  "Marvão": ["Beirã", "Santa Maria de Marvão", "Santo António das Areias", "São Salvador da Aramenha"],
  "Monforte": ["Assumar", "Monforte", "Santo Aleixo", "Vaiamonte"],
  "Nisa": ["Alpalhão", "Arez e Amieira do Tejo", "Espírito Santo, Nossa Senhora da Graça e São Simão", "Montalvão", "Santana", "São Matias", "Tolosa"],
  "Ponte de Sor": ["Foros de Arrão", "Galveias", "Longomel", "Montargil", "Ponte de Sor, Tramaga e Vale de Açor"],
  "Portalegre": ["Alegrete", "Caia e São Pedro", "Fortios", "Reguengo e São Julião", "Ribeira de Nisa e Carreiras", "Sé e São Lourenço", "Urra", "São Mamede"],
  "Sousel": ["Cano", "Casa Branca", "Santo Amaro", "Sousel"]
},

"Évora": {
  "Alandroal": ["Alandroal (Nossa Senhora da Conceição)", "Capelins (Santo António)", "Juromenha (Nossa Senhora do Loreto)", "Terena (São Pedro)"],
  "Arraiolos": ["Arraiolos", "Gafanhoeira (São Pedro) e Sabugueiro", "Igrejinha", "Santa Justa e São Lourenço", "Vimieiro"],
  "Borba": ["Borba (Matriz)", "Borba (São Bartolomeu)", "Orada", "Rio de Moinhos"],
  "Estremoz": ["Arcos", "Estremoz (Santa Maria e Santo André)", "Évora Monte (Santa Maria)", "Glória", "Santa Vitória do Ameixial", "Santo Estêvão", "São Bento do Ameixial", "São Domingos de Ana Loura", "Veiros"],
  "Évora": ["Bacelo e Senhora da Saúde", "Canaviais", "Évora (São Mamede, Sé, São Pedro e Santo Antão)", "Malagueira e Horta das Figueiras", "Nossa Senhora da Tourega e Nossa Senhora de Guadalupe", "São Bento do Mato", "São Manços e São Vicente do Pigeiro", "Torre de Coelheiros"],
  "Montemor-o-Novo": ["Cabrela", "Ciborro", "Corte do Pinto", "Foros de Vale de Figueira", "Lavre", "Nossa Senhora da Vila, Nossa Senhora do Bispo e Silveiras", "São Cristóvão"],
  "Mora": ["Brotas", "Cabeção", "Mora", "Pavia"],
  "Mourão": ["Granja", "Luz", "Mourão"],
  "Portel": ["Alqueva", "Amieira", "Monte do Trigo", "Portel", "Santana", "Vera Cruz"],
  "Redondo": ["Montoito", "Redondo"],
  "Reguengos de Monsaraz": ["Campo e Campinho", "Corval", "Monsaraz", "Reguengos de Monsaraz"],
  "Vendas Novas": ["Landeira", "Vendas Novas"],
  "Viana do Alentejo": ["Aguiar", "Viana do Alentejo", "Vila Nova da Baronia"],
  "Vila Viçosa": ["Bencatel", "Ciladas", "Pardais", "Nossa Senhora da Conceição e São Bartolomeu"]
},

"Setúbal": {
  "Alcácer do Sal": ["Alcácer do Sal (Santa Maria do Castelo e Santiago) e Santa Susana", "Comporta", "São Martinho", "Torrão"],
  "Almada": ["Almada, Cova da Piedade, Pragal e Cacilhas", "Caparica e Trafaria", "Charneca de Caparica e Sobreda", "Costa da Caparica", "Laranjeiro e Feijó"],
  "Barreiro": ["Alto do Seixalinho, Santo André e Verderena", "Barreiro e Lavradio", "Palhais e Coina", "Santo António da Charneca"],
  "Grândola": ["Azinheira dos Barros e São Mamede do Sádão", "Carvalhal", "Grândola e Santa Margarida da Serra", "Melides"],
  "Moita": ["Alhos Vedros", "Baixa da Banheira e Vale da Amoreira", "Moita", "Sarilhos Grandes"],
  "Montijo": ["Atalaia e Alto Estanqueiro-Jardia", "Canha", "Montijo e Afonsoeiro", "Pegões", "Sarilhos Grandes"],
  "Palmela": ["Palmela", "Pinhal Novo", "Poceirão e Marateca", "Quinta do Anjo"],
  "Santiago do Cacém": ["Abela", "Alvalade", "Cercal do Alentejo", "Ermidas-Sado", "Santiago do Cacém, Santa Cruz e São Bartolomeu da Serra", "Santo André", "São Domingos e Vale de Água"],
  "Seixal": ["Amora", "Arrentela", "Corroios", "Fernão Ferro", "Seixal, Arrentela e Aldeia de Paio Pires"],
  "Sesimbra": ["Castelo", "Quinta do Conde", "Santiago"],
  "Setúbal": ["Azeitão (São Lourenço e São Simão)", "Gâmbia-Pontes-Alto da Guerra", "Sado", "São Sebastião", "Setúbal (União das Freguesias)"],
  "Sines": ["Porto Covo", "Sines"]
},

"Beja": {
  "Aljustrel": ["Aljustrel", "Ervidel", "Messejana", "Rio de Moinhos", "São João de Negrilhos"],
  "Almodôvar": ["Aldeia dos Fernandes", "Almodôvar e Graça dos Padrões", "Rosário", "Santa Clara-a-Nova e Gomes Aires", "Santa Cruz", "São Barnabé"],
  "Alvito": ["Alvito", "Vila Nova da Baronia"],
  "Barrancos": ["Barrancos"],
  "Beja": ["Albernoa e Trindade", "Baleizão", "Beja (Salvador e Santa Maria da Feira)", "Beja (Santiago Maior e São João Baptista)", "Beringel", "Cabeça Gorda", "Neves", "Nossa Senhora das Neves", "Santa Vitória e Mombeja", "Trindade"],
  "Castro Verde": ["Castro Verde e Casével", "Entradas", "Santa Bárbara de Padrões", "São Marcos da Ataboeira"],
  "Cuba": ["Cuba", "Faro do Alentejo", "Vila Alva", "Vila Ruiva"],
  "Ferreira do Alentejo": ["Alfundão e Peroguarda", "Ferreira do Alentejo e Canhestros", "Figueira dos Cavaleiros", "Odivelas"],
  "Mértola": ["Alcaria Ruiva", "Corte do Pinto", "Corte Gafo de Cima", "Espírito Santo", "Mértola", "Santana de Cambas", "São João dos Caldeireiros", "São Miguel do Pinheiro, São Pedro de Solis e São Sebastião dos Carros"],
  "Moura": ["Amareleja", "Moura (Santo Agostinho e São João Baptista) e Santo Amador", "Póvoa de São Miguel", "Safara e Santo Aleixo da Restauração"],
  "Odemira": ["Boavista dos Pinheiros", "Colos", "Luzianes-Gare", "Relíquias", "Sabóia", "Santa Clara-a-Velha", "São Luís", "São Martinho das Amoreiras", "São Salvador e Santa Maria", "São Teotónio", "Vale de Santiago", "Vila Nova de Milfontes", "Zambujeira do Mar"],
  "Ourique": ["Garvão e Santa Luzia", "Ourique", "Panóias e Conceição", "Santana da Serra"],
  "Serpa": ["Brinches", "Pias", "Serpa (Salvador e Santa Maria)", "Vila Nova de São Bento e Vale de Vargo", "Vila Verde de Ficalho", "Vila Nova de São Bento"],
  "Vidigueira": ["Pedrógão", "Selmes", "Vidigueira", "Vila de Frades"]
},

"Faro": {
  "Albufeira": ["Albufeira e Olhos de Água", "Ferreiras", "Guia", "Paderne"],
  "Alcoutim": ["Alcoutim e Pereiro", "Giões", "Martim Longo", "Vaqueiros"],
  "Aljezur": ["Aljezur", "Bordeira", "Odeceixe", "Rogil"],
  "Castro Marim": ["Alcantarilha e Pereiro", "Altura", "Azinhal", "Castro Marim"],
  "Faro": ["Conceição e Estoi", "Faro (Sé e São Pedro)", "Montenegro", "Santa Bárbara de Nexe"],
  "Lagoa": ["Estômbar e Parchal", "Ferragudo", "Lagoa e Carvoeiro", "Porches"],
  "Lagos": ["Bensafrim e Barão de São João", "Luz", "Odiáxere", "São Gonçalo de Lagos"],
  "Loulé": ["Almancil", "Alte", "Ameixial", "Boliqueime", "Quarteira", "São Clemente", "São Sebastião", "Salir", "Benafim", "Tôr", "Querença, Tôr e Benafim"],
  "Monchique": ["Alferce", "Marmelete", "Monchique"],
  "Olhão": ["Moncarapacho e Fuseta", "Olhão", "Pechão", "Quelfes"],
  "Portimão": ["Alvor", "Mexilhoeira Grande", "Portimão"],
  "São Brás de Alportel": ["São Brás de Alportel"],
  "Silves": ["Alcantarilha e Pêra", "Algoz e Tunes", "Armação de Pêra", "São Bartolomeu de Messines", "Silves", "São Marcos da Serra", "São Bartolomeu de Messines"],
  "Tavira": ["Cabanas de Tavira", "Conceição e Cabanas de Tavira", "Luz de Tavira e Santo Estêvão", "Santa Catarina da Fonte do Bispo", "Santa Luzia", "Santiago", "Santo Estêvão", "Tavira (Santa Maria e Santiago)"],
  "Vila do Bispo": ["Barão de São Miguel", "Budens", "Raposeira", "Sagres", "Vila do Bispo e Raposeira"],
  "Vila Real de Santo António": ["Monte Gordo", "Vila Nova de Cacela", "Vila Real de Santo António"]
}

}



document.addEventListener("DOMContentLoaded", function () {
  const distritoSel = document.getElementById("distrito");
  const concelhoSel = document.getElementById("concelho");
  const freguesiaSel = document.getElementById("freguesia");

  // Preencher distritos
  Object.keys(dadosLocais).forEach(distrito => {
    const opt = document.createElement("option");
    opt.value = distrito;
    opt.textContent = distrito;
    distritoSel.appendChild(opt);
  });

  // Ao mudar distrito
  distritoSel.addEventListener("change", function () {
    concelhoSel.innerHTML = '<option value="">Selecione o concelho...</option>';
    freguesiaSel.innerHTML = '<option value="">Selecione a freguesia...</option>';
    freguesiaSel.disabled = true;

    if (this.value) {
      concelhoSel.disabled = false;
      Object.keys(dadosLocais[this.value]).forEach(concelho => {
        const opt = document.createElement("option");
        opt.value = concelho;
        opt.textContent = concelho;
        concelhoSel.appendChild(opt);
      });
    } else {
      concelhoSel.disabled = true;
      freguesiaSel.disabled = true;
    }
  });

  // Ao mudar concelho
  concelhoSel.addEventListener("change", function () {
    freguesiaSel.innerHTML = '<option value="">Selecione a freguesia...</option>';
    if (distritoSel.value && this.value) {
      freguesiaSel.disabled = false;
      dadosLocais[distritoSel.value][this.value].forEach(freguesia => {
        const opt = document.createElement("option");
        opt.value = freguesia;
        opt.textContent = freguesia;
        freguesiaSel.appendChild(opt);
      });
    } else {
      freguesiaSel.disabled = true;
    }
  });
});
