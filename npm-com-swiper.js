import Swiper from './swiper.js';
import jump from 'npm-js-jump';

export default {
  data() {
    return {
      msg: '',
      dataArr: [
        {
          name: '1',
          img: 'https://ysx-pic.oss-cn-beijing.aliyuncs.com/2021/0104share.png',
        },
        {
          name: '2',
          img: 'https://ysx-pic.oss-cn-beijing.aliyuncs.com/2021/0128share.png',
        },
        {
          name: '3',
          img: 'https://ysx-pic.oss-cn-beijing.aliyuncs.com/2021/0208share.png',
        },
        {
          name: '4',
          img: 'https://ysx-pic.oss-cn-beijing.aliyuncs.com/2021/15-31.png',
        },
        {
          name: '5',
          img: 'https://ysx-pic.oss-cn-beijing.aliyuncs.com/2021/2.26-2.28.png',
        }
      ]
    };
  },

  computed: {},
  created() {
  },
  mounted() {
    let _this = this;
    new Swiper({
      swiper: 'slider',
      item: '.swiper-item',
      autoplay: false,
      loop: false,
      duration: 3000,
      change(index) { // 切换时候使用，获取当前切换的index;
        console.log(index);
      },
      onClickTo(index) { // loop: true,添加绑定事件,必须使用onClickTo; false:可以使用@click & onClickTo;
        _this.goTo(index)
      },
      pagination: { // 分页使用，bullets, fraction两种模式;
        el: '.indicator-container',
        type: 'bullets',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  },
  beforeDestroy() {
  },
  methods: {
    goTo(index) {
      if (index === 0) {
        jump.to({
          url: 'https://www.swiper.com.cn/api/navigation/209.html',
          router: this.$router,
        });
      } else {
        jump.to({
          url: 'https://www.baidu.com/',
          router: this.$router,
        });
      }
    },
  },
  filters: {},
  watch: {},
}
