<template>
<div class="searchResultBox">


    <Loading v-show="isLoading"></Loading>
    <cube-scroll
            ref="contentScroll"
            :data="searchResult">
<ul class="searchResultUl" v-show="searchCount > 0">
    <li v-for="item in searchResult">
        <!--正片-->
        <div class="episode border-video-bottom-1px" v-if="item.videoType == 1">
            <div class="poster">
                <img :src=videoposter(item.videoType,item.videoPoster,item.positiveEpisode,item.prevueEpisode,item.featureEpisode) alt="">
                <span class="categoryFirst">{{item.zumaFirstCategoryName}}</span>
                <span class="feeType" v-if="item.feeType == 2">付费</span>
            </div>
            <div class="episodeLeft" @click="goDetail(item.link,item.detailIds)">
                <p class="name" v-html="item.videoName"></p>
                <div class="update" v-if="item.fDramaType != 0"><p class="updateL">已更新至{{item.updateEpisode | updateType(item.fDramaType)}}集 | 共{{item.totalEpisode}}集</p><p class="updateR" v-if="item.totalEpisode == item.updateEpisode">{{item.totalEpisode
                | totalType(item.totalEpisode,item.fDramaType)}}</p></div>
                <div class="videoText" v-html="">
                    <p  :class=getClassName(item)  v-for="(item,index) in videotext(item.videoType,item)"><span class="label-l">{{labelName[item.split("index")[1]]}}：</span><span class="label-r">{{item.split("index")[0]}}</span></p>
                </div>
            </div>
            <div class="episodeNumBtnBox">
                <!--连续剧-->
                <ul class="episodeNumBtn" v-if="item.totalEpisode < 7 && item.fDramaType == 3" >

                    <li v-for="(itemdata,index) in formatterEpisodeBtn(item.updateEpisode,item.totalEpisode,item.fDramaType,item.prevueEpisode)"><a href="" class="btnurl">{{index+1}}</a><span class="brandPre" v-if="itemdata > item.updateEpisode">预</span><span class="brandNew" v-if="isLatest(itemdata,item.newsestEpisode)">新</span></li>

                </ul>

                <ul class="episodeNumBtn" v-else-if="item.totalEpisode >= 7 && item.fDramaType == 3">

                    <li v-for="(itemdata,index) in formatterEpisodeBtn(item.updateEpisode,item.totalEpisode,item.fDramaType,item.prevueEpisode)"><a href="" class="btnurl">{{itemdata}}</a><span class="brandPre" v-if="itemdata > item.updateEpisode">预</span><span class="brandNew" v-if="isLatest(itemdata,item.newsestEpisode)">新</span></li>

                </ul>
                <!--上中下、上下-->
                <ul class="episodeNumBtn" v-else-if="item.fDramaType == 2 || item.fDramaType == 1">

                    <li v-for="(item,index) in formatterEpisodeBtn(item.updateEpisode,item.totalEpisode,item.fDramaType,item.prevueEpisode)"><a href="" class="btnurl">{{item}}</a></li>

                </ul>
            </div>
        </div>
        <!--预告-->
        <div class="episode border-video-bottom-1px" v-if="item.videoType == 2 || item.videoType == 3">
            <div class="episodePre" @click="goDetail(item.link,item.detailIds)">
                <div class="episodePreL">
                    <img :src="posterF(item.videoType,item.featureEpisode,item.prevueEpisode)" alt="">
                    <span class="categoryFirst">{{item.zumaFirstCategoryName}}</span>
                </div>
                <div class="episodePreR">
                    <h1 class="title" v-html="titleF(item.videoType,item.videoName,item.featureEpisode,item.prevueEpisode)"></h1>
                </div>
            </div>

        </div>
        <!--花絮-->
       <!-- <div class="episode border-video-bottom-1px" v-if="item.videoType == 3">
        花絮
        </div>-->
    </li>
    
    
</ul>

</cube-scroll>
    <!--无数据-->
    <div class="searchDataNo" v-show="searchCount < 1">
        <img src="../../common/images/notVideo.jpg" alt="">
    </div>
