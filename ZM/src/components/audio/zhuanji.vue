<template>
  <div id="zhuanji" class="scroll-list-wrap" ref="zhuanji" :style="contentStyleObj">
    <!-- 有数据条件判断 -->
    <span v-if="dataItems.length>0">
      <!-- 滚动部分 -->
      <cube-scroll
        ref="scroll"
        :data="dataItems"
        :options="options"
        @pulling-up="onPullingUp"
        id="pok"
        @scroll="handelScrol"
        :scroll-events="['scroll']"
      >
        <div class="bannerImg" v-if="!isSearch">
          <img src="../../common/images/音乐专辑.jpg" alt="专辑">
        </div>
        <!-- 专辑列表 -->
        <ul>
          <li v-for="(zhuanji,i) in dataItems" :key="i">
            <a :href="`audio_wap/mobileAudioPlayer/mobilePlayer#!/audio/album/2-${zhuanji.albumId}/1/`">
              <div class="zhuanji-cont">
                <section class="imgBox">
                  <img
                    :src="zhuanji.albumCoverUrl"
                    :alt="zhuanji.albumName+zhuanji.fAlias"
                    ref="imgs"
                    @load="zishiying($event,i)"
                    class="zishiying"
                  >
                  <div class="positionBox">
                    <img src="@/common/images/inforplay.png" alt="播放">
                    <!-- <div class="play">
                    <img src="@/common/images/inforplay.png" alt="播放">
                    </div>-->
                  </div>
                </section>

                <section class="about">
                  <h3 v-html="zhuanji.albumName"></h3>
                  <p>{{ zhuanji.creatorStr!=null ? zhuanji.creatorStr:zhuanji.fCreateTime}}</p>
                </section>
              </div>
            </a>
          </li>
        </ul>

        <template slot="pullup" slot-scope="propsa">
          <div v-show="propsa.pullUpLoad">
            <template>
              <span v-if="!isBottom">
                <Loading style="margin:10px auto;height:30px"></Loading>
              </span>
              <!-- <span v-else>{{propsa.txt}}</span> -->
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
        <span v-if="!initLoadingShow" class="notFind">
          <p>抱歉！没有找到符合条件的专辑！</p>
        </span>
      </span>
    </div>
  </div>
</template>

