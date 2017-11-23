# Introduction

## Next.js
It is a framework for react applications that does server-side rendering by default, among many other performance optimizations such as:
 - Automatic code splitting for faster page loads.
 - Webpack-based development environment that supports Hot Module Replacement (HMR)
 - Able to deploy with Express or any other Node.js HTTP server
 - Customizable with your own Babel and Webpack settings

Today everyone is familiar with the concept of JavaScript fatigue. Creating a web application with JavaScript is usually difficult with all the packages and options we have. React, webpack, Redux, React-router and many more libraries and tools are often used and require effort to learn.

With Next.js, we enable developers to build JavaScript web applications with more direct workflow. Just create some files that export React components and deploy your application.

## How Next.js works?
We created our project and started a package `package.json`:
```bash
  $ mkdir nextjs
  $ cd nextjs
  $ npm init -y
```
Next, we installed Next.js and the React dependencies and created a directory of pages:
```bash
  $ npm install --save next react react-dom
  $ mkdir pages
```
> pages - Next.js extends this structure by introducing a subdirectory of pages where its top-level components live. With this it does the mapping of the routes.

In the `pages` directory, we created a file in` pages/index.js` with the following content:
```javascript
  import React from 'react'
  import Link from 'next/link'
  import { setTimeout } from 'timers';

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
> getInitialProps - It is a great function for the top level of the components (page). It gives access to a number of properties, such as request and response objects, and URL information, such as the path name.

We also created a file called `pages/about.js` containing this code:
```javascript
  import React from 'react'

  const About = () => (
    <h2>About poc</h2>
  )

  export default About
```
We added a script for the development server to `package.json`:
```json
  "scripts": {
    "dev": "next",
    "build": "next build",
    "start": "next start"
  }
```
We run this script to start the development server:
```bash
  $ npm run dev
```
