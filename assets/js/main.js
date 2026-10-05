/* Kit Síndico — comportamento da página (JS puro, sem dependências) */
(function () {
  "use strict";

  var cfg = window.KIT_CONFIG || {};
  var $ = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };

  // Vazio ou ainda entre colchetes ("[ALGO]") = não preenchido.
  function filled(v) {
    if (v === undefined || v === null) return false;
    var s = String(v).trim();
    return s !== "" && !/^\[.*\]$/.test(s);
  }

  // 27 -> "27" | 3.333 -> "3,33"
  function num(n) {
    return Number(n) % 1 === 0 ? String(Number(n)) : Number(n).toFixed(2).replace(".", ",");
  }

  var precos = cfg.precos || { essencial: 17, completo: 27 };
  var diff = precos.completo - precos.essencial;
  var OFERTAS = {
    essencial: { value: precos.essencial, name: "Kit Síndico Essencial" },
    completo: { value: precos.completo, name: "Kit Síndico Completo" }
  };

  /* ---------- 1. Preenche textos a partir do config ---------- */
  var binds = {
    "garantia": num(cfg.garantiaDias || 7),
    "preco-essencial": num(precos.essencial),
    "preco-completo": num(precos.completo),
    "diferenca": num(diff),
    "por-bonus": "R$" + num(Math.floor((diff / 3) * 100) / 100),
    "pagamento": filled(cfg.formasPagamento) ? cfg.formasPagamento : "Pix e cartão",
    "selo": cfg.maisVendidoConfirmado === true ? "Mais vendido" : "Recomendado"
  };
  if (filled(cfg.emailSuporte)) binds.email = cfg.emailSuporte;
  $$("[data-bind]").forEach(function (el) {
    var k = el.getAttribute("data-bind");
    if (binds[k] !== undefined) el.textContent = binds[k];
  });

  // E-mail de suporte (links mailto). Sem e-mail: oculta o link do rodapé e o texto vira neutro no FAQ.
  $$("[data-bind-mail]").forEach(function (a) {
    if (filled(cfg.emailSuporte)) {
      a.href = "mailto:" + cfg.emailSuporte;
      if (!a.querySelector("[data-bind]")) a.textContent = cfg.emailSuporte;
      a.hidden = false;
    } else if (a.closest(".footer")) {
      a.hidden = true;
    } else {
      a.replaceWith(document.createTextNode("o suporte"));
    }
  });

  // Links legais
  var links = cfg.links || {};
  $$("[data-legal]").forEach(function (a) {
    var url = links[a.getAttribute("data-legal")];
    if (filled(url)) { a.href = url; a.hidden = false; }
  });

  // Preço anterior (somente se for real e preenchido)
  var antigo = cfg.precoAnterior || {};
  $$("[data-old]").forEach(function (el) {
    var v = antigo[el.getAttribute("data-old")];
    if (filled(v)) { el.textContent = "De R$" + num(v) + " por"; el.hidden = false; }
  });

  // Urgência (somente se real e preenchida)
  if (filled(cfg.urgencia)) {
    var u = $("#urgencia");
    u.textContent = cfg.urgencia;
    u.hidden = false;
  }

  /* ---------- 2. Prova social (oculta se vazia) ---------- */
  var deps = (cfg.depoimentos || []).filter(function (d) { return d && filled(d.texto) && filled(d.nome); });
  if (deps.length) {
    var lista = $("#depoimentos-lista");
    deps.forEach(function (d) {
      var fig = document.createElement("figure");
      fig.className = "testimonial reveal";
      var q = document.createElement("blockquote");
      q.textContent = "“" + d.texto + "”";
      var cap = document.createElement("figcaption");
      if (filled(d.foto)) {
        var img = document.createElement("img");
        img.src = d.foto; img.alt = ""; img.width = 48; img.height = 48; img.loading = "lazy";
        cap.appendChild(img);
      }
      var who = document.createElement("span");
      var n = document.createElement("strong");
      n.textContent = d.nome;
      who.appendChild(n);
      who.appendChild(document.createTextNode([d.funcao, d.cidade].filter(filled).join(" • ")));
      cap.appendChild(who);
      fig.appendChild(q); fig.appendChild(cap);
      lista.appendChild(fig);
    });
    $("#depoimentos").hidden = false;
  }

  /* ---------- 3. Sobre o autor (oculta se vazio) ---------- */
  var autor = cfg.sobreAutor || {};
  if (filled(autor.texto)) {
    $("#autor-texto").textContent = autor.texto;
    if (filled(autor.nome)) $("#autor-nome").textContent = autor.nome;
    else $("#autor-nome").remove();
    if (filled(autor.foto)) {
      var f = $("#autor-foto");
      f.src = autor.foto; f.alt = filled(autor.nome) ? "Foto de " + autor.nome : "Foto do criador do kit"; f.hidden = false;
    }
    $("#autor").hidden = false;
  }

  /* ---------- 4. Rastreamento (Meta Pixel + GA4) ---------- */
  window.dataLayer = window.dataLayer || [];
  window.kitEvents = []; // log para conferência no console

  if (filled(cfg.metaPixelId)) {
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq("init", String(cfg.metaPixelId).trim());
  }
  if (filled(cfg.ga4Id)) {
    var gs = document.createElement("script");
    gs.async = true;
    gs.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(String(cfg.ga4Id).trim());
    document.head.appendChild(gs);
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", String(cfg.ga4Id).trim()); // envia page_view
  }

  var GA4_NAMES = { ViewContent: "view_item", InitiateCheckout: "begin_checkout" };

  function track(name, params) {
    params = params || {};
    window.kitEvents.push({ event: name, params: params, at: Date.now() });
    if (window.fbq) window.fbq("track", name, params);
    if (window.gtag && GA4_NAMES[name]) {
      var ga = { currency: params.currency || "BRL" };
      if (params.value !== undefined) {
        ga.value = params.value;
        ga.items = [{ item_id: params.content_ids ? params.content_ids[0] : "", item_name: params.content_name, price: params.value, quantity: 1 }];
      }
      window.gtag("event", GA4_NAMES[name], ga);
    }
  }

  track("PageView");

  /* ---------- 5. Checkout: links com UTMs preservadas ---------- */
  var FORWARD = /^(utm_[a-z]+|fbclid|gclid|ttclid|src|sck|xcod)$/i;

  function buildCheckoutUrl(key) {
    var base = (cfg.checkout || {})[key];
    if (!filled(base)) return null;
    var url;
    try { url = new URL(String(base).trim(), location.href); } catch (e) { return null; }
    new URLSearchParams(location.search).forEach(function (v, k) {
      if (FORWARD.test(k) && !url.searchParams.has(k)) url.searchParams.set(k, v);
    });
    return url.toString();
  }
  window.KitPage = { buildCheckoutUrl: buildCheckoutUrl, track: track };

  $$("[data-checkout]").forEach(function (a) {
    var key = a.getAttribute("data-checkout");
    var url = buildCheckoutUrl(key);
    if (url) a.href = url; // permite abrir em nova aba com Ctrl/Cmd+clique

    a.addEventListener("click", function (e) {
      var oferta = OFERTAS[key];
      track("InitiateCheckout", {
        value: oferta.value,
        currency: "BRL",
        content_name: oferta.name,
        content_ids: [key],
        content_type: "product",
        num_items: 1
      });
      var dest = buildCheckoutUrl(key);
      if (!dest) {
        e.preventDefault();
        console.warn("[Kit Síndico] Link de checkout '" + key + "' não preenchido em config.js.");
        return;
      }
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; // nova aba: deixa o navegador agir
      e.preventDefault();
      // pequena espera para os pixels enviarem o evento antes de sair da página
      setTimeout(function () { location.href = dest; }, 300);
    });
  });

  /* ---------- 6. Observadores: ViewContent, CTA fixo, animações ---------- */
  var hasIO = "IntersectionObserver" in window;
  var ofertas = $("#ofertas");

  if (hasIO && ofertas) {
    var viewed = false;
    new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting && !viewed) {
          viewed = true;
          track("ViewContent", { content_name: "Ofertas Kit Síndico", content_ids: ["essencial", "completo"], content_type: "product", currency: "BRL", value: precos.completo });
          obs.disconnect();
        }
      });
    }, { threshold: 0, rootMargin: "0px 0px -35% 0px" }).observe(ofertas.querySelector(".offers") || ofertas);
  }

  // CTA fixo no mobile: aparece depois do hero, some quando as ofertas estão na tela
  var sticky = $("#sticky-cta");
  var hero = $(".hero");
  if (hasIO && sticky && hero) {
    var pastHero = false, onOffers = false, onFinal = false;
    var stickyLink = sticky.querySelector("a");
    var update = function () {
      var show = pastHero && !onOffers && !onFinal;
      sticky.classList.toggle("is-visible", show);
      sticky.setAttribute("aria-hidden", show ? "false" : "true");
      stickyLink.tabIndex = show ? 0 : -1;
      document.body.style.setProperty("--sticky-h", show ? "76px" : "0px");
    };
    new IntersectionObserver(function (en) {
      pastHero = !en[0].isIntersecting && en[0].boundingClientRect.top < 0; update();
    }).observe(hero);
    if (ofertas) new IntersectionObserver(function (en) { onOffers = en[0].isIntersecting; update(); }).observe(ofertas);
    var fin = $("#final");
    if (fin) new IntersectionObserver(function (en) { onFinal = en[0].isIntersecting; update(); }).observe(fin);
  }

  // Fade-in ao rolar (CSS já respeita prefers-reduced-motion)
  var reveals = $$(".reveal");
  if (hasIO) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); ro.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    reveals.forEach(function (el) { ro.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  var ano = $("#ano");
  if (ano) ano.textContent = new Date().getFullYear();
})();
