<template>
<div>
   <div id="BlogList" class="scroll-list-wrap">
     
     <cube-scroll
      ref="scroll"
      :data="BlogList"
      :options="options"
       @pulling-up="onPullingUp"
       @scroll="scroll"
      :scroll-events="['scroll']"
    >
    <div class="bannerImg">
      <img src="../../common/images/发布博客.jpg" alt="博客">
     </div>
    <ul id="alreadyshow">
      <a :href='item.wapZmBlogURL' v-for="(item,index) of BlogList" :key=item.fInfoId  @click="detail($event,index)" style="float:left">
    <li >
      <!-- 博客无图 -->
    <div v-if="item.fBlogType == 1" class="BlogText">
    <div>
    <div class="BlogImageText_title">{{item.fBlogTitle}}</div>
    <div class="Blog_status">
      <span>{{item.fUpdateTime|dataShowcasing}}</span>
      <b class="Punctuation_interval">·</b>
      <span>{{item.fName}}</span>
    </div>
    </div>
    </div>
    <!-- 博客有图 -->
    <div v-else-if="item.fBlogType == 6" class="BlogImageText">
    <div class="BlogImageText_pic">
      <img :src='item.fImageInfo' alt=""  @load="imgAutoAdapt"/>
    </div>
    <div class="BlogImageText_right">
    <div class="BlogImageText_title">{{item.fBlogTitle}}</div>
    <div class="Blog_status">
      <span>{{item.fUpdateTime|dataShowcasing}}</span>
      <b class="Punctuation_interval">·</b>
      <span>{{item.fName}}</span>
    </div>
    </div>
    </div>
     <!-- 博客视频 -->
    <div v-else-if="item.fBlogType == 18" class="BlogVideo">
    <div class="BlogVideo_pic">
      <img :src='item.fBlogVideoImg.indexOf("video_")==-1 ? item.fBlogVideoImg : item.fBlogVideoImg.split("video_")[1]'  alt=""  @load="imgAutoAdapt"/>
      <i class="BlogVideo_icon"></i>
    </div>
   <div class="BlogImageText_right">
    <div class="BlogVideo_title">{{item.fBlogTitle}}</div>
    <div class="Blog_status">
      <span>{{item.fUpdateTime|dataShowcasing}}</span>
      <b class="Punctuation_interval">·</b>
      <span>{{item.fName}}</span>
    </div>
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
 import Loading from "../public/loading";
  export default {
    name: 'Blog',
    data(){
      return{
        BlogList:[],
        dataLength:null,
        list:[],
        showGoTop:false,      //是否显示“回到顶部”按钮
        page:1,
        scrollTop:0,  
        loading:false,
        theEnd :false,
      }
    },
    components: {
      Loading
    },
    filters:{
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
                 this.BlogList = [...this.BlogList, ...this.list];
                 this.$refs.scroll.forceUpdate();
                 },1000)
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
     getBlogData(page){
                  this.HttpCli.post(
                     "/blog_api/blogInfoSearch/searchBlog",
                     {pageNow:page} 
                  ).then((res)=>{
                      if(res.data.status==0){
                        if(page==1){
                          this.BlogList = res.data.data.content;
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
        document.getElementById("BlogList").style.height = WinH-Hs-Tab+"px";
      this.getBlogData(1)
    },
    watch: {
        page(newPage) {
            this.getBlogData(newPage);
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
#BlogList{
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
.BlogImageText,.BlogText,.BlogVideo{
  width: 300px;
  height: auto;
  float: left;
  margin:0 10px;
  padding: 10px 0;
  border-bottom: 1px solid #f2f2f2;
}
.BlogImageText_title,.BlogText_title,.BlogVideo_title{
  font-size: 14px;
  word-break: break-all;
  color:#333;
  flex: 1;
  line-height: 18px;
  overflow: hidden;
  white-space: normal
}
.Blog_status{
  font-size: 12px;
  padding-top: 10px;
  color: #A1A1A1;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.BlogType{
  color:#3D9BE9;
}
.BlogImageText_pic{
  float: left;
  width:98px;
  height: 70px;
  overflow: hidden;
}
.BlogImageText_right{
  float: left;
  margin-left: 10px;
  width: 192px;
  height: 70px;
  display: flex;
  flex-direction: column;
}

.BlogVideo_pic{
  float: left;
  position: relative;
  width:98px;
  height: 70px;
  overflow: hidden;
}
.BlogVideo_icon{
  position: absolute;
  left: 50%;
  top:50%;
  margin-left: -12px;
  margin-top: -12px;
  background-image: url('../../common/images/inforplay.png');
  width: 24px;
  height: 24px;
  background-size: contain;
  background-repeat: no-repeat;
}
.the-end{
  text-align: center;
  padding: 20px 0;
}
</style>
