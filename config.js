/*
 * ============================================================
 *  CONFIGURAÇÃO CENTRAL — Kit Síndico
 *  Altere tudo aqui. Não é preciso mexer no HTML.
 *
 *  Regra geral: um valor vazio ("") ou ainda entre colchetes
 *  (ex.: "[LINK_CHECKOUT_27]") é tratado como NÃO PREENCHIDO.
 *  Seções opcionais com valores não preenchidos ficam ocultas.
 * ============================================================
 */
window.KIT_CONFIG = {
  // ---- Checkout (links externos) ----------------------------
  checkout: {
    essencial: "[LINK_CHECKOUT_17]", // ex.: "https://pay.exemplo.com/abc"
    completo: "https://pay.cakto.com.br/3pmy9fp_1169380"
  },

  // ---- Preços (número, em reais) ---------------------------
  precos: {
    essencial: 17,
    completo: 27
  },

  // Preço anterior REAL (se nunca existiu, deixe vazio).
  // Quando preenchido, aparece riscado no card ("De R$X").
  precoAnterior: {
    essencial: "", // [PRECO_ANTERIOR_17] ex.: 27
    completo: ""   // [PRECO_ANTERIOR_27] ex.: 47
  },

  // ---- Oferta ------------------------------------------------
  garantiaDias: 7,                       // [PRAZO_GARANTIA]
  formasPagamento: "Pix e cartão",       // [FORMAS_PAGAMENTO]

  // Urgência REAL (ex.: "Preço de lançamento válido até 10/11").
  // Vazio = nenhuma mensagem de urgência na página.
  urgencia: "",                          // [URGENCIA_REAL]

  // Mostrar o selo "Mais vendido" no lugar de "Recomendado"?
  // Só mude para true se isso for verdade.
  maisVendidoConfirmado: false,

  // ---- Contato e páginas legais ------------------------------
  emailSuporte: "[EMAIL_SUPORTE]",       // ex.: "suporte@seudominio.com.br"
  links: {
    privacidade: "[LINK_PRIVACIDADE]",   // ex.: "/privacidade.html"
    termos: "[LINK_TERMOS]"
  },

  // ---- Rastreamento (só carrega se preenchido) ---------------
  metaPixelId: "[META_PIXEL_ID]",        // ex.: "123456789012345"
  ga4Id: "[GA4_ID]",                     // ex.: "G-XXXXXXXXXX"

  // ---- Prova social (seção oculta enquanto estiver vazia) ----
  // Use SOMENTE depoimentos reais, com autorização.
  // funcao: "Síndico morador" | "Síndica profissional" | etc.
  depoimentos: [
    // { nome: "[DEPOIMENTO_1_NOME]", funcao: "[DEPOIMENTO_1_FUNCAO]", cidade: "[DEPOIMENTO_1_CIDADE]", texto: "[DEPOIMENTO_1]", foto: "" },
    // { nome: "[DEPOIMENTO_2_NOME]", funcao: "[DEPOIMENTO_2_FUNCAO]", cidade: "[DEPOIMENTO_2_CIDADE]", texto: "[DEPOIMENTO_2]", foto: "" },
    // { nome: "[DEPOIMENTO_3_NOME]", funcao: "[DEPOIMENTO_3_FUNCAO]", cidade: "[DEPOIMENTO_3_CIDADE]", texto: "[DEPOIMENTO_3]", foto: "" }
  ],

  // ---- Sobre o criador (seção oculta enquanto estiver vazia) --
  sobreAutor: {
    nome: "[AUTOR_NOME]",
    texto: "[SOBRE_O_AUTOR]",            // 2–4 frases curtas
    foto: ""                             // ex.: "assets/img/autor.webp" (400x400)
  }
};
