<template>
   <div>
        <div class="templateList on" ref='viewBox' v-if="isDataShow" >
            <cube-scroll ref="contentScroll" :scroll-events="['scroll']" @scroll="scroll"    :data='items' :options="options" @pulling-down="onPullingDown" @pulling-up="onPullingUp">
                <ul>
                    <li class='templateCon' v-for='item in items' :key="item.id">
                        <a class='imgBox' :href="'/mobview.zuma.com/pre/'+item.fId+'type=template&version='+item.fVersion">
                            <img v-bind:src="item.fUrl2" alt="" @load="imgAutoAdapt">
                        </a>
                        <p><a class='t-name' :href="'/mobview.zuma.com/pre/'+item.fId+'type=template&version='+item.fVersion">{{item.fName}}</a></p>
                        <p class='abc'>
                            <span class="t-price">免费</span>
                            <a :href="'/mobview.zuma.com/pre/'+item.fId+'type=template&version='+item.fVersion" class="t-look">预览</a>
                        </p>
                    </li>
                </ul>
                <template slot="pulldown" slot-scope="props">
                    <div v-if="props.pullDownRefresh"
                        class="cube-pulldown-wrapper"
                        :style="props.pullDownStyle">
                        <div v-if="props.beforePullDown"
                        class="before-trigger"
                        :style="{paddingTop: props.bubbleY + 'px'}">
                        <span :class="{rotate: props.bubbleY > 0}"></span>
                        </div>
                        <div class="after-trigger">
                        <div v-show="props.isPullingDown" class="">
                            <Loading></Loading>
                        </div>
                        </div>
                    </div>
                </template>
                <template slot="pullup" slot-scope="props">
                    <div v-if="props.pullUpLoad"
                    class="before-trigger"
                    :style="{paddingTop: props.bubbleY + 'px'}">
                    <span :class="{rotate: props.bubbleY > 0}"></span>
                    </div>
                    <div class="after-trigger">
                        <div v-show="props.pullUpLoad" class="">
                            <template>
                                <div v-if='dataNone' class="isDataNone">╮(╯﹏╰）╭&nbsp;&nbsp;已经到底了</div>
                                <div v-else>
                                    <Loading></Loading>
                                </div>
                            </template>
                        </div>
                    </div>
                </template>
            </cube-scroll>
        </div>
        <Loading v-show="isNodata==false&&isDataShow==false"></Loading>
        <div class="noneData" v-show="isNodata">
            <img src="../../common/images/notTemplate.jpg" alt="">
        </div>
        <div class='backTop' v-show='isTop' @click='onBackTop'></div>
        <Classify v-show="classifyState.isClassify"></Classify>
   </div>
</template>
<script>
    import Loading from "../public/loading";
    import Classify from "./classify";
    import MethodsUtil from "../../common/js/MethodsUtil";
    import communication from './communication';
    import {mapState, mapGetters, mapMutations} from 'vuex'
    export default {
        components:{
            Loading,
            Classify
        },
         data(){
            return{
                isNodata:false,
                items:[], //模板列表.
                isShowNone:true,
                options: {
                    pullDownRefresh: {threshold: 0},
                    pullUpLoad: {threshold: 0}},
                pageNow:1,
                pageSize:10,
                scrollTopVal:0,
                isTop:false,//是否显示回到顶部
                dataNone:false,//是否显示已经到底
                isDataShow:false,//是否有数据
                // keyWord:this.$route.query.keyWord,//路由取搜索关键字 
                isPullUp:true,//下拉是否添加数据
                largeName:'',//模板大类
                smallName:'',//模板小类
                
            }
        },
        props:['keyword'],
        methods:{
            scroll:function(dis){
                this.scrollTopVal = -dis.y;
            },
            onBackTop:function(){
                this.$refs.contentScroll.scrollTo(0, 0, 1000);
            },
            onPullingUp() {
                if(this.isPullUp){
                    this.pageNow++;
                    setTimeout(() => {
                        this.getData(this.pageNow,this.pageSize,true,this.keyword,this.largeName,this.smallName);
                    }, 1000)
                    this.$refs.contentScroll.refresh();
                }else{
                    this.$refs.contentScroll.forceUpdate();
                }
            },
            onPullingDown() {
                this.pageNow=1;
                this.$refs.contentScroll.refresh();
                setTimeout(() => {
                    this.getData(this.pageNow,this.pageSize,false,this.keyword,this.largeName,this.smallName);
                }, 1000)
            },
            getData:function(pageNow,pageSize,isPullUpFlag,keyword,largeName,smallName){
                this.HttpCli.get(
                    // "/WebsiteCon/manage-api/template/queryTemplateByAnyConditionsToES?pageNow="+pageNow+"&pageSize="+pageSize+'&keyWord='+keyword+'&fLargeCategoryName='+largeName+'&fSmallCategoryName='+smallName,
                    "/manage-api/template/queryTemplateByAnyConditionsToES?pageNow="+pageNow+"&pageSize="+pageSize+'&keyWord='+keyword+'&fLargeCategoryName='+largeName+'&fSmallCategoryName='+smallName,
                ).then((res)=>{
                    let listCount=res.data.data.count
                    let listData=res.data.data.content;
                    this.isDataShow=listCount>0?true:false;
                    this.isNodata=listCount==0?true:false;
                    if(listData.length<pageSize){
                        this.dataNone=true;
                        this.isPullUp=false
                    }else{
                        this.dataNone=false;
                        this.isPullUp=true;
                    }
                    if(res.data.status==0){
                        if(isPullUpFlag==true){
                            this.items=this.items.concat(listData);
                        }else{
                            this.items=listData;
                        }
                    }
                }).catch((err)=>{
                      console.log(err)
                })
            },
            imgAutoAdapt:function(e){
                MethodsUtil.imgAutoAdapt(e.target,true)
            }
        },
        mounted(){
            let _this=this;
            this.getData(this.pageNow,this.pageSize,false,this.keyword,this.largeName,this.smallName);
            communication.$on('returnClassify',function(msg){
                _this.largeName=msg.largeName;
                _this.smallName=msg.smallName=='全部'?'':msg.smallName
                _this.getData(_this.pageNow,_this.pageSize,false,_this.keyword,_this.largeName,_this.smallName);
            })
        },
        watch:{
            scrollTopVal:{
                 handler:function(newVal,oldVal){
                     if(newVal>=800){
                         this.isTop = true;
                     }else{
                         this.isTop = false;
                     };
                },
                deep:true,
                // immediate:true,
            }
        },
        computed:{
            classifyState () {
                return this.$store.state.classifyState
            }
        }
    }
</script>

<style lang="scss" scope>
.commonSearch {
    height: 100%;
}
.templateList.on{
    top:95px;
}
.noneData{
    width: 100%;
    height: 100%;
    img{
        max-width: 100%;
        max-height: 100%;
    }
}
</style>