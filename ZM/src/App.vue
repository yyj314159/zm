<template>
  <div id="app">
    <transition :name="transitionName">
      <keep-alive :include="cache">
        <router-view class="transitionBody"></router-view>
      </keep-alive>
    </transition>

  </div>
</template>
<script>
import './common/css/public.styl'
export default {
  data() {
   return {
        apiType:process.env.NODE_ENV,
        defaultUrl:process.env.VUE_APP_BASE_API,
      // 起始默认动画滑动方向
        transitionName: 'transitionLeft',
        cache:/Main/    //需要被缓存的组件
      };
 },
// 路由监听并判断动画效果
 watch: {
  '$route' (to, from) { 
     const arr = ['/Main','/sortPage','/webShow','/webAdv','/webTem','/showTem','/product','/service','/video','/audio','/website','/information','/searchIndex','/searchResult'];
     const compare = arr.indexOf(to.path)>arr.indexOf(from.path);
     this.transitionName = compare ? 'transitionLeft' : 'transitionRight';
  } 
 }
}
</script>
<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 12px;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
// 动画效果
.transitionBody{
 transition: all .3s ease-in-out; /*定义动画的时间和过渡效果*/
}
 //右滑动画
.transitionLeft-enter,
.transitionRight-leave-active {
  -webkit-transform: translateX(100%);
  transform: translateX(100%); 
}
 //左滑动画
 .transitionRight-enter,
.transitionLeft-leave-active {
  -webkit-transform: translateX(-100%); 
  transform: translateX(-100%); 
}

</style>
