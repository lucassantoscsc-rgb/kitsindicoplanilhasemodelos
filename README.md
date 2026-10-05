# Kit Síndico: página de vendas

Site estático (HTML + CSS + JS puro), sem build. Pronto para Vercel ou Netlify: publique a pasta raiz.

```
index.html            página
privacidade.html      política de privacidade (/privacidade)
termos.html           termos de uso (/termos)
config.js             TUDO que você precisa alterar (links, preços, pixel, textos opcionais)
assets/css/styles.css estilos (mobile-first)
assets/js/main.js     preenchimento a partir do config, rastreamento, UTMs, CTA fixo
assets/img/           imagens (placeholders .svg até você enviar as reais)
vercel.json / netlify.toml  cabeçalhos de cache
```

Para rodar localmente: `python3 -m http.server 5173` e abra http://localhost:5173.

## Placeholders a preencher

### No `config.js`
| Placeholder | O que é | Se ficar vazio |
|---|---|---|
| `[LINK_CHECKOUT_17]` | link do checkout do Essencial | o botão não sai da página (aviso no console) |
| `[LINK_CHECKOUT_27]` | link do checkout do Completo | idem |
| `garantiaDias` (`[PRAZO_GARANTIA]`) | padrão 7 | — |
| `formasPagamento` (`[FORMAS_PAGAMENTO]`) | padrão "Pix e cartão" | — |
| `[PRECO_ANTERIOR_17]` / `[PRECO_ANTERIOR_27]` | só se existiu um preço anterior real | nada riscado aparece |
| `[URGENCIA_REAL]` | só se houver prazo/condição real | nenhuma urgência aparece |
| `maisVendidoConfirmado` | `true` só se for verdade | selo "Recomendado" |
| `[EMAIL_SUPORTE]` | e-mail de suporte | link do rodapé oculto; FAQ diz "o suporte" |
| `[NOME_OU_RAZAO_SOCIAL]` / `[CPF_OU_CNPJ]` | quem vende (aparece em Termos e Privacidade) | textos usam "Kit Síndico" e omitem o documento |
| `[META_PIXEL_ID]` | ID do Meta Pixel | Pixel não carrega |
| `[GA4_ID]` | ID do GA4 (G-XXXX) | GA4 não carrega |
| `[DEPOIMENTO_1..3]` (+ nome, função, cidade, foto) | depoimentos reais | seção "Quem já usa" oculta |
| `[AUTOR_NOME]` / `[SOBRE_O_AUTOR]` / foto | sobre o criador | seção oculta |

### No `index.html`
| Placeholder | Onde |
|---|---|
| URL do site | já preenchida: `https://www.kitsindicocompleto.online` (canonical e Open Graph no `<head>`) |
| `[CONFIRMAR]` outros modelos do kit (ex.: comunicados) | não foram mencionados; só adiciono se você confirmar |

## Imagens para enviar

Salve em `assets/img/` com estes nomes (WebP; troque a extensão `.svg` → `.webp` no `index.html`):

| Arquivo | Dimensão | Uso |
|---|---|---|
| `hero-painel.webp` | 1200 × 800 | print do Painel geral (hero, carrega primeiro, < 120 KB) |
| `print-painel.webp` | 1200 × 750 | galeria |
| `print-tarefas.webp` | 1200 × 750 | galeria |
| `print-manutencoes.webp` | 1200 × 750 | galeria |
| `print-orcamentos.webp` | 1200 × 750 | galeria |
| `print-despesas.webp` | 1200 × 750 | galeria |
| `print-comece-aqui.webp` | 1200 × 750 | galeria |
| `og-image.png` | 1200 × 630 | compartilhamento (já existe uma provisória) |
| `autor.webp` (opcional) | 400 × 400 | sobre o criador |
| fotos de depoimentos (opcional) | 160 × 160 | prova social |

## Headlines para teste A/B
1. ★ (em uso) "Saiba o que está atrasado, o que vence e quanto foi gasto. Tudo num painel só."
2. "O condomínio inteiro sob controle em uma planilha pronta, sem montar nada do zero."
3. "Pare de administrar o condomínio pela memória e pelo WhatsApp."
4. "Chegue à prestação de contas com tudo anotado, conferido e no lugar."
5. "Um ou 100 condomínios: um painel mostra o que precisa da sua atenção hoje."

## Rastreamento
- `PageView`: ao carregar (Pixel; o GA4 envia `page_view` sozinho).
- `ViewContent`: uma vez, quando os cards de oferta entram na tela.
- `InitiateCheckout`: em cada botão de compra, com `value` 17 ou 27, `currency: BRL` e `content_name` ("Kit Síndico Essencial" / "Kit Síndico Completo"). No GA4 vira `begin_checkout`.
- Parâmetros `utm_*`, `fbclid`, `gclid`, `ttclid`, `src`, `sck` e `xcod` são repassados ao link do checkout.
- Para conferir no navegador: `kitEvents` no console.