</div>
</template>
<script>
    import axios from 'axios';
    import Loading from "../public/loading";
    import MethodsUtil from "../../common/js/MethodsUtil";
   import eventBus from "common/js/eventBus";
    import {formatterStar,formatterTime,formatteraliasName} from "./videoformatter.js"
    export default {
        props:{
            keyword:"",//搜索关键词
            firstCategory:""//类目id
        },
        data(){
            return {
                searchResult:[],//搜索结果
                searchCount:1,
                isLoading:true,

                labelName:["导演","主演","视频别名","上传时间","上传者"],
                className:["director","star","aliasName","videoCreateTime"]//动态添加类名
            }
        },
        mounted(){
            var searchData;
            this.getSearchResult({pageSize:10,pageNow:1,keyword:this.keyword})
            var _this = this;
            eventBus.$on("clearselectConditions",()=>{
                searchData = Object.assign({},{pageSize:10,pageNow:1,keyword:this.keyword},{})
            });
            eventBus.$on("selectConditions",(arg)=>{
                _this.searchResult = [];
                searchData = Object.assign({},{pageSize:10,pageNow:1,keyword:this.keyword},arg)
                _this.getSearchResult(searchData)
            })
        },
        methods:{
            getSearchResult(param){
                var _this = this;
                if(_this.$parent.$parent.apiType=='development') {
                    var videoApi = '/videoapi';
                }else{
                    var videoApi = '';
                }
                this.HttpCli.post(videoApi+'/video_web/search-api/searchVideo',param)
                    .then(function (response) {
                        _this.searchResult = _this.searchResult.concat(response.data.data.content);
                        _this.searchCount = response.data.data.count;
                        _this.isLoading=false

                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            getClassName(item){
                var index = item.split("index")[1]
                return   this.className[index];
            },
            goDetail:function(url,id){
                var detailId= id.split(",")[0];
                var url = url.replace("$DetailId",detailId);
                if(url){
                    window.location.href=url;
                }
            },
            //视频类型  1.正片 2.预告片 3.花絮   (多集、单集、上下集、上中下集)
            //视频预览图 1.positiveEpisode(正片)2.prevueEpisode(预告片)3.featureEpisode（花絮）
            //海报
            videoposter: function (type,videoPoster,positiveEpisode,prevueEpisode,featureEpisode) {
                //有无缩略图
                var posterUrl;
                if (!type) return '';
                if (type == 1) {
                    if(videoPoster){
                        posterUrl = videoPoster;
                    }else{
                        if (!positiveEpisode) return '';
                        var positTiveArray = positiveEpisode.split(",");
                        var lastIndex = positTiveArray.length - 1
                        posterUrl = positTiveArray[lastIndex].split("-")[3];
                    }


                } else if (type == 2) {
                    if (!prevueEpisode) return '';
                    var positTiveArray = prevueEpisode.split(",");
                    var lastIndex = positTiveArray.length - 1
                    posterUrl = positTiveArray[lastIndex].split("-")[3];
                } else {
                    if (!featureEpisode) return '';
                    var positTiveArray = featureEpisode.split(",");
                    var lastIndex = positTiveArray.length - 1
                    posterUrl = positTiveArray[lastIndex].split("-")[3];
                }
                return this.$parent.$parent.defaultUrl + posterUrl;
            },
            formatterEpisodeBtn(update,total,type,preepisode){
                var updateEpisode = new Array;
                var totalEpisode = new Array;
                var preEpisode = new Array;//预告片数组
                if(preepisode){
                    var positTiveArray = preepisode.split(",");
                    positTiveArray.forEach(function(item,index){
                        preEpisode.push(Number(item.split("-")[1]))
                    })

                    console.log(preEpisode)
                }
                var btnNum;
                //正片
                if(type==3){
                    if(total < 7){
                        updateEpisode.length = update;
                        return updateEpisode;
                    }else{//总集数大于6集
                        updateEpisode.length = 6;
                        if(update>6){
                            updateEpisode[0] = 1;
                            updateEpisode[1] = 2;
                            updateEpisode[2] = update-3;
                            updateEpisode[3] = update-2;
                            updateEpisode[4] = update-1;
                            updateEpisode[5] = update;
                        }else{
                            updateEpisode.length = update;
                            for(var i=0; i<updateEpisode.length; i++){
                                updateEpisode[i] = i+1
                            }
                        }
                    }
                    //正片与预告片数组合并去重
                    var newpreEpisode = [];//删掉预告片小于更新集数的正片
                    var res = [];//存放去重后的数组
                    preEpisode.forEach(function (item,index) {
                        if(item > update){
                            newpreEpisode.push(item);
                        }

                    })
                    var newEpisodeArray = updateEpisode.concat(newpreEpisode);//正片和花絮合并后的数组
                    //去重
                    for(var i = 0;i<newEpisodeArray.length;i++){
                        for(var j=0;j<res.length;j++){
                            if(res[j] == newEpisodeArray[i]){
                                break;
                            }
                        }
                        if(j == res.length){
                             res.push(newEpisodeArray[i])
                        }

                    }
                    //操作后的数组（正片和预告片最大集数6集）
                    if(res.length >=6){
                        var maxNumArray = [];
                        var maxNumF = function(n){
                            //递归找出数组中最大的4个数
                            if(n < 4){
                                    var maxItem = Math.max.apply(null,res);
                                    maxNumArray.push(maxItem);
                                    var arrIndex = res.indexOf(maxItem)
                                    res.splice(arrIndex,1)
                                    maxNumF(maxNumArray.length);
                            }
                        }
                        //重新排序
                        var sortNumber = function (a,b) {
                            return a - b;
                        }
                        maxNumF(maxNumArray.length);
                        updateEpisode=[1,"全部"].concat(maxNumArray.sort(sortNumber));
                    }else{
                        updateEpisode=res
                    }


                }
            //上中下集
                if(type==2){
                    if(update == 1){
                        updateEpisode[0] = "上";
                    }else if(update == 2){
                        updateEpisode[0] = "上";
                        updateEpisode[1] = "中";
                    }else{
                        updateEpisode[0] = "上";
                        updateEpisode[1] = "中";
                        updateEpisode[2] = "下";
                    }

                }
            //上下集
                if(type==1){
                    if(update == 1){
                        updateEpisode[0] = "上";
                    }else{
                        updateEpisode[0] = "上";
                        updateEpisode[1] = "下";
                    }
                }
                return updateEpisode;
            }, //是否是最近7天00
            isLatest:function(num,data){//剧集的数字，如果num
                var newEpisodeIndexArray = [];
                if(data){
                    var newEpisodeArray = data.split(",");
                    for(var i = 0; i<newEpisodeArray.length;i++){
                        newEpisodeIndexArray.push(newEpisodeArray[i].split("-")[1]);
                    }
                    //如果num 等于 newEpisodeIndexArray里的值，返回true
                    for(var j=0;j<newEpisodeIndexArray.length;j++){
                        if(num == newEpisodeIndexArray[j]){
                            return true;
                        }
                    }
                }

                console.log(newEpisodeIndexArray)
            },
            videotext:function(type,data){
                if(type && type == 1){
                    var director = data.director;//导演
                    var star= data.toStar;//主演
                    var aliasName = data.aliasName;//视频别名
                    var videoCreateTime = data.videoCreateTime;//创建时间
                    var shopName = data.shopName;//上传者
                    var videoTextArray = [];
                    var obj = {};
                        obj.director = director;
                        obj.star = formatterStar(star);
                        obj.aliasName = formatteraliasName(aliasName);
                        obj.videoCreateTime = formatterTime(videoCreateTime);
                        obj.shopName = shopName;
                       Object.keys(obj).forEach(function(key,index){
                            if(obj[key] && videoTextArray.length <3)
                                videoTextArray.push(obj[key]+"index"+index)
                        })
                    return videoTextArray;

                }
            },
            imgAutoAdapt:function(e){
                MethodsUtil.imgAutoAdapt(e.target,true)
            },//预告片和花絮名字
            titleF:function(type,name,featureEpisode,prevueEpisode){
                var title = "";
                if(type == 2){
                    var preName = prevueEpisode.split("-")[5];
                    if(preName){
                        title='《'+name+'》 预告片-'+preName;
                    }else{
                        title='《'+name+'》 预告片';
                    }

                }
                if(type == 3){

                    var feaName = featureEpisode.split("-")[5];
                    if(feaName){
                        title='《'+name+'》 花絮-'+feaName;
                    }else{
                        title='《'+name+'》 花絮';
                    }

                }
                return title;
            },//预告片和花絮预览图
            posterF:function(type,featureEpisode,prevueEpisode){
                var preImgUrl = "";
                if(type == 2){
                    var preImg = prevueEpisode.split("-")[3];
                    if(preImg){
                        preImgUrl = preImg;
                    }

                }
                if(type == 3){
                    var feaImg = featureEpisode.split("-")[3];
                    if(feaImg){
                        preImgUrl = feaImg;
                    }

                }
                return this.$parent.$parent.defaultUrl+preImgUrl;
            }

        },
        filters:{
            updateType:function(update,type){

                var updateNow;
                if(type == 1){
                    if(update==1){
                        updateNow = "上";
                    }else{
                        updateNow = "下";
                    }
                }
                if(type == 2){
                    if(update==1){
                        updateNow = "上";
                    }else if(update==2){
                        updateNow = "中";
                    }else{
                        updateNow = "下";
                    }
                }
                if(type == 3){
                    updateNow = update;
                }
                return updateNow;

            },
            totalType:function(update,total,type){
                var totalNow;
                if(type == 1){
                    if(update==1){
                        totalNow = "更新至第上集";
                    }else{
                        totalNow = "上下集";
                    }
                }
                if(type == 2){
                    if(update==1){
                        totalNow = "更新至第上集";
                    }else if(update==2){
                        totalNow = "更新至第中集";
                    }else{
                        totalNow = "上中下";
                    }
                }
                if(type==3){
                    totalNow = total+"集全";
                }
                return totalNow;

            }
        },
        components:{
            Loading
        }


    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .searchResultBox
        position: absolute;
        top: 95px;
        bottom: 0;
        width: 100%;
        overflow: hidden;
    .searchResultUl
        background #fff;

        li
         padding: 10px;


    .episode

        .poster
            width 90px;
            height 135px;
            overflow hidden
            position: absolute;
            img
              width: 100%;
              height: 100%;
              object-fit: cover;
        .episodeLeft
            height: 135px;
            padding-left: 100px;
            text-align: left;
            .name
                font-size: 0.4375rem;
                color: #3089d5;
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                padding-bottom: 10px;
            .update
                color:#A1A1A1;
                .updateL
                    margin-right:10px;
                p
                    display inline-block
                    height 25px;
                    line-height 25px;
    .videoText
       p
        width 200px;
        padding 5px 0
        overflow hidden;
        text-overflow ellipsis;
        white-space nowrap;
        .label-l
            color:#A1A1A1;
        .label-r
            color:#797979;
    .episodeNumBtnBox
        .episodeNumBtn
            display: flex;
            justify-content: flex-start;
            padding-top 10px;
            li
              position relative;
              width 40px;
              height 40px;
              padding: 0;
              background #f2f2f2;
              display: flex;
              justify-content: center;
              align-items: center;
              margin-right 11.5px;
              &:last-child
                  margin-right 0px;

    .episodePre
        .episodePreL
            width: 2.8125rem;
            height: 1.5625rem;
            overflow: hidden;
            position: absolute;
            left: 10px;
           img
             width: 100%;
             height: 100%;
             object-fit cover;
        .episodePreR
            width 100%;
            height 50px;
            padding-left 100px;
            .title
                text-align left;
                height 29px;
                font-size 14px;
                color #3089D5;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;

    .brandPre
        position: absolute;
        top: 0;
        right: 0;
        width: 15px;
        height: 15px;
        background: #FF6633;
        color: #fff;
        display: inline-block;
        line-height: 16px;
        border-radius: 2px;
    .brandPre:before
        position: absolute;
        bottom: -3px;
        left: 0px;
        content:"";
        width: 0;
        height: 0;
        border-right: 4px solid transparent;
        border-left: 4px solid transparent;
        border-top: 4px solid #f63;
    .brandNew
        position: absolute;
        top: 0;
        right: 0;
        width: 15px;
        height: 15px;
        background: #2E8DED;
        color: #fff;
        display: inline-block;
        line-height: 16px;
        border-radius: 2px;
    .brandNew:before
        position: absolute;
        bottom: -3px;
        left: 0px;
        content:"";
        width: 0;
        height: 0;
        border-right: 4px solid transparent;
        border-left: 4px solid transparent;
        border-top: 4px solid #2E8DED;
    .categoryFirst
        width: 1.8125rem;
        height: 0.625rem;
        background: #3d9be9;
        position: absolute;
        top: 0.15625rem;
        left: 0;
        line-height: 0.625rem;
        color: #fff;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
    .feeType
        position: absolute;
        width: 30px;
        height: 18px;
        background: #F92253;
        color: #fff;
        bottom: 5px;
        right: 5px;
        text-align: center;
        line-height: 18px;
        border-radius: 2px;
        font-size: 12px;
    .border-video-bottom-1px
    &::after
        border-bottom: 1PX solid #f2f2f2
        left: 0
        bottom: 0
        width: 100%
        transform-origin: 0 bottom;
        padding-bottom: 10px;
    em
     font-style normal;
    .searchDataNo
        position: absolute;
        top: 0px;
        bottom: 0;
        width: 100%;
        overflow: hidden;

        img
           width 100%;
</style>