<template>
    <div class="commonSearch">
        <!--搜索后的-->
        <div class="searchEnd" v-if="true">
            <i class="back" @click="back"></i>
            <div class="searchEndCategoryText"><slot name="end"><span>{{searchType}}</span></slot></div>
            <div class="defaultStyle" @click="show_nav = !show_nav">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <PublicNav v-if="show_nav" :navList="navList"></PublicNav>
        </div>
        <!--搜索前的结构-->
        <div class="searchBefore" id="noRight">

            <i class="back" v-if="false"></i>

            <div class="searchCategoryText"

                 v-if="!isfocus"><slot name="before"></slot></div>
            <div class="searchBox focusWidth">
                <i class="searchIcon"></i>
                <input  class="searchInput"
                        @focus="handleFocus"

                        @blur="handleBlur"
                        :placeholder="$route.query.keyWord"
                        :comKeywords = "keyWord"
                        type="text">
            </div>
            <!-- 专辑没有右侧筛选按钮 -->
            <div class="search-right" v-if="searchType!='搜专辑'">
                <!--筛选-->
                <div class="filterBtn" v-if="true" @click="show=!show">
                    <i></i>
                    筛选
                </div>
            </div>
        </div>
        <!--切换类别-->
        <div class="switchCategory">
            <div class="left">在<span>“{{formaterType().slice(1,formaterType().length)}}”</span>下的搜索信息</div>
            <div class="right" @click="switchFunction" :class="{'switchActive':isActive}">切换类别<span class="iconDown"></span></div>
            <div class="drownList" v-show="isActive">
                <ul>

                    <li  v-for="(route,n) in searchRoutes"   @click="search(route.route)">
                        <span>{{route.name}}</span>
                        <span class="iconRight"></span>
                    </li>

                </ul>
            </div>
        </div>
        <transition name="slide">

            <div class="slide-box" v-show="show">
                <div class="broadside">
                    <div class="filterSide" >
                        <div class="head"><p class="headText" >筛选条件</p><span class="clearData" @click="clearSelected">清空</span></div>
                        <p class="line"></p>
                        <div class="content">
                          <!--  <cube-scroll
                                    ref="scroll">-->

                                <component v-bind:is="componentFilter" ref="childFilter"></component>
                           <!-- </cube-scroll>-->
                        </div>
                        <div class="footer">
                            <cube-button :light="true" @click="cancel">取消</cube-button>
                            <cube-button :light="true" @click="confirm">确认</cube-button>
                        </div>
                    </div>
                    <!--选择城市-->
                    <transition name="rightIn">
                        <chooseCity v-if="choose_city" class="pick-city" @isShowCity="chooseCity"></chooseCity>
                    </transition>
                    <!-- 音频选择 -->
                    <transition name="rightIn">
                        <chooseAudio v-if="choose_audio"></chooseAudio>
                    </transition>
                </div>
            </div>
        </transition>
        <div class="wrap" :class={activewrapper:show} v-if="show"></div>
        <div class="drownWrap" v-show="isActive"></div>
        <!--动态组件-->
        <component v-bind:is="componentFile" :keyword="keyWord" :firstCategory = "firstCategoryId"></component>

    </div>

