<template>
    <div id="information">
      <div class="inforseach">
         <search-input :searchTypef="itemType[initialIndex]" placeholder="搜资讯" @on-search = "beginSearch"
                                            @on-clearSelected = "clearSelected"
                                            @on-cancel = "cancelF"
                                            @on-confirm = "confirmF"
                                            style="z-index:9999;position:inherit"
    > 
      <!--搜索框上部文字-->
      <span slot="end">找资讯</span>
      <!--搜索框左边文字-->
      <span slot="before">找资讯</span>


      <!--你右侧筛选的内容-->


        </search-input>
  </div>
       <!-- 选项卡部分切换 -->
     <div class="information_router">
       <div class="infortabchange">
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
      </div>
       <!-- banner部分 -->
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
            <!-- 新闻组件容器 -->
            <news></news>
          </cube-slide-item>
          <cube-slide-item>
            <!-- 博客组件容器 -->
            <blog></blog>
          </cube-slide-item>
        </cube-slide>
      </div>
    
    </div>
    </div>
</template>
<script>
import { TabBar, Slide, Scroll } from "cube-ui";
import searchInput from "../public/commonsearch";  //引入搜索组件
import news from "./news";                          //引入新闻组件
import blog from "./blog";                          //引入博客组件
const inforType=['N','B'];
  export default {
    name: 'information',
    components:{searchInput,news,blog},
    data(){
      return{
        //  
         itemType: inforType,
         selectedLabel: '新闻',
         tabLabels:[{
                label: '新闻',
                icon: 'newsIcon'
              }, {
                label: '博客',
                icon: 'blogIcon'
              }],
      }
    },
    methods:{
      changePage(current) {
         this.selectedLabel = this.tabLabels[current].label;
    },
      findIndex(arr) {
        var index = 0;
        arr.map((item, i) => {
          if (item.label == this.selectedLabel) {
            index = i;
          }
        });
        return index;
      },
      beginSearch(searchWord){
         console.log("搜索",searchWord)
          let params={};
              params.keyWord = searchWord;
              params.pageSize = 30;
          // this.getData(params);
      },
      clearSelected(){

      },
      cancelF(){

      },
      confirmF(){

      }

    },
   computed: {
        initialIndex() {
          return this.findIndex(this.tabLabels);
        }
      },
    watch:{
        
    },

  }
   
</script>

<style lang="scss">
#information{
  background-color: #f2f2f2;
  height: 100%;
  .inforseach{
    background: #FFFFFF;
    width: 100%;
    margin-bottom: 6px;
    min-height: 40px;
  }
}
.information_router{
  .infortabchange{
    width: 100%;
    height: 40px;
    background-color: #FFFFFF;
  }
  .cube-tab-bar{
    height:40px;
    line-height: 40px;
    margin: 0 10px;
 }
}

.cube-tab_active{
  color: #3D9BE9;
   .blogIcon{
      background-image: url("../../common/images/首页博客-选中.png");
    }
   .newsIcon{
      background-image: url("../../common/images/选中-搜索新闻.png");
    }
}
.cube-tab-bar-slider{
  background-color:#3D9BE9;
}
.blogIcon{
  width: 14px;
  height: 14px;
  margin-top: 13px;
  margin-right: 5px;
  background-image: url("../../common/images/首页博客.png");
  background-size: 100%;
}
.newsIcon{
  height: 15px;
  width: 15px;
  margin-top: 12px;
  margin-right: 5px;
  background-image: url("../../common/images/搜索新闻.png");
  background-size: 100%;
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
</style>
