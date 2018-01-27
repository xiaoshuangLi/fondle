export function getEles(selector = '') {
  if (!selector) {
    return [];
  }

  if (selector instanceof HTMLElement) {
    return [selector];
  }

  return document.querySelectorAll(selector);
};

export function getEle(selector = '') {
  if (!selector) {
    return [];
  }

  if (selector instanceof HTMLElement) {
    return selector;
  }

  return document.querySelector(selector);
};

export function getTouch(event = {}) {
  if (!event) {
    return {};
  }
  
  const { touches = [] } = event;
  const [touch = {}] = touches;

  return touch;
};

export function createObserver(cb) {
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
  const observer = new MutationObserver(cb);

  return observer;
};