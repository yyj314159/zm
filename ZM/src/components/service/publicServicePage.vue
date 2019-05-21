<template>
    <div>
        <div class="wrapCont">
            <div class="contList" id="contListH">
                <cube-scroll
                    ref="scroll"
                    :data="serviceList"
                    :options="options"
                    :scroll-events="['scroll']"
                    @scroll="onScrollHandle"
                    @pulling-up="onPullingUp"
                >
                    <div class="sBanner" v-if="showBanner"></div>
                    <div>
                        <a v-for="(i,index) in serviceList" :key="index" :href="i.fServiceWapUrl">
                            <div class="mainImg">
                                <img :src="i.fMainImage" alt="">
                            </div>
                            <div class="mainTxt">
                                <p class="" v-html="i.fServiceName"></p>
                                <div class="">
                                    <div class="">
                                        <span class="RMBicon">￥</span>
                                        <span class="sPrice">{{i.fServicePriceStr}}</span>
                                        <span class=""> / </span>
                                        <span v-if="i.fPayType != 2 ? true : false" class="sTime">{{i.fTake|checkTake}}</span>
                                        <span class="">{{i.fTakeType|checkTakeType}}</span>
                                    </div>
                                    <div class="sType">
                                        <span class="">{{i.fServiceType|checkServiceType}}</span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                    <template slot="pullup" slot-scope="propsa">
                        <div v-show="propsa.pullUpLoad">
                            <template>
                                <span v-if="showLoading">
                                    <Loading></Loading>
                                </span>
                                <!-- <span v-else>{{propsa.txt}}</span> -->
                                <div class="the-end" v-show="theEnd">╮(╯﹏╰)╭&nbsp;&nbsp;&nbsp;已经到底啦！</div>
                            </template>
                        </div>
                    </template>
                </cube-scroll>
            </div>
        </div>
        <!--回到顶部-->
        <div class="gotoTop" @click="scrollToTop" v-if="showGoTop">
            <img src="../../common/images/gotoTop.png" alt="">
        </div>
    </div>
</template>

