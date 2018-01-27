import { getEles, getTouch } from './utils';

const defaultProps = {
  selector: '',
};

const getProps = (props) => {
  if (!props) {
    return defaultProps;
  }

  if (typeof props === 'string') {
    return { selector: props };
  }

  return Object.assign({}, defaultProps, props);
};

class Fondle {
  constructor(props) {
    this.init(props);
  }

  props = {};

  eles = [];
  list = [];
  startY = 0;

  onTouchStart = (event) => {
    const touch = getTouch(event);
    const { pageY = 0 } = touch;
    const { currentTarget = {} } = event;

    this.startY = pageY;
    this.list.push(currentTarget);
  }

  onTouchMove = (event) => {
    const res = this._shouldScroll(event);

    !res && event.preventDefault();
  }

  onTouchEnd = (event) => {
    this.list = []; 
  }

  _shouldScroll = (event) => {
    const { list = [], startY = 0 } = this;

    const touch = getTouch(event);
    const { pageY = 0 } = touch;

    return list.some((item = {}) => {
      const { scrollTop = 0, scrollHeight = 0, clientHeight = 0 } = item;
      const maxScrollTop = scrollHeight - clientHeight;

      if (startY < pageY) {
        return scrollTop > 0;
      }

      if (startY > pageY) {
        return maxScrollTop > scrollTop;
      }

      return maxScrollTop > 0;
    });
  }

  on = () => {
    const { eles = [] } = this;

    eles.forEach((ele = {}) => {
      ele.addEventListener('touchstart', this.onTouchStart);
      ele.addEventListener('touchmove', this.onTouchMove);
      ele.addEventListener('touchend', this.onTouchEnd);
    });
  }

  off = () => {
    const { eles = [] } = this;

    eles.forEach((ele = {}) => {
      ele.removeEventListener('touchstart', this.onTouchStart);
      ele.removeEventListener('touchmove', this.onTouchMove);
      ele.removeEventListener('touchend', this.onTouchEnd);
    });
  }

  setProps(nextProps = {}) {
    const { props = {} } = this;

    this.resetProps(
      Object.assign({}, props, getProps(nextProps))
    );
  }

  resetProps(nextProps = {}) {
    this.props = getProps(nextProps);
    this.refresh();
  }

  refresh = () => {
    const { props = {} } = this;
    const { selector } = props;

    this.eles = getEles(selector);

    this.off();
    this.on();
  }

  init(props) {
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      return null;
    }

    if (!('ontouchstart' in document.documentElement)) {
      return null;
    }

    props = getProps(props);

    const { selector } = props;

    if (!selector) {
      return console.warn('A container selector is necessary, this container show have scrollbar and 100% height to cover the screen');
    }

    this.setProps(props);
  }
}

const fondle = (props) => {
  return new Fondle(props);
}

export { Fondle };

export default fondle;
