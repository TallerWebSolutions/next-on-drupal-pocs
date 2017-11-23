# Criando um projeto

Criamos nosso projeto e inicializamos um pacote `package.json`:

```bash
  $ mkdir nextjs
  $ cd nextjs
  $ npm init -y
```

Em seguida, instalamos Next.js e as dependências do React e criamos um diretório de páginas:

```bash
  $ npm install --save next react react-dom
  $ mkdir pages
```

> pages - Next.js estende essa estrutura introduzindo um subdiretório de páginas onde seus componentes de nível superior vivem. Com isso ele faz o mapeamento das rotas.

No diretório `pages`, criamos um arquivo em `pages/index.js` com o seguinte conteúdo:

```javascript
  import React from 'react'
  import Link from 'next/link'
  import { setTimeout } from 'timers'

  class Home extends React.Component {
    static getInitialProps(ctx) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({ name: 'Taller' })
        }, 500)
      })
    }
    render() {
      return (
        <h1>{this.props.name}</h1>
      )
    }
  }

  export default Home
```
> getInitialProps - É uma ótima função para o nível superior dos componentes (page). Ele dá acesso a uma série de propriedades, como a solicitação e objetos de resposta e informações de URL, como o nome do caminho.

Nós também criamos um arquivo chamado `pages/about.js` contendo este código:

```javascript
  import React from 'react'

  const About = () => (
    <h2>About poc</h2>
  )

  export default About
```

Adicionamos um script para o servidor de desenvolvimento ao `package.json`:

```json
{
  "scripts": {
    "dev": "next",
    "build": "next build",
    "start": "next start"
  }
}
```

Nós executamos esse script para iniciar o servidor de desenvolvimento:

```bash
  $ npm run dev
```
