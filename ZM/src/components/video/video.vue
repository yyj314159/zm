<template>
  <div class="indexVideo">
    <search-input searchTypef="V"
                  placeholder="搜视频"
                  :navList="navList"
    >
      <!--搜索框上部文字-->
      <span slot="end">搜视频</span>
      <!--搜索框左边文字-->
      <span slot="before">找视频</span>
    </search-input>

    <div class="searchConent"  ref="searchConent">
      <cube-scroll
              ref="contentScroll"
              :data="searchResult"
              :options="options"
              @scroll="scroll"

              :scroll-events="['scroll']"
              @pulling-up="onPullingUp"

      >
      <div class="searchScroll">
        <div class="banner">
          <img src="../../common/images/在线收费.jpg" alt="视频">
        </div>
          <ul class="videoItem">
            <li class="videoitemLi" v-for="item in searchResult">
              <div class="itemTop" @click="goDetail(item.link,item.shopId)">
                <img  :src=videoposter(item.videoType,item.positiveEpisode,item.prevueEpisode,item.featureEpisode) alt="">
                <div class="bottomBrandbox">
                  <span class="videoBrand">{{item.videoType|videoTypeF(item.fDramaType,item.totalEpisode,item.updateEpisode)}}</span>
                </div>
                <p class="category">{{item.shopFirstCategoryName}}</p>
                <p class="feeType" v-if="item.feeType==2">收费</p>
              </div>
              <div class="itemBottom">
                <p class="videoName">{{item.videoName}}</p>
                <p class="actor">{{videoStar(item.videoType,item)}}</p>
              </div>
            </li>
          </ul>
      </div>
        <template slot="pullup" >
          <div class="loading-wrapper">
            <template>
                    <span v-if="!afterAll">
                      <Loading class="showLoading"></Loading>
                    </span>
                    <span v-if="afterAll" class="after-all">╮(╯﹏╰）╭&nbsp;&nbsp;已经到底了</span>
            </template>
          </div>
        </template>
      </cube-scroll>

    </div>

    <!--回到顶部-->
    <div class="gotoTop" @click="goToTop" v-if="showGoTop">
      <img src="../../common/images/gotoTop.png" alt="">
    </div>

  </div>
</template>
<script>

    import SearchInput from 'components/public/commonsearch.vue';
    import Loading from "components/public/loading";

    import MethodsUtil from "../../common/js/MethodsUtil";
    //你筛选条件的数据
    const videoData = [
        {'level1':"收费类型",level2:['免费','付费']},
    ]

  export default {
    name: 'Video',
      data(){

          return {
              items: videoData,
              searchResult:[],
              pageIndex:1,//第几页
              showGoTop:false,      //是否显示“回到顶部”按钮
              scrollTop:0,          //滚动距离
              dataCount:0,
              options: {
                  pullUpLoad: true
              },
              navList:[
                  {iconSrc:'/img/myVideo.png',navTitle:'我的看单',href: '/video_wap/videoViewMobile/videolist'},

              ],
              afterAll:false,           //数据是否加载完
              screenWidth:"0"

          }
      },
      mounted(){
          this.$nextTick(function(){
              this.getVideoData({pageSize:30,pageNow:1})
              this.myfunction();
          })


      },
      methods: {
          myfunction:function(){
              this.$refs.searchConent.addEventListener('touchstart', function(){
                  console.log("move")
              }, false)
          },
          scroll:function(dis){
              this.scrollTop = -dis.y;
          },
          goDetail:function(url,id){
            if(url){
                var url = url.replace("$DetailId",id);
                window.location.href=url;
            }
          },
          getVideoData(param){
              var _this = this;
              if(_this.$parent.apiType=='development') {
                  var videoApi = '/videoapi';
              }else{
                  var videoApi = '';
              }
              this.HttpCli.post(videoApi+'/video_web/search-api/videoList',param)
                  .then(function (response) {
                      _this.searchResult = _this.searchResult.concat(response.data.data.content);
                      _this.dataCount = response.data.data.count;
                      setTimeout(function(){
                          const contentScroll = _this.$refs.contentScroll
                          contentScroll.refresh();

                          console.log(contentScroll)
                      },1000)



                  })
                  .catch(function (error) {
                      console.log(error);
                  });

          },
          onPullingUp() {
              //上拉
              this.pageIndex++;
              if(this.pageIndex>Math.ceil(this.dataCount/30)){
                  this.afterAll = true;
                  this.$refs.contentScroll.refresh()
              }else{
                  this.getVideoData({pageSize:30,pageNow:this.pageIndex})
              }

          },
          goToTop:function(){
              this.$refs.contentScroll.scrollTo(0, 0, 1500);
          },
          //视频类型  1.正片 2.预告片 3.花絮   (多集、单集、上下集、上中下集)
          //视频预览图 1.positiveEpisode(正片)2.prevueEpisode(预告片)3.featureEpisode（花絮）
          //海报
          videoposter: function (type,positiveEpisode,prevueEpisode,featureEpisode) {
              //有无缩略图
              var posterUrl;
              if(!type) return '';
              if(type == 1){
                  if(!positiveEpisode) return '';
                  var positTiveArray = positiveEpisode.split(",");
                  var lastIndex = positTiveArray.length-1
                  posterUrl = positTiveArray[lastIndex].split("-")[3];

              }else if(type == 2){
                  if(!prevueEpisode) return '';
                  var positTiveArray = prevueEpisode.split(",");
                  var lastIndex = positTiveArray.length-1
                  posterUrl = positTiveArray[lastIndex].split("-")[3];
              }else{
                  if(!featureEpisode) return '';
                  var positTiveArray = featureEpisode.split(",");
                  var lastIndex = positTiveArray.length-1
                  posterUrl = positTiveArray[lastIndex].split("-")[3];
              }
              return this.$parent.defaultUrl+posterUrl;
          },
          //主演
          videoStar:function(type,data){
              console.log(data)
              var episodeName = data.videoName;
              if(!data) return;
              if(type == 1){
                  var name = "";
                  var starData = data.toStar;//主演
                  var director = data.director;//导演
                  var aliasName = data.aliasName;//别名
                  var videoSynopsis = data.videoSynopsis;//视频简介
                  if(starData){

                      JSON.parse(starData).forEach(function(ele,index){
                          if(ele.fToStarName){
                              name = '主演：';
                              name +=ele.fToStarName+' ';
                          }
                      })

                  }
                  if(director){
                      name +=' 导演：'+director
                  }
                  if(aliasName){
                      name += ' 视频别名：（'+aliasName+')'
                  }
                  if(videoSynopsis){
                      name += ' 视频简介：'+videoSynopsis
                  }

                  return name;
              }else if(type == 2){
                   var prevueEpisode = data.prevueEpisode;//预告片
                  if(!prevueEpisode) return '';
                  var positTiveArray = prevueEpisode.split(",");
                  var lastIndex = positTiveArray.length-1
                  name = positTiveArray[lastIndex].split("-")[5];
                  if(!name){//如果为空，需要自己拼接名称
                      name = episodeName+' 预告片'
                  }else{
                      name = episodeName+'  预告片 '+name
                  }

                  return name;
              }else{
                  var featureEpisode = data.featureEpisode;//花絮
                  var positTiveArray = featureEpisode.split(",");
                  var lastIndex = positTiveArray.length-1
                  name = positTiveArray[lastIndex].split("-")[5];
                  if(!name){
                      name = episodeName+' 花絮';
                  }else{
                      name = episodeName+' 花絮 '+name
                  }
                  return name;
              }

          },
          imgAutoAdapt:function(e){

              MethodsUtil.imgAutoAdapt(e.target,true)
          }

      },
      computed:{


      },
      watch:{
          scrollTop:{
              handler:function(newVal,oldVal){
                  if(newVal>=800){
                      this.showGoTop = true;
                  }else{
                      this.showGoTop = false;
                  };
              }

              // immediate:true,
          }

      },
      filters: {

          //剧集标识
          videoTypeF:function(type,fDramaType,totalEpisode,updateEpisode){
              var brand;
              if (!type) return '';
              if(type==1){
                  //单部
                  if(fDramaType ==0){
                      brand = '';
                  }
                  //上下集
                  if(fDramaType ==1 && totalEpisode == updateEpisode){
                      brand = `上下集`;
                  }
                  if(fDramaType ==1 && totalEpisode > updateEpisode){
                      brand = `更新至上集`;
                  }
                  //上中下集
                  if(fDramaType ==2 && totalEpisode == updateEpisode){
                      brand = `上中下`;
                  }
                  if(fDramaType ==2 && updateEpisode == 2){
                      brand = `更新至下集`;
                  }
                  if(fDramaType ==2 && updateEpisode == 1){
                      brand = `更新至上集`;
                  }
                  //正片
                  if(fDramaType ==3 && totalEpisode == updateEpisode){
                      brand = `${totalEpisode}集全`;
                  }
                  if(fDramaType ==3 && totalEpisode > updateEpisode){
                      brand = `更新至第${updateEpisode}集`;
                  }



              }else if(type==2){
                  brand = '预告片';
              }else{
                  brand = '花絮';
              }
              return brand
          }


      },
      components: {
          SearchInput,
          Loading
      }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .indexVideo
    height 100%
  .firstLevel
    border-bottom: 6px solid #f2f2f2;
    padding-bottom: 6px;
    h1
      height:40px;
      line-height:40px;
      border-bottom:1px solid #f2f2f2;
      text-align: left;
      padding-left: 10px;
  .secLevelbox
    display: flex;
    flex-wrap: wrap;
    justify-content: stretch;
    .firstSecond
      width 84px
      height 30px
      line-height 30px
      background: #f7f7f7
      position relative
      margin: 6px 0 0 7px;
      .selectedWrap
        position: absolute;
        width: 100%;
        height: 100%;
        backgroud: rgba(61,155,233,0.6);
        display: none;
        background: rgba(61,155,233,0.1);
        right: 0;
    .selected
      .selectedWrap
        display: block;
  .searchConent
      position absolute
      top 40px
      width: 100%;
      bottom: 0;

      background: #fff;
      .banner
          width:100%;
          height:100px;
          background:#FE7A4A;
          img
            height 100%;
      .searchScroll
          .videoItem
             display flex;
             flex-wrap:wrap;
             justify-content: space-between;
            .videoitemLi
                width 158px
                padding-top: 5px;
                .itemTop
                    width 158px
                    height:90px;
                    overflow:hidden;
                    position: relative;
                    img
                      width: 100%;
                      height: 100%;
                      object-fit: cover;
                    .bottomBrandbox
                      position: absolute;
                      height: 30px;
                      width: 100%;
                      bottom: 0;
                      background linear-gradient(top,rgba(0,0,0,0),rgba(0,0,0,0.6))
                      .videoBrand
                        position: absolute;
                        color: #fff;
                        bottom: 5px;
                        right: 5px;

                    .category
                      position: absolute;
                      width: 58px;
                      height: 20px;
                      background: #3D9BE9;
                      top: 5px;
                      line-height: 20px;
                      font-size: 12px;
                      color: #fff;
                      border-top-right-radius: 4px;
                      border-bottom-right-radius: 4px;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                    .feeType
                      position: absolute;
                      width: 30px;
                      height: 18px;
                      background: #F92253;
                      color: #fff;
                      top: 5px;
                      right: 5px;
                      text-align: center;
                      line-height: 18px;
                      border-radius: 2px;
                      font-size: 12px;
                .itemBottom
                    .videoName
                        font-size 12px;
                        width 100%;
                        white-space nowrap;
                        text-overflow ellipsis;
                        overflow hidden;
                        margin-top 10px;
                        text-align: left;
                        padding-left: 5px;
                        color: #515151;
                    .actor
                      width 100%;
                      white-space nowrap;
                      text-overflow ellipsis;
                      overflow hidden;
                      text-align left;
                      color:#949494;
                      padding: 10px 0;
                      padding-left: 5px;
  .top70
      top:70px;
  .loading-wrapper
    height: 40px;
    line-height: 40px;
  .gotoTop
    width: 40px;
    height:40px;
    position: fixed;
    right:26px;
    bottom:45px;
    border-radius: 50%;
    background:#fff;
    z-index: 999;
    img
      height: 24px;
      width: 24px;
      position: absolute;
      left: 0;
      right: 0;
      bottom:0;
      top:0;
      margin:auto;


</style>
