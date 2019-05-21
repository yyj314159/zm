<template>
    <div class="newsseach">
        <div v-if="notFound" class="newsnofound">
           抱歉&nbsp;!&nbsp;没有找到符合条件的新闻&nbsp;！
        </div>
            <cube-scroll
                ref="scroll"
                :data="NewsList"
                :options="options"
                @pulling-up="onPullingUp"
                @scroll="scroll"
                :scroll-events="['scroll']"
                class="list"
        >
        <Loading v-if="showreadyLoading"></Loading>
  <ul id="alreadyshow">
  <a :href='item.newsWapDetailPageSrc'  v-for="(item,index) of NewsList" :key=index  @click="detail($event,index)" style="float:left" >
  <li>
    <!-- 图文无图 -->
  <div v-if="item.fNewsType == 1 && item.fThumbnail== null" class="newsImageText">
  <div>
  <div class="newsImageText_title" v-html="item.fNewsTitle"></div>
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
    <img :src='item.fThumbnail.indexOf("video_")==-1 ? item.fThumbnail : item.fThumbnail.split("video_")[1]' alt="" @load="imgAutoAdapt"/>
    <i v-show="item.fThumbnail.indexOf('video_')!=-1" class="BlogVideo_icon"></i>
  </div>
  <div class="newsImageText_right">
  <div class="newsImageText_title" v-html="item.fNewsTitle"></div>
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
  <div class="newsAtlas_title" v-html="item.fNewsTitle"></div> 
  <div class="newsAtlas_showbox">
    <ul>
      <li v-for="(val,index) of item.fContent.split(',').slice(0,3) " :key=index><img :src='val' alt="" @load="imgAutoAdapt"/></li>
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
  <div class="newsVideo_title" v-html="item.fNewsTitle"></div>  
  <div class="newsVideo_pic">
    <img :src='item.fThumbnail' alt="" @load="imgAutoAdapt"/>
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
                        <span v-show="showLoading">
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
</template>
<script>
import MethodsUtil from "../../common/js/MethodsUtil";
import Loading from "../public/loading";
import eventBus from "../../common/js/eventBus";
import { truncate } from 'fs';
import { setTimeout } from 'timers';
import { constants } from 'crypto';
export default{
    data(){
        return {
            NewsList:[],
            list:[],
            params:{},                 //请求参数  
            dataLength:null,           //已请求数据长度
            showLoading:true,          //下拉loading图
            theEnd:false,              //是否到底
            showGoTop:false,           //是否显示“回到顶部”按钮
            scrollTop:0,               //滚动距离
            pageNow:1,                 //从第几条数据开始拿
            pageNowSelect:1,           //从第几条数据开始拿（筛选）
            keywordcontent:'',         //关键词内容
            showreadyLoading:false,    //加载时候的loading图
            newsCount:null,            //新闻请求总数
            notFound:false,            //无数据样式
            origin:true,               //搜索结果来源，默认是从列表来，若从筛选条件后搜索，则是false
            params1:null,              //筛选条件
        }
    },
    props:['keyword'],
    components:{
            Loading
    },
    filters:{
      typejudge:(n)=>{
        switch(n){
          case 1: return '图文'; break;
          case 2: return '图集'; break;
          case 4: return '视频'; break;
          
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
            scroll:function(dis){
                this.scrollTop = -dis.y;
            },
            onPullingUp:function() {
              if (this.dataLength < this.newsCount) {
               setTimeout(()=>{
                // 如果有新数据
                  if(this.origin){
                          // 从列表里来 
                        this.pageNow++;
                        this.params.pageNow = this.pageNow;   
                        this.getData(this.params);
                      }else{
                          // 从筛选条件
                      this.pageNowSelect++; 
                      this.params1.pageNow = this.pageNowSelect; 
                      this.getData(this.params1);
                      }
                     this.$refs.scroll.forceUpdate();
                    
                    },1000)
                  } else {
                    // 如果没有新数据
                    this.showLoading = false;
                    this.theEnd = true;
                    this.$refs.scroll.forceUpdate();
                    this.$refs.scroll.refresh();
                    setTimeout(()=>{
                      this.$refs.scroll.refresh();
                      this.theEnd = false;
                    },1000)
                  }
            },
            getData(params){
                this.HttpCli.post(
                   "/news_web/search-api/searchNews",
                    params
                ).then((res)=>{
                      if(res.data.status==0){
                         this.newsCount = res.data.data.count             
                        if(params.pageNow==1){
                           setTimeout(()=>{
                              if(res.data.data.content.length>0){
                                  this.showreadyLoading = false;
                                  this.notFound = false;
                                  this.NewsList = res.data.data.content;  
                              }else{
                                  this.notFound = true;
                              }  
                           },500)

                          }else{
                               
                                if(res.data.data.content.length == 0){
                                      this.showLoading = false;
                                      this.theEnd = true;
                                      setTimeout(()=>{
                                      this.theEnd = false; 
                                      },1000)
                                    }else{
                                      this.list = res.data.data.content;
                                    } 
                              }
                            this.NewsList = [...this.NewsList, ...this.list]; 
                            this.dataLength = this.NewsList.length
                      }   
                }).catch((err)=>{

                })
            },
            detail(eve,arg){
                console.log("去详情页")
            },
            imgAutoAdapt:function(e){
                MethodsUtil.imgAutoAdapt(e.target,true)
            },
            goToTop:function(){
                this.$refs.scroll.scrollTo(0, 0, 1500);
            },
            gotohead(){
                this.$refs.scroll.scrollTo(0, 0, 0);
            }
        },
        computed: {
            options() {
                return {
                    pullUpLoad: {
                        threshold: 0, //上拉阈值
                        stop:70,
                        txt: "更新成功"
                    },
                    scrollbar: {
                        fade:true
                    }
                };
            }
        },
        watch:{
          scrollTop:{
                handler:function(newVal,oldVal){
                    if(newVal>=800){
                        this.showGoTop = true;
                    }else{
                        this.showGoTop = false;
                    };
                },
                deep:true,
            }
        },
        mounted(){
             //自定义不同设备的展示区域高度
            let h1 = document.querySelector(".searchEnd").offsetHeight;
            let h2 = document.querySelector(".searchBefore").offsetHeight;
            let h3 = document.querySelector(".switchCategory").offsetHeight;
            let WinH = document.documentElement.clientHeight;
            document.querySelector(".list").style.height = WinH-h1-h2-h3+"px";
            //搜索参数赋值
            this.showreadyLoading = true;
            this.keywordcontent = this.$route.query.keyWord;
            this.params.pageSize = 12 ;
            this.params.pageNow = this.pageNow;
            this.params.keyword = this.keywordcontent;
            this.getData(this.params)
            //筛选之后参数赋值
            eventBus.$on("selectnewsType",(arg)=>{
             this.gotohead();    //切换筛选条件回到头部
             this.origin=false;
             this.params1 = arg;
             this.params1.pageSize = 12 ;
             this.params1.pageNow = 1;
             this.params1.keyword = this.keywordcontent;
             //重新赋值
             this.showLoading = true;
             this.NewsList=[];
             this.list=[];
             this.dataLength = null;
             this.pageNow = 1;
             this.pageNowSelect = 1;
             this.newsCount = null;
             this.notFound = false;
             this.showreadyLoading = true;
             this.getData(this.params1);  
             
            
            })
        },
}
</script>
<style lang="scss" rel="stylesheet/stylus">
.newsnofound{
    width: 100%;
    height: 474px;
    background-image: url('../../common/images/noNews.jpg');
    background-size: 100% auto;
    background-repeat: no-repeat;
    font-size: 16px;
    line-height: 690px;
    background-position-y: -54px;    
    text-align: center; 
}
.newsseach{
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
.list{
  background-color: #f2f2f2;
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
  em{
      font-style: normal;
      color: #3D9BE9;
      font-weight: bold;
  }
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