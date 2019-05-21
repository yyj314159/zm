<template>
  <div class="sortPage" :style="{height:HeightW}">
    <div id="Shead" v-if="sortStu">
      <img src="../../common/images/gobackpng.png" @click="goBack">
      <div id="searchBox">
        <img src="../../common/images/searchIcon.png" alt>
        <input type="text" v-model="searchStr" placeholder="搜索">
      </div>
    </div>
    <div id="Shead" v-else>
      <img src="../../common/images/gobackpng.png" @click="goBack">
      <div id="searchBox1">
        <img src="../../common/images/searchIcon.png" alt>
        <input type="text" ref="boxFoc" v-model="searchStr" placeholder="搜索">
      </div>
      <div style="color: #3C9BE5;" @click="sortData">搜索</div>
    </div>
    <div id="DownBox" v-show="sortStu">
      <p id="DropT">请选择类别</p>
      <ul>
        <li :key="n" v-for="(route,n) in searchRoutes" @click="search(route.route)">
          <span>{{route.name}}</span>
          <img src="../../common/images/public/arrow.png">
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { setTimeout, clearTimeout } from "timers";
export default {
  name: "sortPage",
  data() {
    return {
      // 屏幕动态高度
      HeightW:'',
      // 搜索框判断值
      sortStu: false,
      // 搜索数据
      searchStr: "",
      // 搜索下拉框数据
      searchRoutes: [
        { route: "/searchResult?searchType=P", name: "产品" },
        { route: "/searchResult?searchType=S", name: "服务" },
        // { route: "/searchResult?searchType=V", name: "视频" },
        { route: "/searchResult?searchType=AUDIO", name: "音频" },
        { route: "/searchResult?searchType=ALBUM", name: "专辑" },
        { route: "/searchResult?searchType=CREATOR", name: "创作人" },
        { route: "/searchResult?searchType=N", name: "新闻" },
        { route: "/searchResult?searchType=B", name: "博客" }
      ],
      // 搜索传过去的参数
      searchStr: ""
    };
  },
  mounted() {
    // 初始加载页面清除数据
    console.log(this.$store.state.Logon)
    let that = this;
    clearTimeout(fouce)
    that.$nextTick(() => {
      //根据不同手机设置不同高度
      let phoneHeight = window.innerHeight;
      this.HeightW= phoneHeight+'px';
    });
    that.searchStr = "";
    // 初始输入框聚焦
    let fouce = setTimeout(function() {
      that.$refs.boxFoc.focus();
    }, 600);
  },
  methods: {
    sortData() {
      this.sortStu = true;
    },
    goBack() {
      this.$router.go(-1);
    },
    search(route){
      if(this.searchStr)this.$router.push({ path: route, query:{keyWord:this.searchStr}});      
    }
  }
};
</script>

<style lang="scss" scoped>
.sortPage {
  width: 100%;
  position: relative;
  #Shead {
    width: 100%;
    height: 46px;
    background-color: white;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 4px;
    box-sizing: border-box;
    border-bottom: 1px solid #f2f2f2;
    img {
      display: inline-block;
      width: 14px;
      height: auto;
    }
    #searchBox {
      background: #f2f2f2;
      padding-left: 6px;
      height: 26px;
      border-radius: 13px;
      display: flex;
      align-items: center;
      color: #cccccc;
      width: 280px;
      img {
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: 8px;
      }
      input {
        width: 240px;
        background: #f2f2f2;
        outline: none;
      }
    }
    #searchBox1 {
      width: 240px;
      background: #f2f2f2;
      padding-left: 6px;
      height: 26px;
      border-radius: 13px;
      display: flex;
      align-items: center;
      color: #cccccc;
      img {
        display: inline-block;
        width: 12px;
        height: auto;
        margin-right: 8px;
      }
      input {
        width: 200px;
        background: #f2f2f2;
        outline: none;
      }
    }
  }

  #DownBox {
    width: 100%;
    background-color: #f2f2f2;
    height: 240px;
    position: absolute;
    top: 46px;
    #DropT {
      width: 70px;
      height: 24px;
      line-height: 24px;
    }
    ul {
      width: 100%;
      background-color: white;
      li {
        width: 100%;
        height: 30px;
        box-sizing: border-box;
        padding: 0 8px;
        line-height: 30px;
        border-bottom: 1px solid #f2f2f2;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
}
</style>
