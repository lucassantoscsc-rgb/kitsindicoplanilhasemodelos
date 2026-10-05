/* Páginas legais: preenche dados a partir do config.js */
(function () {
  "use strict";
  var cfg = window.KIT_CONFIG || {};
  function filled(v) {
    if (v === undefined || v === null) return false;
    var s = String(v).trim();
    return s !== "" && !/^\[.*\]$/.test(s);
  }
  var resp = cfg.responsavel || {};
  var nome = filled(resp.nome) ? resp.nome : "Kit Síndico";
  var doc = filled(resp.documento) ? resp.documento : "";
  var email = filled(cfg.emailSuporte) ? cfg.emailSuporte : "";

  document.querySelectorAll("[data-legal-bind]").forEach(function (el) {
    switch (el.getAttribute("data-legal-bind")) {
      case "nome": el.textContent = nome; break;
      case "documento":
        if (doc) el.textContent = ", " + doc; else el.remove();
        break;
      case "garantia": el.textContent = String(cfg.garantiaDias || 7); break;
      case "email":
        if (email) {
          var a = document.createElement("a");
          a.href = "mailto:" + email; a.textContent = email;
          el.replaceWith(a);
        } else {
          el.textContent = "o e-mail de suporte informado na mensagem de entrega da compra";
        }
        break;
    }
  });
  var y = document.getElementById("ano");
  if (y) y.textContent = new Date().getFullYear();
})();