<script>
import { Scroll } from "cube-ui";
import Loading from "../public/loading";
import eventBus from "../../common/js/eventBus"
export default {
    // name: "Service",
    // props:['serviceData','sKey'],//接收父组件的值
    // props:['sKey'],//接收父组件的值
    data() {
        return{
            serviceList : [],
            page: 1,
            showGoTop : false,      
            showLoading : true,
            serviceapiType:process.env.NODE_ENV,
            servicedefaultUrl:process.env.VUE_APP_BASE_API,
            theEnd : false,
            pullDownY : 0,
            serviceCont : 0,
            serviceDataLenth : null,
            showBanner : true,
            newObj : {}, //新传入的对象
            origin : true, //默认列表页加载
            filterPage : 1, //筛选条件翻页
        }
    },
    components: {
        Loading
    },
    filters: {
        checkTake (n) {
            let i;
            switch (n){
                case 1: 
                    i=""; 
                break;
                default: 
                    i=n; 
                break;
            };
            return i;
        },
        checkTakeType(key) {
            let k;
            switch (key) {
                case 1:
                    k="分钟";
                    break;
                case 2:
                    k="小时";
                    break;
                case 3:
                    k="天";
                    break;
                case 4:
                    k="月";
                    break;
                default:
                    k="项";
                    break;
            };
            return k;
        },
        checkServiceType(val) {
            let x;
            switch (val){
                 case 1: x="上门"; break;
                 case 2: x="到店"; break;
                 case 3: x="线上"; break;
                 case 4: x="电话"; break;
                 case 5: x="代办"; break;
                 default: break;
            };  
            return x;    
        },
    },
    methods: {
        onScrollHandle(pos){
            this.pullDownY = pos.y;
            if(this.pullDownY < -1000){
                this.showGoTop = true;
            }else{
                this.showGoTop = false; 
            }
        },
        getData:function(obj){
            // console.log("进入请求");
             if(this.serviceapiType=='development') {
                    var videoApi = '/services';
                }else{
                    var videoApi = '';
                }
            this.HttpCli.get(
                videoApi+"/service/webbuilder-api/search/searchService",
                obj
            ).then((res)=>{
                if(res.data.status == 0){
                    let data = res.data.data.content;
                    if(!data){
                        this.theEnd = false;
                        this.$emit("hidePrev",true);//给父组件传值
                        return;
                    }
                    if(res.data.data.count <= 4){
                       this.theEnd = false; 
                       this.$refs.scroll.disable();
                    }else{
                        this.$refs.scroll.enable();
                    }
                    this.serviceCont = res.data.data.count;
                    // console.log(data.length,'<<<<<<<<<<');
                    data && (this.serviceDataLenth += data.length);
                    console.log(this.serviceDataLenth,'$$$$$$$$$$');
                    // this.page++;
                    setTimeout(()=>{
                        this.serviceList.push(...data);
                    },600)
                }
            }).catch((err)=>{
                console.log(err);
            });
        },
        onPullingUp:function() {
            if (this.serviceDataLenth >=  this.serviceCont) {
                this.showLoading = false;
                this.theEnd = true;
                this.$refs.scroll.forceUpdate();
                this.$refs.scroll.refresh();
            }else{
                if(this.origin){
                    this.page++;
                    this.getData({pageSize:30,pageNow:this.page});
                }else{
                    this.filterPage++;
                    this.newObj.pageNow = this.filterPage;
                    this.getData(this.newObj);
                }
                
                this.$refs.scroll.forceUpdate();
                this.$refs.scroll.refresh();
            }
        },
        scrollToTop:function() {
            this.$refs.scroll.scrollTo(0, 0, 2000);
        }
    },
    mounted() {
        // sysFirstCategoryId
        // this.categoryId = this.$route.query.id
        eventBus.$off("sendServiceData");
        eventBus.$on("sendServiceData",(res)=>{//搜索关键字以及条件
            this.showBanner = false;
            document.getElementById("contListH").style.height = 473+'px';
            this.origin = false;
            res.pageSize = 30;
            res.pageNow = 1;
            res.keyword = this.$route.query.keyWord;
            this.serviceList = [];
            this.serviceDataLenth = null;
            // if(this.categoryId){
            //     console.log('@@@@@')
            //     res.sysFirstCategoryId = this.categoryId;
            // }else{
            //     console.log('*null*')
            //     res.sysFirstCategoryId = null;
            // }
            this.newObj = res;
            this.getData(this.newObj);
            // this.$emit("hidePrev",false);//给父组件传值
        })
        // if(this.sKey && !this.categoryId){//只搜索关键字
        if(this.$route.query.keyWord){//只搜索关键字
            this.showBanner = false;
            document.getElementById("contListH").style.height = 473+'px';     
            this.origin = false;      
            this.newObj.pageSize = 30;
            this.newObj.pageNow = this.filterPage;
            this.newObj.keyword = this.$route.query.keyWord;
            this.getData(this.newObj);
            // this.$emit("hidePrev",false);//给父组件传值
        }
        // else if(this.categoryId && !this.$route.query.keyWord){//只搜索类目
        // // }else if(this.categoryId && !this.sKey){//只搜索类目
        //     console.log("222222222222222222222222222222222222222")
        //     document.getElementById("contListH").style.height = 473+'px';           
        //     this.showBanner = false;
        //     this.getData({pageSize:30,pageNow:this.page,sysFirstCategoryId:this.categoryId})
        // // }else if(this.sKey && this.categoryId){//搜索关键字和类目
        // }
        // else if(this.$route.query.keyWord && this.categoryId){//搜索关键字和类目
        //     console.log("333333333333333333333333333333333333333")
        //     document.getElementById("contListH").style.height = 473+'px';           
        //     this.showBanner = false;
        //     this.getData({pageSize:30,pageNow:this.page,keyword:this.sKey,sysFirstCategoryId:this.categoryId})
        // }
        else{//默认进来列表页
            this.getData({pageSize:30,pageNow:this.page})
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
        },    
    },
    watch: {
        // serviceData : {
        //     handler(n,o) {
        //     },
        //     deep : true,
        //     immediate : true
        // }
    },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
$flex = flex
.wrapCont
    background #f7f7f7
    .contList
        height 528px
        .sBanner
            width 320px
            height 101px
            background url('common/images/product.jpg') 0 0 no-repeat
            background-size 100%
            margin 6px 0
        div
            a
                box-sizing border-box
                width 320px
                height 112px
                margin-bottom 6px
                padding @margin-bottom
                background #fff
                overflow hidden
                display $flex
                &:last-child
                    margin-bottom 0    
                .mainImg
                    width 100px
                    height @width
                    margin-right 10px
                    // flex-shrink 0
                    img 
                        width 100%
                        height @width
                        object-fit cover
                .mainTxt
                    width 198px
                    display $flex
                    flex-direction column
                    justify-content space-between
                    p
                        color #434343
                        text-align left 
                        font-size 12px
                        word-break break-all
                    > div
                        display $flex
                        align-items baseline
                        justify-content space-between
                        div
                            color #f63
                            span 
                                font-size 12px
                            .RMBicon
                                font-size 10px
                            .sPrice
                                font-size 14px
                                font-weight bold
                        .sType
                            color #949494 
.the-end
    height 40px       
    line-height @height 
    color #aeaeae     
    padding 0               
.gotoTop
    width 40px
    height @width
    background rgba(255,255,255,.6)
    position fixed
    right 8px
    bottom 15px
    border-radius 50%
    box-shadow 0 0 5px rgba(0,0,0,.2) 
    z-index 1
    > img 
        width 16px
        height 18px   
        position absolute
        left 0
        top 0
        right 0
        bottom 0  
        margin auto     
.spinner
    padding-bottom 20px

</style>

