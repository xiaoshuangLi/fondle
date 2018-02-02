# fondle
Prevent mobile browser page scroll when touch.(Just like: Wechat, Safari ...);

[Demo](https://codepen.io/xiaoshuang/pen/KZOgpW)

## Installation

```sh
npm install --save fondle
```

## How to Use

### app.scss

The container need have scrollbar and high enough to cover the screen.

```scss
#container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw; 
  height: 100vh;
  overflow: auto;
}
```

### app.js

### For React
```jsx
import React, { Component } from 'react';

import fondle from 'fondle';

let entity;

class Container extends Component {
  componentDidMount() {
    entity = fondle('#container');
  }

  componentDidUpdate() {
    entity.refresh();
  }

  componentWillUnmount() {
    entity.off();
  }

  render () {
    return (
      <div id="container">
        <div className="content">
          { ... }
        </div>
      </div>
    );
  }
}
```

### For Classic

Something you should know about [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver).

```js
import fondle, { getEle, createObserver } from 'fondle';

const dom = getEle('#container');
const entity = fondle('#container');

const observer = createObserver(entity.refresh);
const observerOff = createObserver((list = []) => {
  const beenRemoved = list.some((item = {}) => {
    const { removedNodes = [] } = item;

    return Array.from(removedNodes).some(
      curr => curr === dom
    );
  });

  beenRemoved && entity.off();
});

observer.observe(dom, {
  childList: true,
  subtree: true,
});

observerOff.observe(document.body, {
  childList: true,
  subtree: true,
});

```

```html
<html>
  <head>
    ...
  </head>
  <body>
    <div id="container">
      <div class="content">
        ...
      </div>
    </div>
  </body>
</html>
```


