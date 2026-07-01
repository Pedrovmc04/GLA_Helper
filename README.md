# GLA Helper

Site estatico com ferramentas da comunidade para o jogo **Grand Line Adventures**,
no estilo do [Labophase](https://maniackrackjack.github.io/labophase/): navegacao
por sidebar, sistema de perfis e multi-idioma (pt-BR / en).

## Ferramentas disponiveis

- **Foxy Quiz** - treino de "Verdade ou Mentira" com modos Classico, Contra o
  Tempo, Pesquisa (gabarito) e Auto / Teste (relatorio em CSV/JSON).
- **Sistema de Boost** - guia de melhoria, aprimoramento e reforja, com
  calculadoras de custo em cristais e gemas e comparador de compra de gemas.

Mais ferramentas estao planejadas em [PLANEJAMENTO.md](PLANEJAMENTO.md).

## Rodar localmente

Como e um site estatico, basta abrir o `index.html` no navegador. Para evitar
qualquer restricao de `file://`, o ideal e servir por HTTP:

```powershell
# Python
python -m http.server 8000
# depois abra http://localhost:8000
```

```powershell
# Node (npx)
npx serve .
```

## Estrutura

```
index.html            # shell (topbar + sidebar + views)
assets/
  css/                # base, layout, components, features/
  js/
    app.js            # bootstrap
    core/             # storage, i18n, profiles, router
    features/         # quiz, boost
  data/               # questions.js, boost-tables.js
  i18n/               # pt-BR.js, en.js
  img/
PLANEJAMENTO.md
```

Detalhes da arquitetura em [PLANEJAMENTO.md](PLANEJAMENTO.md).

## Perfis

Cada perfil guarda separadamente (no `localStorage`) o recorde do quiz e os
precos do boost. Pelo botao de perfil (canto superior direito) e possivel criar,
editar, deletar, **exportar/importar** (JSON) e **compartilhar por link**.

## Idiomas

Portugues (pt-BR) e Ingles (en), alternaveis na topbar. Para adicionar um idioma,
crie `assets/i18n/<lang>.js` seguindo o formato dos arquivos existentes e um botao
correspondente na topbar.

## Deploy no GitHub Pages

1. Crie um repositorio no GitHub e envie o projeto:

   ```powershell
   git remote add origin https://github.com/<usuario>/<repo>.git
   git push -u origin main
   ```

2. No GitHub: **Settings -> Pages -> Build and deployment**.
   - Source: *Deploy from a branch*.
   - Branch: `main` / `/ (root)`.

3. O site fica em `https://<usuario>.github.io/<repo>/`.

## O que NAO faz parte deste repositorio

Por opcao (via `.gitignore`), duas pastas ficam apenas em disco:

- `SiteGLA/` - site antigo, mantido como referencia.
- `quiz-assistant/` - assistente OCR em Python, um projeto independente com seu
  proprio README e dados. Veja `quiz-assistant/README.md`.
