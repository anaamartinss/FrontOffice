/**
* Template Name: Bethany
* Template URL: https://bootstrapmade.com/bethany-free-onepage-bootstrap-theme/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
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

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
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

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
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

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
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

  /**
   * Navmenu Scrollspy
   */
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

/**
 * * Guardar Dados do formulário em Local Storage
 */
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("reportForm");

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Captura os dados do formulário
    const formData = new FormData(form);
    const jsonData = {};

    // Converte os dados do formulário para JSON
    formData.forEach((value, key) => {
      jsonData[key] = value;
    });

    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!jsonData.tipo_ocorrencia || !jsonData.local || !jsonData.morada) {
      alert("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    // Captura o arquivo anexado e converte para Base64
    const fileInput = document.getElementById("anexo");
    const file = fileInput.files[0]; // Obtém o primeiro arquivo anexado

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
  // Adiciona o arquivo em Base64 dentro de um array chamado "imagens"
  jsonData.imagens = [e.target.result];

  // Armazena os dados no Local Storage
  const storedReports = JSON.parse(localStorage.getItem("reports")) || [];
  storedReports.push(jsonData);
  localStorage.setItem("reports", JSON.stringify(storedReports));

  alert("Ocorrência enviada com sucesso!");
  form.reset();
};

      reader.readAsDataURL(file); // Converte o arquivo para Base64
    } else {
      // Caso nenhum arquivo seja anexado, salva os dados sem o anexo
      const storedReports = JSON.parse(localStorage.getItem("reports")) || [];
      storedReports.push(jsonData);
      localStorage.setItem("reports", JSON.stringify(storedReports));

      // Feedback ao usuário
      alert("Ocorrência enviada com sucesso!");

      // Limpa o formulário após o envio
      form.reset();
    }
  });
});



document.addEventListener("DOMContentLoaded", function () {
  // Seleciona todos os cards da seção "Reportar"
  const serviceItems = document.querySelectorAll(".service-item");

  // Adiciona um evento de clique a cada card
  serviceItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Obtém o valor do tipo de ocorrência do atributo data-tipo
      const tipoOcorrencia = item.getAttribute("data-tipo");

      // Preenche o campo "Tipo de Ocorrência" no formulário
      const tipoOcorrenciaSelect = document.getElementById("tipo-ocorrencia");
      tipoOcorrenciaSelect.value = tipoOcorrencia;

      // Rola a página até o formulário
      document.getElementById("reportar").scrollIntoView({ behavior: "smooth" });
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  // Número de ocorrências = número de objetos no array "reports"
  const reports = JSON.parse(localStorage.getItem("reports")) || [];
  document.getElementById("num-ocorrencias").textContent = reports.length;

  // Número de peritos = valor guardado em localStorage (exemplo: localStorage.setItem('numPeritos', 70))
  const numPeritos = localStorage.getItem("numPeritos") || 0;
  document.getElementById("num-peritos").textContent = numPeritos;
});