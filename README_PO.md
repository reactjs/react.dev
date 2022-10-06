# reactjs.org

Este repositório contém o código-fonte e a documentação do [reactjs.org](https://reactjs.org/).

## Começando

### Pré-requisitos

1. Git
1. Nó: qualquer versão 12.x começando com v12.0.0 ou superior
1. Yarn v1: consulte [site do Yarn para instruções de instalação](https://yarnpkg.com/lang/en/docs/install/)
1. Um fork do repo (para quaisquer contribuições)
1. Um clone do [reactjs.org repo](https://github.com/reactjs/reactjs.org) em sua máquina local

### Instalação

1. `cd reactjs.org` para ir para a raiz do projeto
1. `yarn` para instalar as dependências npm do site

### Executando localmente

1. `yarn dev` para iniciar o servidor de desenvolvimento hot-reloading (alimentado por [Gatsby](https://www.gatsbyjs.org))
1. `abra http://localhost:8000` para abrir o site em seu navegador favorito

## Contribuindo


### Diretrizes

A documentação é dividida em várias seções com um tom e finalidade diferentes. Se você planeja escrever mais do que algumas frases, pode ser útil se familiarizar com as [diretrizes de contribuição](https://github.com/reactjs/reactjs.org/blob/main/CONTRIBUTING.md#guidelines- for-text) para as seções apropriadas.

### Criar uma ramificação

1. `git checkout main` de qualquer pasta em seu repositório local `reactjs.org`
1. `git pull origin main` para garantir que você tenha o código principal mais recente
1. `git checkout -b the-name-of-my-branch` (substituindo `the-name-of-my-branch` por um nome adequado) para criar uma ramificação

### Fazer a mudança

1. Siga as instruções ["Executando localmente"](#running-locally)
1. Salve os arquivos e verifique no navegador
  1. Alterações nos componentes React em `src` serão recarregadas a quente
  1. As alterações nos arquivos de remarcação em `conteúdo` serão recarregadas a quente
  1. Se estiver trabalhando com plugins, pode ser necessário remover o diretório `.cache` e reiniciar o servidor

### Teste a mudança

1. Se possível, teste todas as alterações visuais em todas as versões mais recentes de navegadores comuns, tanto no desktop quanto no celular.
1. Execute o `yarn check-all` na raiz do projeto. (Isso executará Prettier, ESLint e Flow.)

### Empurre-o

1. `git add -A && git commit -m "My message"` (substituindo `My message` por uma mensagem de commit, como `Fix header logo on Android`) para preparar e confirmar suas alterações
1. `git push my-fork-name the-name-of-my-branch`
1. Vá para o [reactjs.org repo](https://github.com/reactjs/reactjs.org) e você deverá ver branches enviados recentemente.
1. Siga as instruções do GitHub.
1. Se possível, inclua capturas de tela das alterações visuais. Uma compilação de visualização é acionada depois que suas alterações são enviadas para o GitHub.

## Tradução

Se você estiver interessado em traduzir o `reactjs.org`, consulte os esforços de tradução atuais em [translations.reactjs.org](https://translations.reactjs.org/).


Se seu idioma não tiver uma tradução e você quiser criar uma, siga as instruções em [reactjs.org Translations](https://github.com/reactjs/reactjs.org-translation#translating-reactjsorg).

## Solução de problemas

- `yarn reset` para limpar o cache local

## Licença
O conteúdo enviado para [reactjs.org](https://reactjs.org/) é licenciado CC-BY-4.0, conforme encontrado em [LICENSE-DOCS.md](https://github.com/open-source- explorer/reactjs.org/blob/master/LICENSE-DOCS.md).