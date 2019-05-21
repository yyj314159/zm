<template>
  <div id="musicAudio">
    <!-- <h1></h1> -->
    <!-- 顶部搜索框 开始-->
    <div class="search">
      <search-input
        :placeholder="placeholderList[initialIndex]"
        :searchTypef="searchTypeList[initialIndex]"
        @on-focus='handleFocus'
        :navList='navLists'
        style="z-index:9999;position:inherit"
      >
        <!--搜索框左边文字-->
        <span
          slot="before"
         
        >找音频</span>

      </search-input>
    </div>
    <!-- 顶部搜索框 结束 -->

    <div class="musicBox">
      <!-- 顶部tab切换 开始-->
      <cube-tab-bar
        v-model="selectedLabel"
        show-slider
        :use-transition="true"
        ref="tabNav"
        :data="tabLabels"
        inline
      >
        <cube-tab v-for="(item, index) in tabLabels" :label="item.label" :key="index">
          <i slot="icon" :class="item.icon" class="iconFont"></i>
        </cube-tab>
      </cube-tab-bar>
      <!-- 顶部tab切换 结束 -->
      <!-- 主体组件部分 开始 -->
      <div class="container">
        <cube-slide
          ref="slide"
          :loop="false"
          :showDots="false"
          :auto-play="false"
          :initial-index="initialIndex"
          @change="changePage"
        >
          <cube-slide-item>
            <!-- 音频组件容器 -->
            <music></music>
          </cube-slide-item>
          <cube-slide-item>
            <!-- 专辑部分 -->
            <zhuanji></zhuanji>
          </cube-slide-item>
          <cube-slide-item>
            <!-- 创作人部分 -->
            <creator></creator>
          </cube-slide-item>
        </cube-slide>
      </div>
    </div>
  </div>
</template>
<script>
import { TabBar, Slide, Scroll } from "cube-ui";
import SearchInput from "components/public/commonsearch.vue"; //引入搜索组件
import music from "./music"; //引入音频组件
import zhuanji from "./zhuanji"; //引入专辑组件
import creator from "./creator"; //引入创作人组件
const yinpinData = [
  { level1: "收费类型", level2: ["免费", "付费", "免费", "免费", "免费"] },
  { level1: "视频类目", level2: ["免费sf", "付费dfd"] }
];

const placeholderList = ["搜音频", "搜专辑", "搜创作人"];
const searchTypeList = ["AUDIO", "ALBUM", "CREATOR"];//搜索类型
export default {
  name: "Audio",
  data() {
    return {
      selectedLabel: "音频",
      tabLabels: [
        {
          label: "音频",
          icon: "icon-yinyue"
        },
        {
          label: "专辑",
          icon: "icon-zhuanji"
        },
        {
          label: "创作人",
          icon: "icon-creator"
        }
      ],
      items: yinpinData,
      filterData: null,
      placeholderList: placeholderList,
      searchTypeList: searchTypeList,
      navLists:[
        {iconSrc:"/img/mySong.png",url:'www.zuma.com',navTitle:'我的歌单'}
      ]
    };
  },
  created(){
    let that = this;
  },
  methods: {
    changePage(current) { //当前子组件
      this.selectedLabel = this.tabLabels[current].label;
      console.log(current);
    },
    findIndex(arr) {  //获取当前子组件下标
      var index = 0;
      arr.map((item, i) => {
        if (item.label == this.selectedLabel) {
          index = i;
        }
      });
      return index;
    },
    beginSearch(data) {
      console.log("点击了搜索", data);
    },
    handleFocus(){
      console.log('聚焦')
    }
  },
  computed: {
    initialIndex() {//子组件切换滑动切换
      return this.findIndex(this.tabLabels);
    }
  },
  components: {
    music,
    zhuanji,
    creator,
    SearchInput
  }
};
</script>

<style lang="scss">
#musicAudio {
  background-color: #f2f2f2;
  height: 100%;
  position: fixed;//此处为了解决不同机型下滚动内容区域(三个组件)高度过大时鼠标滚轮效果
  top:0;
  left: 0;
  width: 100%;
  .search {
    background: white;
    width: 100%;
    padding-bottom: 6px;
    min-height: 40px;
  }
  .musicBox {
    // margin: 5px 0;
    position: relative;
    .cube-tab-bar {
      background-color: white;
      .cube-tab {
        color: #000;
      }
      .cube-tab_active {
        color: #3d9be9;

        .icon-yinyue {
          background-image: url("../../common/images/音乐-选中.png") !important;
        }
        .icon-zhuanji {
          background-image: url("../../common/images/专辑-选中.png") !important;
        }
        .icon-creator {
          background-image: url("../../common/images/创作人-选中.png") !important;
        }
      }
      .cube-tab-bar-slider {
        background-color: #3d9be9;
        width: 100px;
      }
      .iconFont {
        display: inline-block;
        width: 12px;
        height: 12px;
        margin-right: 5px;
        &.icon-yinyue {
          background-image: url("../../common/images/音乐-默认.png");
          background-size: 100%;
        }
        &.icon-zhuanji {
          background-image: url("../../common/images/专辑-默认.png");
          background-size: 100%;
        }
        &.icon-creator {
          background-image: url("../../common/images/创作人-默认.png");
          background-size: 100%;
        }
      }
    }
    .container {
      .bannerImg {
        margin: 6px 0;
        width: 100%;
        img {
          width: 100%;
        }
      }
    }
  }
  .creatorItemWrapper {
    ul {
      li {
        position: relative;
        .selectedWrap {
          position: absolute;
          width: 100%;
          height: 100%;
          display: block;
          background: rgba(61, 155, 233, 0.1);
          right: 0;
          .selectImgBoxC {
            right: 0;
            bottom: 0;
            position: absolute;
            height: 0px;
            width: 0px;
            border-bottom: 20px solid rgba(61, 155, 233, 0.9);
            border-left: 20px solid transparent;
            box-sizing: border-box;
            text-align: center;
            img {
              display: inline-block;
              width: 10px;
              height: 10px;
              right: 1px;
              bottom: -20px;
              position: absolute;
            }
          }
        }
      }
    }
  }
}
.wrap {
  z-index: 2;
}
.public-nav{
  z-index: 2;
}
</style>