</template>
<script>
    import axios from 'axios';
    import chooseCity from "../public/chooseCity";
    import chooseAudio from "@/components/audio/chooseAudio"
    import PublicNav from "./publicNav"
    import eventBus from "common/js/eventBus"
    import {mapGetters} from "vuex"
    export default {
        name:'searchResult',
        components:{
            chooseCity,
            chooseAudio,
            PublicNav
        },
        data(){
            const componentFile = this.render;
            const componentFilter = this.filterrender;
            return {
                inputValue: this.$route.query.keyWord,//搜索内容
                firstCateGoryName:this.$route.query.keyWord,
                searchRoutes: [
                    { route: "P", name: "产品" },
                    { route: "S", name: "服务" },
                   { route: "V", name: "视频" },
                    { route: "AUDIO", name: "音频" },
                    { route: "ALBUM", name: "专辑" },
                    { route: "CREATOR", name: "创作人" },
                    { route: "N", name: "新闻" },
                    { route: "B", name: "博客" },
                    { route: "WEBSITE", name: "模板" },
                ],
                isfocus:false,//是否聚焦
                ifsearch:false,
                show: false,
                isActive:false,
                componentFile: componentFile,
                componentFilter: componentFilter,
                searchType:this.formaterType(),
                componentPath:'',
                componentfilterPath:"",
                keyWord:this.$route.query.keyWord,
                firstCategoryId:this.$route.query.id,
                show_nav:false,
                navList:[]
            }
        },
        created(){
            this.computedPath();
            this.computedfilterPath();
        },
        mounted(){


            let _this = this;
            document.addEventListener("click",function(e){
                let ele = document.querySelector(".defaultStyle");
                if(!ele.contains(e.target)){
                    _this.show_nav = false;
                }
            });
        },
        destroyed(){
            document.removeEventListener("click",()=>{});
        },
        methods:{
            render(){
                this.componentFile =  (resolve) => ({
                    component: import(`components/${this.componentPath}`),
                    loading:{ template: '<div style="height: 100%; width: 100%; display: table;"><div style="display: table-cell; vertical-align: middle; text-align: center;"><div>加载错误</div></div></div>' },
                    error:  { template: '<div style="height: 100%; width: 100%; display: table;"><div style="display: table-cell; vertical-align: middle; text-align: center;"><div>加载错误</div></div></div>' },
                    delay: 1000,
                    timeout: 10000
                });
            },
            filterrender(){
                this.componentFilter =  (resolve) => ({
                    component: import(`components/${this.componentfilterPath}`),
                    loading:{ template: '<div style="height: 100%; width: 100%; display: table;"><div style="display: table-cell; vertical-align: middle; text-align: center;"><div>加载错误</div></div></div>' },
                    error:  { template: '<div style="height: 100%; width: 100%; display: table;"><div style="display: table-cell; vertical-align: middle; text-align: center;"><div>加载错误</div></div></div>' },
                    delay: 1000,
                    timeout: 10000
                });
            },
            handleFocus(event){
                let queryParams = {};
                queryParams.searchType = this.$route.query.searchType;
                queryParams.value =  this.$route.query.keyWord;
                this.$router.push({name:"searchIndex",query:queryParams});
                //传给searchINDEX.VUE
                eventBus.$emit("inputValue",this.keyWord);

                this.isfocus = true;


            },
            handleBlur(event){
                this.$emit('on-blur', event);
                /* this.isfocus = false;*/
            },
            searchData(){
                this.ifsearch = true;
                this.$emit('on-search', event)

            },
            clearSelected(){     //清空
                this.$refs.childFilter.clearAll();
            },
            cancel(){           //取消
                this.show = false;      //关闭弹窗
            },
            confirm(){          //确认
                this.$refs.childFilter.defineSearch();
                this.show = false;
                this.$emit('on-confirm', event);
            },
            back(){
                this.$emit('on-back', event);
                history.back()
            },
            computedPath(){
                var componentType = this.$route.query.searchType;

                switch (componentType){
                    case 'V':
                        this.componentPath = 'video/searchResultVideo.vue';
                        break;
                    case 'P':
                        this.componentPath = 'product/searchResultProduct.vue';
                        break;
                    case 'S':
                        this.componentPath = 'service/searchResultService.vue';
                        break;
                    case 'B':
                        this.componentPath = 'information/searchResultBlog.vue';
                        break;
                    case 'N':
                        this.componentPath = 'information/searchResultNews.vue';
                        break;
                    case 'AUDIO':
                        this.componentPath = 'audio/searchResultAudio.vue';
                        break;
                    case 'ALBUM':
                        this.componentPath = 'audio/searchResultAlbum.vue';
                        break;
                    case 'CREATOR':
                        this.componentPath = 'audio/searchResultCreator.vue';
                        break;
                    case 'WEBSITE':
                        this.componentPath = 'website/searchResultWebsite.vue';
                        break;
                }
            },
            computedfilterPath(){
                var componentType = this.$route.query.searchType;
                switch (componentType){
                    case 'V':
                        this.componentfilterPath = 'video/searchFilterVideo.vue';
                        this.navList = [{iconSrc:'/img/myVideo.png',navTitle:'我的看单',href: '/video_wap/videoViewMobile/videolist'}];
                        break;
                    case 'P':
                        this.componentfilterPath = 'product/searchFilterProduct.vue';
                        this.navList = [
                                {iconSrc:'/img/shopCar.png',navTitle:'购物车',href: '/product_wap/cart/toGetShopCart'},
                                {iconSrc:'/img/productOrder.png',navTitle:'产品订单',href: '/wap/pOrder_wap/orderInfo/toOrderList?status=0'},
                                {iconSrc:'/img/productBargain.png',navTitle:'产品议价单',href: '/bargin_wap/wap/bargin/toWapBarginList?fType=1'}
                            ];
                        break;
                    case 'S':
                        this.componentfilterPath = 'service/searchFilterService.vue';
                        this.navList = [
                            {iconSrc:'/img/serviceOrder.png',navTitle:'服务订单',href: '/wap/sorder_wap/serviceOrder/list?state=0'},
                            {iconSrc:'/img/serviceBargain.png',navTitle:'服务议价单',href: '/bargin_wap/wap/bargin/toWapBarginList?fType=2'}
                        ];
                        break;
                    case 'B':
                        this.componentfilterPath = 'information/searchFilterBlog.vue';
                        break;
                    case 'N':
                        this.componentfilterPath = 'information/searchFilterNews.vue';
                        break;
                    case 'AUDIO':
                        this.componentfilterPath = 'audio/searchFilterAudio.vue';
                        this.navList = [{iconSrc:'/img/mySong.png',navTitle:'我的歌单',href: '/audio_wap/mobileAudioPlayer/mobilePlayer#!/audio/songSheet/list'}];
                        break;
                    case 'ALBUM':
                        this.componentfilterPath = 'audio/searchFilterAlbum.vue';
                        this.navList = [{iconSrc:'/img/mySong.png',navTitle:'我的歌单',href: '/audio_wap/mobileAudioPlayer/mobilePlayer#!/audio/songSheet/list'}];
                        break;
                    case 'CREATOR':
                        this.componentfilterPath = 'audio/searchFilterCreator.vue';
                        this.navList = [{iconSrc:'/img/mySong.png',navTitle:'我的歌单',href: '/audio_wap/mobileAudioPlayer/mobilePlayer#!/audio/songSheet/list'}];
                        break;
                    case 'WEBSITE':
                        this.componentfilterPath = 'website/searchFilterWebsite.vue';
                        this.navList = [
                            {iconSrc:'/img/shopCar.png',navTitle:'购物车',href: '/product_wap/cart/toGetShopCart'},
                            ];
                        break;
                }
            },
            search(type){
                let route = '';
                switch (type) {
                    case 'P': route = '/searchResult?searchType=P'; break;
                    case 'S': route = '/searchResult?searchType=S'; break;
                    case 'V': route = '/searchResult?searchType=V'; break;
                    case 'AUDIO': route = '/searchResult?searchType=AUDIO'; break;
                     case 'ALBUM': route = '/searchResult?searchType=ALBUM'; break;
                      case 'CREATOR': route = '/searchResult?searchType=CREATOR'; break;
                    case 'N': route = '/searchResult?searchType=N'; break;
                    case 'B': route = '/searchResult?searchType=B'; break;
                    default: route = '/'; break;
                }
                this.$router.push({ path: route,query:{keyWord:this.keyWord}});
                // , query:{id:this.firstCateGoryID}
            },

            switchFunction(){
                this.isActive = !this.isActive;
            },
            chooseCity(arg,address,n){
                console.log(arg,address,n)
                let addressStr;
                if(n && address){
                    switch (n) {
                        case 2 :addressStr = address.fProvince +'-' + address.fCity;break;  //只有省市
                        case 3 :addressStr = address.fProvince +'-' + address.fCity + '-' + address.fDistrict;break;   //只有省市区
                        case 4 :addressStr = address.fProvince +'-' + address.fCity + '-' + address.fDistrict + '-' + address.fStreet;    //省市区街道都有
                    }
                    this.$store.dispatch('SHOW_CHOOSE_CITY',{chooseCity:arg,address:addressStr});
                }else{
                    this.$store.dispatch('SHOW_CHOOSE_CITY',{chooseCity:arg,address:this.address});
                }


            },
            formaterType(){
                var type = this.$route.query.searchType;
                switch (type){
                    case "V":
                        type = "搜视频"
                        break;
                    case "P":
                        type = "搜商品"
                        break;
                    case "S":
                        type = "搜服务"
                        break;
                    case "WEBSITE":
                        type = "搜模板"
                        break;
                    case "ALBUM":
                        type = "搜专辑"
                        break;
                    case "CREATOR":
                        type = "搜创作人"
                        break;
                    case "AUDIO":
                        type = "搜音频"
                        break;
                    case "B":
                        type = "搜博客"
                        break;
                    case "N":
                        type = "搜新闻"
                        break;
                }
                return type;
            }

        },
        watch:{
            $route(){
                this.computedPath();
                this.computedfilterPath();
                this.render();
                this.filterrender()
                this.isActive = false;
                this.searchType = this.formaterType()
            },
            '$route.query'(newv,oldv){//处理keep-alive的组件被复用，搜索的关键词还是第一次的，简单处理监听路由参数赋值关键词 也可以在app组件设置不缓存等
                this.keyWord = newv.keyWord
            }
        },
        computed:{
            ...mapGetters([
                "choose_city",
                "address",
                "choose_audio"
            ]),
        }
    }
