import { getEles, getTouch } from './utils';

const defaultProps = {
  selector: '*'
};

const getProps = (props = '*') => {
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
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

    this.init(props);
  }

  props = {};

  eles = [];
  list = [];
  startY = 0;

  onTouchStart(event) {
    const touch = getTouch(event);
    const { pageY = 0 } = touch;
    const { currentTarget = {} } = event;

    this.startY = pageY;
    this.list.push(currentTarget);
  }

  onTouchMove(event) {
    const res = this._shouldScroll(event);

    !res && event.preventDefault();
  }

  onTouchEnd(event) {
    this.list = []; 
  }

  _shouldScroll(event) {
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

  on() {
    const { eles = [] } = this;

    eles.forEach((ele = {}) => {
      ele.addEventListener('touchstart', this.onTouchStart);
      ele.addEventListener('touchmove', this.onTouchMove);
      ele.addEventListener('touchend', this.onTouchEnd);
    });
  }

  off() {
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

  refresh() {
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

    this.setProps(props);
  }
}

const fondle = (props) => {
  return new Fondle(props);
}

export { Fondle };

export default fondle;
