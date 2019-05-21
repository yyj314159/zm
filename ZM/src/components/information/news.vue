<template>
<div>
  <div id="newsList" class="scroll-list-wrap">  
    <cube-scroll
      ref="scroll"
      :data="NewsList"
      :options="options"
      @scroll="scroll"
      :scroll-events="['scroll']"
      @pulling-up="onPullingUp"
    >
    <!-- 内容区域 -->
    <div class="bannerImg">
      <img src="../../common/images/流量入口.jpg" alt="新闻">
    </div>
  <ul id="alreadyshow">
    <a :href='item.newsWapDetailPageSrc'  v-for="(item,index) of NewsList" :key=index  @click="detail($event,index)" style="float:left" >
    <li>
    <!-- 图文无图 -->
  <div v-if="item.fNewsType == 1 && item.fThumbnail== null" class="newsImageText">
  <div>
  <div class="newsImageText_title">{{item.fNewsTitle}}</div>
  <div class="news_status">
    <span class="newsType">{{item.fNewsType|typejudge}}</span>
    <b class="Punctuation_interval">·</b>
     <span>{{item.fUpdateTime|dataShowcasing}}</span> 
    <b class="Punctuation_interval">·</b>
    <span>{{item.fShopSiteName}}</span>
  </div>
  </div>
  </div>
    <!-- 图文有图 -->
  <div v-if="item.fNewsType == 1 && item.fThumbnail != null"  class="newsImageText">
  <div class="newsImageText_pic">
    <img :src='item.fThumbnail.indexOf("video_")==-1 ? item.fThumbnail : item.fThumbnail.split("video_")[1]' alt=""  @load="imgAutoAdapt"/>
    <i v-show="item.fThumbnail.indexOf('video_')!=-1" class="BlogVideo_icon"></i>
  </div>
  <div class="newsImageText_right">
  <div class="newsImageText_title">{{item.fNewsTitle}}</div>
  <div class="news_status">
    <span class="newsType">{{item.fNewsType|typejudge}}</span>
    <b class="Punctuation_interval">·</b>
    <span>{{item.fUpdateTime|dataShowcasing}}</span>
    <b class="Punctuation_interval">·</b>
    <span>{{item.fShopSiteName}}</span>
  </div>
  </div>
  </div>
   <!-- 图集 -->
  <div v-else-if="item.fNewsType == 2" class="newsAtlas">
  <div class="newsAtlas_title">{{item.fNewsTitle}}</div> 
  <div class="newsAtlas_showbox">
    <ul>
      <li v-for="(val,index) of item.fContent.split(',').slice(0,3) " :key=index ><img :src='val' alt=""  @load="imgAutoAdapt"/></li>
    </ul>
  </div>
  <div class="news_status">
    <span class="newsType">{{item.fNewsType|typejudge}}</span>
    <b class="Punctuation_interval">·</b>
    <span>{{item.fUpdateTime|dataShowcasing}}</span>
    <b class="Punctuation_interval">·</b>
    <span>{{item.fShopSiteName}}</span>
  </div>
  </div>
 
  <!-- 视频 -->
  <div v-else-if="item.fNewsType == 4" class="newsVideo">
  <div class="newsVideo_title">{{item.fNewsTitle}}</div>  
  <div class="newsVideo_pic">
    <img :src='item.fThumbnail' alt=""  @load="imgAutoAdapt"/>
    <i class="newsVideo_icon"></i>
  </div>
  <div class="news_status">
    <span class="newsType">{{item.fNewsType|typejudge}}</span>
    <b class="Punctuation_interval">·</b>
    <span>{{item.fUpdateTime|dataShowcasing}}</span>
    <b class="Punctuation_interval">·</b>
    <span>{{item.fShopSiteName}}</span>
  </div>
  </div>
  </li>
  </a>
  </ul>
   <template slot="pullup" slot-scope="propsa">
        <div v-show="propsa.pullUpLoad">
          <template>
            <span v-show="loading">
            <Loading class="showLoading"></Loading>
            </span>
            <div v-show="theEnd" class="the-end" >╮(╯﹏╰)╭&nbsp;&nbsp;&nbsp;已经到底啦！</div>
          </template> 
        </div>
    </template>
  </cube-scroll>
   <!--回到顶部-->
        <div class="gotoTop" @click="goToTop" v-if="showGoTop">
            <img src="../../common/images/gotoTop.png" alt="">
        </div>
  </div>
  </div>