</script>


<style lang="stylus" rel="stylesheet/stylus" scoped>

    .commonSearch
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #fff;
        z-index: 10;
    .searchEnd
        display flex;
        align-items: center;
        height:30px;
        .back
            display inline-block;
            width 10px;
            height:14px;
            background:url('common/images/gobackpng.png') no-repeat;
            background-size cover;
            margin-left: 10px;
        .defaultStyle  span
            display:inline-block;
            width 4px;
            height:4px;
            margin:0 2px;
            border-radius:50%;
            background:#ccc;
        .searchEndCategoryText span
            display:inline-block
            font-size:14px
            width: 258px;
            font-weight: bold;

            color:#5E5E5E;
    .searchBefore
        display flex;
        align-items: center;
        height:40px;
        border-bottom:1px solid #f2f2f2;
        .back
            display inline-block;
            width 10px;
            height:14px;
            background:url('common/images/gobackpng.png') no-repeat;
            background-size cover;
            margin-left: 10px;
        .searchCategoryText span
            font-size 14px;
            font-weight bold;
            color:#5E5E5E;
            margin:0 8px;
        .focusWidth
            width 240px !important;
            margin-left:10px;
            border-radius:53px !important;
            .searchInput
                border-radius:53px !important;
        .searchBox
            width 185px;
            height:26px;
            line-height 26px;
            padding-left 5px;
            background:#f2f2f2;
            display: flex;
            align-items: center;

            .searchIcon
                display inline-block;
                width 18px;
                height:14px;
                background:url('common/images/searchIcon.png') no-repeat;
                background-size cover;
            .searchInput
                padding-left:5px;
                width 100%;
                height:100%;
                background:#f2f2f2;
                outline: none;
        .search-right
            width:50px;

        .defaultStyle
            span
                display:inline-block;
                width 4px;
                height:4px;
                margin:0 2px;
                border-radius:50%;
                background:#ccc;
        .filterBtn
            i
                display inline-block
                width 13px
                height 13px;
                background:url('common/images/filterIcon.png') no-repeat
                background-size cover
        .defaultText
            span

                color:#3D9BE9;
    .wrap
        position: fixed;
        width: 100%;
        top: 0;
        bottom:0
        background: rgba(0,0,0,.6);
        z-index: 6;

    .broadside
        position: fixed;
        width: 280px;
        top: 0;
        right:0;
        bottom 0;
        background: #fff;

        .filterSide
            background: #fff;
            .head
                height: 50px;
                line-height: 50px;
                position: relative;
                .headText
                    font-size 12px
                    font-weight bold

                .clearData
                    position: absolute
                    top:0
                    right:10px
                    color:#3992DB
            .line
                width 100%;
                height 6px;
                background #f2f2f2;
            .content
                position: absolute;
                top: 56px;
                bottom: 40px;
                overflow: auto;


            .footer
                display flex
                position: absolute;
                width: 100%;
                bottom: 0;
                button
                    height 40px;
                    line-height:40px;
                    padding:0 0.5rem;
                    font-size 12px;
                    &:nth-child(2)
                        color:#fff;
                        background linear-gradient(left,#3D9BE9, #5ECCE0)

    .slide-enter-active, .slide-leave-active
        transition: all 1s
    .slide-enter, .slide-leave-to
        transform: translate3d(100%, 0, 0)
    .slide-box
        position: absolute;
        width: 100%;
        top: 0;
        bottom: 0;
        z-index: 10;
    .switchCategory
        height:25px;
        line-height:25px;
        background: #f2f2f2;
        position:relative;
    .left
        float:left;
        margin-left: 10px;
        color:#AEAEAE;
    .right
        position :relative;
        float:right;
        margin-right: 20px;
    .switchActive
        color:#3D9BE9;
        .iconDown
            transition: all 0.5s;
            transform: rotate(180deg);
            border-top: 4px solid #3D9BE9;
    .iconDown
        width: 0;
        height: 0;
        border-right: 4px solid transparent;
        border-left: 4px solid transparent;
        border-top: 4px solid #5e5e5e;
        position: absolute;
        top: 11px;
        right: -12px;
        transition: all 0.5s;
        transform: rotate(0deg);
    .iconRight
        width:0;
        height:0;
        border-top:4px solid transparent;
        border-bottom:4px solid transparent;
        border-left:4px solid #5e5e5e;
        position: absolute;
        right: 10px;
        top: 13px;
    .drownList
        position: absolute;
        top: 25px;
        width 100%;
        background: #fff;
        z-index:6;

        li
            position relative;
            text-align:left;
            padding: 5px 10px;
            border-bottom:1px solid #f2f2f2;

    .drownWrap
        position: absolute;
        width: 100%;
        top: 95px;
        bottom: 0;
        background: rgba(0,0,0,.6);
        z-index: 5;

    /*选择城市动画*/
    .rightIn-enter-active{
        animation: 0.5s rightIn ease;
    }
    .rightIn-leave-active{
        animation: 0.5s rightOut ease;
    }
    @keyframes rightIn {
        0%{
            right:-100%
        }
        100%{
            right: 0;
        }
    }
    @keyframes rightOut {
        0%{
            right:0
        }
        100%{
            right: -100%;
        }
    }
    /*专辑没有筛选条件样式调整 */
    #noRight{
        .focusWidth{
            width :100%!important;
            margin 0 10px!important;

        }
        .search-right{
            width 54px!important;
            margin-right:10px!important;
        }
    }
</style>