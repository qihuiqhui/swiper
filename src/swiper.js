class Swiper {
  constructor(options = {}) {
    this.options = Object.assign({
      swiper: 'swiper',
      item: '.swiper-name',
      autoplay: false,
      loop: false,
      duration: 3000,
      pagination: {
        el: '.indicator-container',
        type: 'bullets',
        clickable: false, // 是否允许点击切换
      },
    }, options);
    this.elements = {
      swiper: document.getElementById(this.options.swiper) || document.querySelector(this.options.swiper),
      items: document.querySelectorAll(this.options.item),
      swiper_item_width: document.querySelectorAll(this.options.item)[0].offsetWidth,
      swiper_item_container: document.getElementById(this.options.swiper).getElementsByClassName("swiper-item-container")[0] || null,
      pagination: this.options.pagination.el ? document.querySelector(this.options.pagination.el) : null,
    };
    // 一些状态
    this.states = {
      index: 0,           // 当前滑块的下标，从0开始
      touch: 0,           // 触摸状态 0：未触摸 1：手指触摸/鼠标按下
      autoplay: this.options.autoplay,
      touchTrack: {
        start: null,    // 手指触摸/鼠标按下时的位置
        old: null,      // 手指/鼠标上一次的位置
      },
      intervalId: null,
      autoplayId: null,
    };
    this.isTouch = 'ontouchstart' in window;
    if (!this.elements.swiper) {
      throw `${this.options.swiper} not found`;
    }
    // 初始化
    this.initElement();
    // 滑动
    this.touchEvent();
    // 是否是自动播放
    if (this.options.autoplay) {
      this.autoplay();
      this.elements.swiper.addEventListener('mouseover', () => {
        clearTimeout(this.states.autoplayId);
        this.states.autoplay = false;
      });
      this.elements.swiper.addEventListener('mouseout', () => {
        this.states.autoplay = true;
      });
    }
  }

  /**
   * 初始化样式
   */
  initElement () {
    if (this.elements.swiper_item_container === null) {
      this.elements.swiper_item_container = this.elements.swiper.children[0] || this.elements.swiper.firstChild;
    }
    if (this.options.loop) {
      let firstItem = this.elements.items[0].cloneNode(true);
      this.elements.swiper_item_container.appendChild(firstItem);
    }
    // 初始化分页是效果
    if (this.elements.pagination) {
      this.elements.pagination.innerHTML = '';
      let pageItem = this.elements.pagination;
      let itemNum = this.elements.items.length;
      let spanTemp = null;
      if (itemNum > 0) {
        // 判断是否是bullets 或者 fraction
        if (this.options.pagination.type === 'bullets') {
          for (var i = 0; i < itemNum; i++) {
            spanTemp = document.createElement('span');
            spanTemp.className = 'swiper-pagination-bullets';
            pageItem.appendChild(spanTemp);
          }
          this.elements.pagination.children[this.states.index].classList.add('active');
        } else {
          spanTemp = document.createElement('span');
          spanTemp.classList.add('swiper-pagination-fraction');
          spanTemp.innerHTML = `${this.states.index + 1} / ${itemNum}`;
          pageItem.appendChild(spanTemp);
        }
      }
    }
    // 初始化左右切换按钮
    this.navigationInit();
    // 事件委托
    this.eventBubble();
    // 分页使用，bullets添加的点击事件
    this.handeleClickable();
  }
  /**
   * 初始化左右切换按钮
   */
  navigationInit() {
    var _this = this;
    if (this.options.navigation) {
      let prevEl = document.querySelector(this.options.navigation.prevEl);
      let nextEl = document.querySelector(this.options.navigation.nextEl);
      prevEl.addEventListener("click", function () {
        _this.prev();
      });
      nextEl.addEventListener("click", function () {
        _this.next();
      });
    }
  }
  /**
   * 分页使用，bullets添加的点击事件
   */
  handeleClickable () {
    if (!this.elements.pagination) {
      return;
    }
    if (!this.options.pagination.clickable) {
      return;
    }
    var _this = this;
    let lis = this.elements.pagination.children;
    for (var i = 0; i < lis.length; i++) {
      lis[i].setAttribute("index", i);
      lis[i].addEventListener("click", function() {
        let index = parseInt(this.getAttribute("index"));
        _this.next(index);
      });
    }
  }
  /**
   * 事件委托eventBubble 点击触发事件
   */
  eventBubble () {
    let element = this.elements.swiper_item_container;
    let li = element.children;
    let indexActive = 0;
    let _this = this;
    for(var i = 0, l = li.length; i < l; i++) {
      li[i].setAttribute("index", i);
      li[i].addEventListener("click", function() {
        let index = parseInt(this.getAttribute("index"));
        if (_this.options.loop) {
          if (index === (li.length -1)) {
            indexActive = 0
          } else {
            indexActive = index;
          }
        } else {
          indexActive = index;
        }
        _this.handleClick(indexActive);
      });
    }
  }
  handleClick (index) {
    this.options.onClickTo.bind(this)(index);
  }
  /**
   * 自动播放
   */
  autoplay() {
    if (this.states.autoplayId) {
      clearTimeout(this.states.autoplayId);
    }
    // 设置一个定时器
    this.states.autoplayId = setTimeout(() => {
      if (!this.states.autoplay) return;
      this.next();
    }, this.options.duration);
  }
  /**
   * 下一个
   * @param {*} nextIndex 
   */
  next(nextIndex) {
    let element = this.elements.swiper_item_container;
    let li = element.children;
    if ((nextIndex != null) && (typeof(nextIndex) != "undefined")) {
      this.states.index = nextIndex;
    } else {
      this.states.index = this.states.index + 1;
      // 循环轮播
      if (this.options.loop) {
        if (this.states.index > (li.length-1)) {
          element.style.left = 0 + "px";
          this.states.index = 1;
        }
      } else {
        if (this.states.index > (li.length-1)) {
          this.states.index = li.length - 1;
        }
      }
    }
    this.animate(element, -(this.states.index*this.elements.swiper_item_width));
  }
  /**
   * 上一个
   */
  prev() {
    let element = this.elements.swiper_item_container;
    let li = element.children;
    this.states.index = this.states.index - 1;
    if (this.options.loop) {
      if (this.states.index < 0) {
        element.style.left = -((li.length-1)*this.elements.swiper_item_width) + "px";
        this.states.index = li.length - 2;
      }
    } else {
      if (this.states.index < 0) {
        this.states.index = 0
      }
    }
    this.animate(element, -(this.states.index*this.elements.swiper_item_width));
  }
  /**
   * 切换动画
   * @param {*} element 
   * @param {*} target 
   */
  animate(element, target) {
    var step = 10;
    var time = 10;
    var gap = (Math.abs(target - element.offsetLeft) / this.elements.swiper_item_width);
    if (gap > 1) {
      step = step * gap;
      time = time / gap;
    }
    if (element) {
      step = (element.offsetLeft > target) ? -step : step;
      clearInterval(this.states.intervalId);
      this.states.intervalId = setInterval(() => {
        if ((step < 0) && (Math.abs(element.offsetLeft + step) < Math.abs(target))) {
          element.style.left = element.offsetLeft + step + "px";
        } else {
          if (Math.abs(target - element.offsetLeft) > Math.abs(step)) {
            element.style.left = element.offsetLeft + step + "px";
          } else {
            clearInterval(this.states.intervalId);
            this.states.intervalId = null;
            element.style.left = target + "px";
            if (this.states.autoplay) {
              this.autoplay();
            }
          }
        }
      }, time);
    }
    // 触发change事件切换事件
    this.getChangeHandle();
    // 分页
    this.getPagination();
  }
  /**
   * 触发change事件切换事件
   */
  getChangeHandle () {
    let element = this.elements.swiper_item_container;
    let li = element.children;
    let index = 0;
    if (this.states.index === (li.length-1)) {
      index = 0;
    } else {
      index = this.states.index;
    }
    this.options.change.bind(this)(index);
  }
  /**
   * 获取分页，判断是否是bullets 或者 fraction
   */
  getPagination() {
    if (!this.elements.pagination) {
      return;
    }
    let index = 0;
    // 判断是否是bullets
    if (this.options.pagination.type === 'bullets') {
      if (this.elements.pagination.children.length > 0) {
        for (var j = 0; j < this.elements.pagination.children.length; j++) {
          this.elements.pagination.children[j].classList.remove('active');
        }
      }
      if (this.states.index === this.elements.pagination.children.length) {
        index = 0;
      } else {
        index = this.states.index;
      }
      this.elements.pagination.children[index].classList.add('active');
    } else { // fraction
      if (this.states.index + 1 > this.elements.items.length) {
        index = 1;
      } else {
        index = this.states.index + 1;
      }
      this.elements.pagination.children[0].innerHTML = `${index} / ${this.elements.items.length}`;
    }
  }
  /**
   * 监听触摸事件
   */
  touchEvent() {
    if (this.isTouch) {
      this.elements.swiper_item_container.addEventListener('touchstart', () => this.touchStart(event));
      this.elements.swiper_item_container.addEventListener('touchmove', () => this.touchMove(event));
      this.elements.swiper_item_container.addEventListener('touchend', () => this.touchEnd(event));
    } else {
      this.elements.swiper_item_container.addEventListener('mousedown', () => this.touchStart(event));
      this.elements.swiper_item_container.addEventListener('mousemove', () => this.touchMove(event));
      this.elements.swiper_item_container.addEventListener('mouseup', () => this.touchEnd(event));
    }
  }
  touchStart(event) {
    // 阻止浏览器默认的拖拽行为
    // event.preventDefault();
    this.states.touch = 1;
    this.states.autoplay = false;
    this.states.touchTrack.start = this.states.touchTrack.old = event.touches ? event.touches[0] : event;
  }
  touchMove(event) {
    // 必须是手指/鼠标按下了才允许移动
    if (this.states.touch != 1) return;
    // 阻止浏览器默认的拖拽行为
    // event.preventDefault();
    // 触摸和鼠标事件event不一样，要区分开来。
    event = event.touches ? event.touches[0] : event;
    this.states.touchTrack.old = event;
  }
  touchEnd(event) {
    // 移除触摸状态
    this.states.touch = 0;
    if (this.states.autoplay) {
      this.states.autoplay = true;
    }
    event = event.changedTouches ? event.changedTouches[0] : event;

    if (event.pageX < this.states.touchTrack.start.pageX) {
      this.next();
    } else if (event.pageX === this.states.touchTrack.start.pageX) {
      // 防止触发
    } else {
      this.prev();
    }
  }
}

export default Swiper;
