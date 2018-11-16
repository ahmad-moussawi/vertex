# Vertex 👓
Powerful JSX View Engine

**How it works:**
Vertex compiles and caches your JSX views to Hyperscript so they will get easily rendered to HTML using [vhtml](https://github.com/developit/vhtml).

Vertex will compile your views only when needed, giving you the performance boost.

You can use the **include** directive to include partials views

# Getting Started

## Installation
```shell
npm install --save vertex vhtml
```

## Usage
Create the needed views

- `views/index.jsx`

```jsx
const Header = include('header');
const Footer = include('footer');

module.exports = (props) => <div>
    <Header/>
    <div>{{ props.message }}</div>
    <Footer/>
</div>
```

- `views/header.jsx`

```jsx
module.exports = (props) => <div class="header">Header</div>
```

- `views/footer.jsx`

```jsx
module.exports = (props) => <div class="footer">Footer</div>
```

 - `index.js`

```js
const Vertex = require('Vertex');

const viewLocation = __dirname + '/views';
const cacheLocation = __dirname + '/cache';

const v = new Vertex(viewLocation, cacheLocation);

const html = v.render('index', {message: 'Hello Vertex'});

```

output:
```html
<div>
    <div class="header">Header</div>
    <div>Hello Vertex</div>
    <div class="footer">Footer</div>
</div>
```