# Vik Burguer — Site

Site institucional/cardápio da Vik Burguer (Cotia-SP). Página única, estático (HTML/CSS/JS puro),
sem build — abre direto ou hospeda em qualquer serviço estático (GitHub Pages, Vercel, Netlify, etc).

## Rodar localmente

Qualquer servidor estático serve. Exemplos:

```bash
npx serve .
# ou
python -m http.server 8080
```

Depois abra `http://localhost:8080` (ou a porta usada). Abrir `index.html` direto como `file://`
também funciona, mas alguns navegadores bloqueiam o carregamento do vídeo/iframe do mapa nesse modo.

## Estrutura

```
index.html          página única
css/style.css        estilos (variáveis de cor no topo do arquivo)
js/main.js            animações (GSAP + ScrollTrigger + Lenis), tabs do cardápio, menu mobile
assets/logo.png       logo com fundo removido (transparente)
assets/menu/          fotos do cardápio
assets/video/         vídeo do Hero (desktop 1080p + mobile 480p) e posters
assets/CREDITS.md     fonte de cada imagem/vídeo placeholder usado
```

## ⚠️ Antes de publicar oficialmente

1. **Fotos do cardápio e vídeo do Hero são placeholders.** Foram baixados de bancos de imagem livres
   (Wikimedia Commons, ver `assets/CREDITS.md`) só para o site já nascer completo e vendável.
   Troque por fotos e um vídeo reais da Vik Burguer assim que possível — é o que mais vai
   aumentar a conversão e evita qualquer pendência de atribuição de licença. Basta substituir o
   arquivo mantendo o mesmo nome (ex.: `assets/menu/vik-bacon.jpg`) que o site atualiza sozinho.
2. **Confirme o número de WhatsApp** usado nos botões: `(11) 97297-4843` → `5511972974843`.
3. **Confira o pino do mapa** em "Localização" — o embed usa busca por endereço; se o Google não
   posicionar exatamente na fachada, gere um embed mais preciso em google.com/maps (Compartilhar →
   Incorporar mapa) e troque o `src` do `<iframe>`.
4. **Avaliação do Google**: o botão "Ver avaliações no Google" abre uma busca genérica pelo nome.
   Se tiverem o link direto do perfil do Google Meu Negócio, substitua a URL para ir direto às
   avaliações reais.

## Stack

HTML5 + CSS3 (custom properties, grid/flex) + JavaScript vanilla, com:
- **GSAP + ScrollTrigger** — animações de entrada, parallax, contador, scroll horizontal cinematográfico.
- **Lenis** — smooth scroll.

Sem framework, sem build step, sem dependências de PWA/service worker (removido a pedido do cliente).
