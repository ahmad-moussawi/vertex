# Vertex
Powerful JSX View Engine 😎

# Getting Started
Vertex let you write your views using the JSX syntax, it will compile them to Hyperscript, and then they will get rendered by [vhtml](https://github.com/developit/vhtml)

## Installation
```shell
npm install --save vertex vhtml
```

## Usage
Create the needed views

- `views/index.jsx`

```jsx
const Header = include('header.jsx');
const Footer = include('footer.jsx');

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


```js
const Vertex = require('Vertex');

const viewLocation = __dirname + '/views';
const cacheLocation = __dirname + '/cache';

const v = new Vertex(viewLocation, cacheLocation);

const html = v.render('index.jsx', {message: 'Hello Vertex'});

```

output:
```html
<div>
    <div class="header">Header</div>
    <div>Hello Vertex</div>
    <div class="footer">Footer</div>
</div>
```