<script>
import { Scroll } from "cube-ui";
import Loading from "../public/loading.vue";
import { setTimeout } from "timers";
export default {
  props: {
    Search: {//是否为搜索页 默认为列表展示页
      type: Boolean,
      default: false
    },
    keyword: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      urlLeft: "", //图片或者跳转url的左边族蚂域名
      dataItems: [],
      dataLen: null,
      dataLenSearch: null,
      isBottom: false,
      contentStyleObj: {
        height: "100%"
      },
      page: 1,
      list: [],
      touchMoveT: false,
      isSearch: this.Search,
      page2: 1,
      initLoadingShow: true,
      keywordValue: this.keyword
    };
  },
  created() {
    let that = this;
    // if (this.$route.query.keyW) {
    //   that.keywordValue = this.$route.query.keyW;
    // }
    setTimeout(() => {
      if (that.isSearch) {
        that.getData2(1, that.keywordValue); //如果是搜索展示页
      } else {
        that.getData(1); //初始加载获取第一页的数据
      }
      setTimeout(() => {//初始加载若没有数据0.5秒后显示没有数据图隐藏loading图
        if (that.dataItems.length == 0) {
          that.initLoadingShow = false;
        }
         that.initLoadingShow = false;
      }, 500);
    }, 1000);
  },
  mounted() {
    let that = this;
    let zhuanjiDom = document.getElementById("zhuanji");

    if (that.isSearch) { //搜索页面
      let h = document.querySelector(".searchEnd").offsetHeight;
      let h2 = document.querySelector(".searchBefore").offsetHeight;
      let h3 = document.querySelector(".switchCategory").offsetHeight;
      zhuanjiDom.style.height = window.innerHeight - h - h2 - h3 + "px";
    } else { //all
      let h = document.querySelector(".search").offsetHeight;
      let h2 = document.querySelector(".cube-tab-bar").offsetHeight;

      zhuanjiDom.style.height = window.innerHeight - h - h2 + "px";
    }
   
  },

  computed: {
    options() {
      return {
        pullUpLoad: {
          threshold: 0,
          stop: 40,
          txt: "更新成功"
        },
        scrollbar: true
      };
    }
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
      //图片自适应 有待测试
      let that = this;
      let imgSize = that.$refs["imgs"];
      //图片自然宽高
      let naturalHeight = imgSize[i].naturalHeight;
      let naturalWidth = imgSize[i].naturalWidth;
      if (naturalHeight >= naturalWidth) {
        event.target.style.width = "100%";
      } else {
        event.target.style.height = "100%";
      }
    },

    getData(page) {
      //获取数据
      let that = this;
      that.HttpCli.get("/audio_web/search-api/searchAlbum", {
        pageNow: page
      }).then(res => {
        if (page == 1) {
          //默认为一
          that.dataItems = res.data.data.content;
        } else {
          //不是第一页 第一变量数组用来和dataItems合并
          that.list = res.data.data.content;
        }
        that.dataLen = res.data.data.content.length; //定义一个变量检测是否为最后一页 若为最后一页 len为0
        console.log(that.dataItems, "/////");
      });
    },
    getData2(page2, keyword) {
      let that = this;
      that.HttpCli.get("/audio_web/search-api/searchAlbum", {
        keyword: keyword,
        pageNow: page2
      }).then(res => {
        if (page2 == 1) {
          that.dataItems = res.data.data.content;
        } else {
          that.list = res.data.data.content;
        }
        that.dataLenSearch = res.data.data.content.length;
        console.log(res, "关键词数据");
      });
    },

    onPullingUp() {
      //上拉加载数据函数
      if (!this.isSearch) {
        if (this.page == 1) {
          this.page = 2;
        }
        setTimeout(() => {
          if (this.dataLen > 0) {
            //有数据
            this.page += 1;
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
            //有数据
            this.page2 += 1;
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
      }
    },

    scrollTo() {
      //返回顶部
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
      this.getData(newv);
    },
    page2(newv) {
      this.getData2(newv, this.keywordValue);
    },
    keyword(newv, oldv) {
      //关键词改变执行搜索
      this.keywordValue = newv;
      this.getData2(1, newv);
    }
  }
};
</script>
<style lang="scss">
#zhuanji {
  //height: 500px;
  // border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  transform: rotate(0deg);
  overflow: hidden;
  position: relative;
  .cube-scroll-wrapper {
  }
  em {
    color: #3d9be9;
    font-style: normal;
  }
  .toTop {
    position: absolute;
    right: 10px;
    bottom: 60px;
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
    margin: 6px 0 2px 0 !important;
    width: 100%;
    img {
      width: 100%;
    }
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    li {
      width: 49%;
      background: #fff;
      margin-bottom: 5px;
      .zhuanji-cont {
        .imgBox {
          position: relative;
          width: 100%;
          height: 160px;
          overflow: hidden;
          .zishiying {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          img {
            // display: inline;
            // width: 100%;
            // height: 100%;
          }
          .positionBox {
            position: absolute;
            width: 30px;
            height: 30px;
            // border: 1px solid #fff;
            border-radius: 50%;
            bottom: 5px;
            right: 5px;
            box-sizing: border-box;
            img {
              width: 30px;
              height: 30px;
            }
            .play {
              width: 0;
              height: 0;
              border-width: 11px 0px 11px 11px;
              border-style: solid;
              border-color: transparent transparent transparent #ffffff;
              position: relative;
              display: inline-block;
              text-align: center;
              margin: 3px 0 0 3px;
            }
          }
        }

        .about {
          text-align: left;
          padding: 10px 0px 10px 5px;
          h3 {
            color: #000;
            font-size: 16px;
            line-height: 30px;
            width: 100%;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
          p {
            color: #949494;
            line-height: 30px;
            width: 100%;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
        }
      }
    }
  }
  .notFind {
    display: block;
    width: 100%;
    height: 100%;
    background: url("../../common/images/notAlbum.jpg") center;
    background-size: 100%;
    font-size: 16px;
    color: #aaa;
    padding-top: 350px;
    position: relative;
    p {
      position: absolute;
      width: 100%;
      text-align: center;
      left: 0;
      bottom: 100px;
    }
  }
}
</style>