</template>
<script>
  import { Scroll } from "cube-ui";
  import MethodsUtil from "../../common/js/MethodsUtil";
  import Loading from "../public/loading"
  export default {
    name: 'News',
    data(){
       return{
              NewsList:[],
              dataLength:null,
              list:[],
              showGoTop:false,      //是否显示“回到顶部”按钮
              page:1,
              scrollTop:0,     
              loading: false,
              theEnd : false,
       }
    },
     components: {
      Loading
    },
    filters:{
      typejudge:(n)=>{
        switch(n){
          case 1: return '图文'; break;
          case 2: return '图集'; break;
          default: 
          return '视频';
        }
      },
      dataShowcasing(_date){
          let arr = _date.split(/[- : \/]/);
          _date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);
          let _date1 =_date;
          let _dateHaoMiao=(new Date(_date1)).getTime();
          let _thisd = new Date() //当前时间的毫秒數
          let _thisdHaoMiao = (new Date(_thisd)).getTime();
          let num = _thisdHaoMiao - _dateHaoMiao  //時間差
          let dateStr = "";
          let ndate =_date;
          let thisDate = ndate
          if (num < 1000 * 60) {
              dateStr = "1分钟前";
          }else if(num<1000*60*60){
              num = Math.ceil(num/(1000*60))
              dateStr =num +"分钟前";
          }else if(num<1000*60*60*24){
              num = Math.ceil(num/(1000*60*60))
              dateStr =num +"小时前";
          }else if(num<1000*60*60*24*30){
              num = Math.ceil(num/(1000*60*60*24))
              dateStr =num +"天前";
          }else if(num<1000*60*60*24*30*12){
              num = Math.ceil(num/(1000*60*60*24*30))
              dateStr =num +"月前";
          }else{ 
              num = Math.ceil(num/(1000*60*60*24*30*12))
              dateStr =num +"年前";
          }
          return dateStr;
      }
      
    },
    methods:{
      detail(event,arg){

      },
      scroll:function(dis){
                this.scrollTop = -dis.y;
            },
      onPullingUp(){
              if (this.dataLength>0) {
                // 如果有新数据
                this.loading = true;
                 setTimeout(() => {
                this.page++;
                this.NewsList = [...this.NewsList, ...this.list];
                this.$refs.scroll.forceUpdate();
                }, 1000)
              } else {
                // 如果没有新数据
                this.theEnd = true;
                this.loading = false;
                this.$refs.scroll.forceUpdate();
                this.$refs.scroll.refresh();
                setTimeout(()=>{
                  this.$refs.scroll.refresh();
                  this.theEnd = false;
                },1000)
              }
            
          },
      getNewsData:function(page){
                  this.HttpCli.post(
                       "/news_web/search-api/searchNews",
                        {pageNow:page} 
                  ).then((res)=>{
                      if(res.data.status==0){
                        if(page==1){
                          this.NewsList = res.data.data.content;
                          }else{
                                if(res.data.data.content == null){
                                      this.theEnd = true;
                                      this.dataLength = 0;
                                      return;
                                    }
                                this.list = res.data.data.content;
                              }
                         this.dataLength = res.data.data.content.length; 
                      }
                  }).catch((err)=>{
                      console.log(err)
                  })       
       },
       goToTop:function(){
                this.$refs.scroll.scrollTo(0, 0, 1500);
            },
      imgAutoAdapt:function(e){
          MethodsUtil.imgAutoAdapt(e.target,true)
      },
      
    },
   computed: {
       options() {
            return {
                pullUpLoad: {
                    threshold:0,
                    stop: 40,
                    txt: "更新成功"
                },
                scrollbar: true
            };
        }, 
    },
    mounted(){
        let Hs = document.getElementsByClassName("inforseach")[0].offsetHeight;
        let Tab = document.getElementsByClassName("infortabchange")[0].offsetHeight;
        let WinH = document.documentElement.clientHeight;
        document.getElementById("newsList").style.height = WinH-Hs-Tab+"px";
        this.getNewsData(1);
    },
    watch: {
        page(newPage) {
            this.getNewsData(newPage);
        },
        scrollTop:{
                handler:function(newVal,oldVal){
                    if(newVal>=800){
                        this.showGoTop = true;
                    }else{
                        this.showGoTop = false;
                    };
                },
                deep:true,
            },
        },
  }
</script>

<style lang="scss">
#newsList{
  width: 320px;
  font-family: "微软雅黑";
  text-align: left;
  float: left;
  position: relative;
  overflow: hidden;
  transform: rotate(0deg);
  border-radius: 5px;
  height: 484px;
}
#alreadyshow{
  background-color: #FFFFFF;
  float:left;
  li{
    float: left;
  }
}
.newsImageText,.newsAtlas,.newsVideo{
  width: 300px;
  height: auto;
  float: left;
  margin:0 10px;
  padding: 10px 0;
  border-bottom: 1px solid #f2f2f2;
  
}
.newsImageText_title,.newsAtlas_title,.newsVideo_title{
  font-size: 14px;
  word-break: break-all;
  color:#333;
  flex: 1;
  overflow: hidden;
  white-space: normal;
  line-height: 18px;
}
.Punctuation_interval{
  padding: 0 6px;
}
.news_status{
  font-size: 12px;
  padding-top: 10px;
  color: #A1A1A1;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.newsType{
  color:#3D9BE9;
}
.newsImageText_pic{
  float: left;
  position: relative;
  width:98px;
  height: 70px;
  overflow: hidden;
}
.newsImageText_right{
  float: left;
  margin-left: 10px;
  width: 192px;
  height: 70px;
  display: flex;
  flex-direction: column;
}

.newsAtlas_showbox ul{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top:10px;
}
.newsAtlas_showbox ul li{
  width: 98px;
  height: 70px;
  overflow: hidden;
}

.newsVideo_pic{
  margin-top: 10px;
  position: relative;
  width: 300px;
  height: 169px;
  overflow:hidden;
}

.newsVideo_icon{
  position: absolute;
  left: 50%;
  top:50%;
  margin-left: -20px;
  margin-top: -20px;
  background-image: url('../../common/images/inforplay.png');
  width: 40px;
  height: 40px;
  background-size: contain;
  background-repeat: no-repeat;
}
.showLoading{
  padding-bottom: 20px;
}
.the-end{
  text-align: center;
  padding: 20px 0;
}
</style>
