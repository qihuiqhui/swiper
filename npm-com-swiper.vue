<template>
  <div class="npm-com-swiper">
    <div id="slider">
      <ul class="swiper-item-container">
        <!-- <li class="swiper-item" v-for="(item, index) in dataArr" :key="index"><img :src="item.img" alt=""></li> -->
        <li class="swiper-item"><img src="./images/1.jpg" /></li>
        <li class="swiper-item"><img src="./images/2.jpg" /></li>
        <li class="swiper-item"><img src="./images/3.jpg" /></li>
        <li class="swiper-item"><img src="./images/menu1.png" /></li>
        <li class="swiper-item"><img src="./images/menu2.png" /></li>
        <li class="swiper-item"><img src="./images/menu3.png" /></li>
      </ul>
      <div class="swiper-button-prev"><</div>
      <div class="swiper-button-next">></div>
      <div class="indicator-container"></div>
    </div>
  </div>
</template>

<script>
  export default from './npm-com-swiper.js';
</script>

<style lang="sass" lang="scss" rel="stylesheet/scss">
  @import "./npm-com-swiper.scss";
</style>
