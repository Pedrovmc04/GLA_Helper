# GLA Helper - Planejamento

Documento de planejamento do projeto **GLA Helper**: um site estatico de
ferramentas para o jogo *Grand Line Adventures*, no estilo do site de referencia
[Labophase](https://maniackrackjack.github.io/labophase/) (sidebar, perfis e
multi-idioma).

## Visao geral

- **Objetivo:** reunir ferramentas uteis (comecando por Foxy Quiz e Sistema de
  Boost) em um unico site organizado, com navegacao por sidebar, sistema de
  perfis e suporte a varios idiomas.
- **Stack:** HTML + CSS + JavaScript vanilla (sem build). Deploy simples no
  GitHub Pages.
- **Persistencia:** `localStorage`, separada por perfil.

## Decisoes

- Site estatico vanilla (sem framework / sem bundler).
- Nesta fase, apenas as features existentes foram migradas (Foxy Quiz e Sistema
  de Boost), ja dentro do novo layout com sidebar, perfis e i18n.
- O **assistente OCR** (Python) virou um projeto independente em
  `quiz-assistant/`, com sua propria copia de dados, e nao e versionado.
- `SiteGLA/` (site antigo) e `quiz-assistant/` estao no `.gitignore` (mantidos em
  disco apenas como referencia / uso local).
- i18n inicial: `pt-BR` (padrao) + `en`. A estrutura aceita novos idiomas (es,
  pl) adicionando um arquivo em `assets/i18n/`.

## Estrutura de pastas

```
GLA_Helper/
  index.html               # shell do SPA (topbar + sidebar + views)
  assets/
    css/
      base.css             # variaveis, reset, fundo
      layout.css           # topbar, sidebar, conteudo, responsivo
      components.css       # botoes, forms, tabelas, modal, cards
      features/
        quiz.css
        boost.css
    js/
      app.js               # bootstrap (idioma, perfis, sidebar, router)
      core/
        storage.js         # localStorage + event bus
        i18n.js            # traducao (data-i18n + t())
        profiles.js        # perfis, dados por perfil, export/import/link
        router.js          # roteador por hash com init preguicoso
      features/
        quiz.js            # Foxy Quiz
        boost.js           # Sistema de Boost
    data/
      questions.js         # banco do Foxy Quiz
      boost-tables.js      # tabelas do Sistema de Boost
    i18n/
      pt-BR.js
      en.js
    img/
  PLANEJAMENTO.md
  README.md
  .gitignore
  SiteGLA/                 # site antigo (ignorado, referencia)
  quiz-assistant/          # assistente OCR (ignorado, projeto independente)
```

## Arquitetura

- **Shell:** uma unica pagina (`index.html`) com topbar (marca, idioma, perfil),
  sidebar de navegacao e uma area de conteudo com varias `views`.
- **Router (hash):** cada secao e uma `view` (`#/home`, `#/quiz`, `#/boost`). O
  router mostra/oculta as views e inicializa a feature na primeira vez que ela e
  aberta (lazy init).
- **Features:** cada feature registra-se no router com um `init()`. Foxy Quiz e
  Boost foram portados dos scripts originais para modulos que rodam dentro da
  sua view.
- **Perfis:** o perfil ativo guarda dados proprios em `localStorage`
  (`gla.pdata.<id>`). O recorde do quiz e os precos do boost sao salvos por
  perfil. Ha exportar/importar (JSON) e compartilhar via link (`?p=` em base64).
- **i18n:** elementos com `data-i18n` sao traduzidos; textos dinamicos usam
  `GLA.i18n.t()`.

## Etapas

### Etapa 0 - Setup (concluida)
- [x] `git init` na raiz.
- [x] `.gitignore` ignorando `SiteGLA/`, `quiz-assistant/`, `__pycache__/` etc.
- [x] Estrutura de pastas `assets/{css,js,data,i18n,img}`.

### Etapa 1 - Assistente independente (concluida)
- [x] Mover `SiteGLA/assistant/` para `quiz-assistant/`.
- [x] Copia propria dos dados em `quiz-assistant/data/questions.js`.
- [x] `build_db.py` passa a ler `data/questions.js` (independente do site).
- [x] README do assistente atualizado com os novos caminhos.

### Etapa 2 - App shell (concluida)
- [x] `index.html` com topbar + sidebar + views.
- [x] `base.css`, `layout.css`, `components.css` (tema nautico, responsivo,
  sidebar recolhivel no mobile).

### Etapa 3 - Core (concluida)
- [x] `storage.js` (localStorage + event bus).
- [x] `i18n.js` (pt-BR + en).
- [x] `profiles.js` (perfis, dados por perfil, export/import/link).
- [x] `router.js` (hash router com lazy init).

### Etapa 4 - Foxy Quiz (concluida)
- [x] Markup das telas na view `#/quiz`.
- [x] `quiz.js` modular com `init()`.
- [x] `quiz.css`.
- [x] Recorde salvo por perfil; textos dinamicos via i18n.

### Etapa 5 - Sistema de Boost (concluida)
- [x] Markup e tabelas na view `#/boost`.
- [x] `boost.js` modular com `init()`.
- [x] `boost.css`.
- [x] Precos dos materiais e moeda salvos por perfil.

### Etapa 6 - Documentacao e deploy (concluida)
- [x] `PLANEJAMENTO.md` (este arquivo).
- [x] `README.md` (rodar local + deploy GitHub Pages).
- [x] Commit inicial.

## Roadmap (features futuras, inspiradas no Labophase)

Cada item novo entra como uma `view` propria + um modulo em
`assets/js/features/` + um item na sidebar. Prioridade sugerida:

1. **Calculadora de XP** - pocoes necessarias por nivel/tier.
2. **Planejador de Barcos** - arsenal, skins, materiais e custo em berries.
3. **Wanted Pirates** - match-ups e pool de counters.
4. **Tracker Semanal** - Boss Rush, Marineford, eventos Foxy, One Man Army.
5. **Bau Semanal** - rotacao de baus por semana.
6. **Tierlist** - montagem e compartilhamento de tierlists.
7. **Personagens** - lista com nivel/estrelas/tier e filtros.
8. **World / Weekly Bosses** e **Marineford** - fases, habilidades e recompensas.
9. **Island Chests** - baus por ilha.
10. **Links Uteis** - links oficiais e da comunidade.

### Melhorias transversais (quando fizer sentido)
- Adicionar idiomas `es` e `pl` (novos arquivos em `assets/i18n/`).
- Traduzir tambem o conteudo textual do Sistema de Boost (hoje em pt-BR).
- Icones/artes proprias em `assets/img/`.
- Cache/versionamento de assets para o deploy.
