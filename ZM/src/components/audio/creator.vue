<template>
  <div id="creator" :style="contentStyleObj" ref="creator">
    <!-- 有数据条件判断 -->
    <span v-if="dataItems.length>0">
      <!-- 滚动部分 -->
      <cube-scroll
        ref="scroll"
        :data="dataItems"
        :options="options"
        @pulling-up="onPullingUp"
        id="pokCreator"
        @scroll="handelScrol"
        :scroll-events="['scroll']"
      >
      <div class="bannerImg" v-if="!isSearch">
              <img src="../../common/images/音乐赚钱.jpg" alt="音乐">
            </div>
        <!-- 创作人列表 -->
        <ul>
          <li v-for="(creator,i) in dataItems" :key="i">
            <a :href="`audio_wap/mobileAudioPlayer/mobilePlayer#!/audio/creator/2-${creator.creatorId}/1/`">
              <section class="imgBox">
                <img
                  :src="creator.creatorCoverUrl"
                  :alt="creator.creatorName+creator.creatorAliasA+creator.creatorAliasB"
                  @load="zishiying($event,i)"
                  ref="imgs"
                  class="zishiying"
                >
              </section>

              <p v-html="creator.creatorName"></p>
            </a>
          </li>
        </ul>
        <template slot="pullup" slot-scope="propsa">
          <div v-show="propsa.pullUpLoad">
            <template>
              <!-- <span v-if="propsa.isPullUpLoad &&!isBottom"> -->
              <span v-if="!isBottom">
                <Loading></Loading>
              </span>
              <span v-else>{{propsa.txt}}</span>
              <span
                v-show="propsa.isPullUpLoad &&isBottom"
                style="padding:20px 0 100px 0;display:block"
              >╮(╯﹏╰）╭&nbsp;&nbsp;已经到底了</span>
            </template>
          </div>
        </template>
      </cube-scroll>
      <!-- 返回按钮-->
      <section class="toTop" @click="scrollTo" v-show="touchMoveT">
        <img src="@/common/images/gotoTop.png" alt="上">
      </section>
    </span>
    <!-- 没有数据 -->
    <div v-else style="height:100%">
      <span>
        <Loading v-if="initLoadingShow"></Loading>
        <span

          v-if="!initLoadingShow"
         
          class="notFind"
        > <p> 抱歉！没有找到符合条件的创作人！</p></span>
      </span>
    </div>
  </div>
</template>
<script>
import { Scroll } from "cube-ui";
import { setTimeout } from "timers";
import Loading from "../public/loading.vue";
export default {
  props: {
    Search: {//是否为搜索页
      type: Boolean,
      default: false
    },
    keyword: {
      type: String,
      default: ""
    },
    filterValue: {//筛选条件值
      type: Object
    }
  },
  data() {
    return {
      dataLen: null,
      dataLenSearch: null,
      isBottom: false,
      page: 1,
      list: [],
      dataItems: [],
      urlLeft: "", //图片或者跳转url的左边族蚂域名,
      contentStyleObj: {
        height: ""
      },
      touchMoveT: false,
      initLoadingShow: true,
      isSearch: this.Search,
      page2: 1,
      keywordValue:this.keyword
    };
  },
  created() {
    let that = this;
    setTimeout(() => {
      if (that.isSearch) {
        that.getData2(1, that.keywordValue, 24); //如果是搜索展示页
      } else {
        that.getData(1, 24); //初始加载获取第一页与第二页的数据
      }
      setTimeout(() => {
        if (that.dataItems.length == 0) {
          //如果没有数据控制loading隐藏以及文字提示的显示
          that.initLoadingShow = false;
        } 
         that.initLoadingShow = false;
      }, 500);
    }, 1000);
  },
  mounted() {
    let that = this;
    let creatorDom = document.getElementById("creator");
    if (that.isSearch) { //搜索页面
      let h = document.querySelector(".searchEnd").offsetHeight;
      let h2 = document.querySelector(".searchBefore").offsetHeight;
      let h3 = document.querySelector(".switchCategory").offsetHeight;
      creatorDom.style.height = window.innerHeight - h - h2 - h3 + "px";
    } else { //all
      let h = document.querySelector(".search").offsetHeight;
      let h2 = document.querySelector(".cube-tab-bar").offsetHeight;

      creatorDom.style.height = window.innerHeight - h - h2 + "px";
    }
  },
  computed: {
    options() {
      return {
        pullUpLoad: {
          threshold: -10,
          stop: 40,
          txt: "更新成功"
        },
        scrollbar: true
      };
    },
  },
  methods: {
    handelScrol(pos) {
      //实时监听滚动位置控制返回顶部的显隐
      if (pos.y < -1000) {
        this.touchMoveT = true;
      } else {
        this.touchMoveT = false;
      }
    },
    zishiying(event, i) {
      let that = this;
      let imgSize = that.$refs["imgs"];
      that.$nextTick(() => {
        //图片自然宽高
        let naturalHeight = imgSize[i].naturalHeight;
        let naturalWidth = imgSize[i].naturalWidth;
        if (naturalHeight >= naturalWidth) {
          event.target.style.width = "100%";
        } else {
          event.target.style.height = "100%";
        }
      });
    },
    getData(page, pageSize) {
      //获取数据
      let that = this;
      that.HttpCli.get("/audio_web/search-api/searchCreator", {
        pageNow: page,
        pageSize: pageSize
      }).then(res => {
        if (page == 1) {
          //默认为一
          that.dataItems = res.data.data.content;
        } else {
          //不是第一页 定义一变量数组用来和dataItems合并
          that.list = res.data.data.content;
        }
        that.dataLen = res.data.data.content.length; //定义一个变量检测是否为最后一页 若为最后一页 len为0
        console.log(that.dataItems, "/////");
      });
    },
    getData2(page2, keyword, pageSize, filterValue) {
      let that = this;
       filterValue =that.filterValue
      that.HttpCli.get("/audio_web/search-api/searchCreator", {
        keyword: keyword,
        pageNow: page2,
        pageSize: pageSize,
        creatorNationalityType: filterValue.guojiValue,
        creatorType: filterValue.typeValue
      }).then(res => {
        if (page2 == 1) {
          that.dataItems = res.data.data.content;
        } else {
          that.list = res.data.data.content;
        }
        that.dataLenSearch = res.data.data.content.length;
        console.log(res, "关键词创作人数据1111111111");
      });
    },
   
    onPullingUp() {
      if (!this.isSearch) {
        if (this.page == 1) {
          this.page = 2; //此做法的结果是第一次下拉刷新请求的是第二页和第三页的数据可致使最后一次请求数据为空即判断dataLen为0
        }
        setTimeout(() => {
          if (this.dataLen > 0) {
            //有数据
            this.page += 1;
            // this.getData(this.page)
            this.dataItems = [...this.dataItems, ...this.list];
            this.$refs.scroll.forceUpdate();
            this.$refs.scroll.refresh();
            this.isBottom = false;
          } else {
            // 如果没有新数据
            this.$refs.scroll.forceUpdate();
            this.$refs.scroll.refresh();
            this.isBottom = true;
          }
        }, 1000);
      } else {
        if (this.page2 == 1) {
          this.page2 = 2;
        }
        setTimeout(() => {
          if (this.dataLenSearch > 0) {
            this.page2 += 1;
            // console.log(this.page2,'页码1')
            // console.log(this.list,'list数组')
            this.dataItems = [...this.dataItems, ...this.list];
            this.$refs.scroll.forceUpdate();
            this.$refs.scroll.refresh();
            // console.log(this.dataItems.length, "长度");
            this.isBottom = false;
          } else {
            // 如果没有新数据
            this.$refs.scroll.forceUpdate();
            this.$refs.scroll.refresh();
            this.isBottom = true;
          }
        }, 1000);
      }
    },

    scrollTo() {
      this.$refs.scroll.scrollTo(0, 0, 2000);
    }
  },
  components: {
    Loading
  },
  watch: {
    //尝试watch 这里可以写在上拉加载函数中
    page(newv) {
      //观察page的改变若改变执行加载数据函数
      this.getData(newv, 24); //每次加载24条数据
    },
    page2(newv) {
      this.getData2(newv, this.keywordValue, 24); //pageSize:24
    },
   
    filterValue: {//筛选的条件值
      deep: true,
      handler: function(newv, oldv) {
        this.page2=1
        this.getData2(1, this.keywordValue, 24, newv);
      }
    },
    keyword(newv,oldv){//关键词改变执行搜索
      console.log(newv,oldv,'创作人关键字')
       this.keywordValue=newv
      this.getData2(1, newv, 24);
    }
  }
};
</script>
<style lang="scss">
#creator {
  // height: calc(100% - 200px);
  // border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  transform: rotate(0deg);
  overflow: hidden;
  position: relative;
  em {
    color: #3d9be9;
    font-style: normal;
  }
  .toTop {
    position: absolute;
    right: 10px;
    bottom: 40px;
    background: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    text-align: center;
    z-index: 99999;
    padding-top: 10px;
    box-sizing: border-box;
    img {
      width: 20px;
      height: 20px;
    }
  }
  .bannerImg {
    margin: 6px 0 2px 0!important;
    width: 100%;
    img {
      width: 100%;
    }
  }
  ul {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    background: #fff;

    li {
      width: 30%;
      text-align: center;
      margin-top: 10px;
      .imgBox {
        position: relative;
        width: 80px;
        height: 80px;
        overflow: hidden;
        border-radius: 50%;
        margin: 0 auto;
        .zishiying {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      // img {
      //   display: inline-block;
      //   width: 80px;
      //   height: 80px;
      //   border-radius: 50%;
      // }
      p {
        margin: 10px 0;
        width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
  .notFind{
    display: block;
     width: 100%;
        height: 100%;
        background:url("../../common/images/notCreater.jpg") center;
        background-size:100%;
        font-size: 16px;
        color:#aaa; 
        padding-top: 350px;
        position: relative;
        p{
          position: absolute;
          width: 100%;
          text-align: center;
          left: 0;
          bottom: 130px;
        }
  }
}
</style>


