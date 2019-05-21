<template>
    <div>
        <div class="notFound" v-if="notFound">
            抱歉&nbsp;!&nbsp;&nbsp;没有找到符合条件的产品
        </div>
        <cube-scroll
                ref="scroll"
                :data="productList"
                :options="options"
                @pulling-up="onPullingUp"
                @scroll="scroll"
                :scroll-events="['scroll']"
                class="list"
                v-if="!notFound"
        >
            <Loading v-if="showLoading2"></Loading>
            <ul>
                <a style="display: block" v-for="(item,index) of productList"  :href="item.wapUrl" :key="item.productId+index">
                    <li>
                        <div class="imgBox">
                            <img :src="item.productMainUrl" alt="" @load="imgAutoAdapt">
                        </div>
                        <div class="goodInfo">
                            <p v-html="item.productName"></p>
                            <p>￥{{item.productPrice|twoDecimal}}</p>
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
                        <span v-show="allProduct" class="after-all">╮(╯﹏╰）╭&nbsp;&nbsp;已经到底了</span>
                    </template>
                </div>
            </template>
        </cube-scroll>
        <div class="gotoTop" @click="goToTop" v-if="showGoTop">
            <img src="../../common/images/gotoTop.png" alt="">
        </div>
    </div>
</template>
<script>
    import MethodsUtil from "../../common/js/MethodsUtil";
    import Loading from "../public/loading";
    import eventBus from "../../common/js/eventBus";
    import Interface from "../../common/js/ConstStr";
    export default {
        data(){
          return {
              productList:[],
              showLoading:true,
              allProduct:false,
              showGoTop:false,      //是否显示“回到顶部”按钮
              scrollTop:0,          //滚动距离
              pageNow:1,            //当前页
              pageNow2:1,           //选定筛选条件后的当前页
              keyWord:'',
              alreadyShowProduct:0,
              productCont:null,
              notFound:false,
              origin:true,      //搜索结果来源，默认是从列表来，若从筛选条件后搜索，则是false
              params1:null,      //筛选条件
              showLoading2:false,    //刚进页面时显示的loading图
              alreadyGetData:false,
          }
        },
        components:{
            Loading
        },
        filters:{  //过滤器
            twoDecimal:(n)=>{
                n = n.toString()
                if(n.indexOf(".")==-1){     //没有小数
                    return n+".00";
                }else if(n.charAt(".")==n.length-1){    //一位小数
                    return n+"0";
                }else{
                    return parseFloat(n).toFixed(2);
                }
            }
        },
        methods:{
            scroll:function(dis){
                this.scrollTop = -dis.y;
            },
            onPullingUp:function() {
                if(!this.alreadyGetData){
                    return;
                }else{
                    if(this.alreadyShowProduct==this.productCont){
                        this.$refs.scroll.forceUpdate();
                        this.$refs.scroll.refresh();
                        this.showLoading = false;
                        this.allProduct = true;
                        setTimeout(()=>{
                            this.allProduct = false;
                        },2000)
                    }else{
                        if(this.origin){        //从列表来
                            this.pageNow++;
                            this.getData({pageSize: 30,pageNow:this.pageNow, keyWord:this.keyWord},Interface.productSearchKeyWord);
                        }else{                  //筛选条件来
                            this.pageNow2++;
                            this.getData(this.params1);
                        }

                        this.$refs.scroll.forceUpdate();
                        this.$refs.scroll.refresh();
                    }
                }
            },
            getData(params,url){
               this.alreadyGetData = false;
               this.HttpCli.post(
                   url,
                   params
               ).then((res)=>{
                   console.log(res)
                    if(Object.keys(res.data.data).length!=0){
                        let data = res.data.data.content;
                        this.productCont = res.data.data.count;   //搜索到商品总量
                        this.notFound = false;
                        data && (this.alreadyShowProduct+=data.length);
                        setTimeout(()=>{
                            this.showLoading2 = false;
                            if(this.origin){
                                this.productList.push(...data);
                            }else{
                                this.productList.push(...data);
                            }
                            this.alreadyGetData = true;
                        },500);
                    }else{
                        this.notFound = true;
                    }
                }).catch((err)=>{

                })
            },
            imgAutoAdapt:function(e){
                MethodsUtil.imgAutoAdapt(e.target,true)
            },
            goToTop:function(){
                this.$refs.scroll.scrollTo(0, 0, 1500);
            },
        },
        computed: {
            options() {
                return {
                    pullUpLoad: {
                        threshold: 0,           //上拉阈值
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
            let h1 = document.querySelector(".searchEnd").offsetHeight;
            let h2 = document.querySelector(".searchBefore").offsetHeight;
            let h3 = document.querySelector(".switchCategory").offsetHeight;
            let WinH = document.documentElement.clientHeight;
            document.querySelector(".list").style.height = WinH-h1-h2-h3+"px";      //动态设置搜索列表的高度
            this.keyWord = this.$route.query.keyWord;
            this.showLoading2 = true;
            this.getData({pageSize: 30,pageNow:this.pageNow, keyWord:this.keyWord},Interface.productSearchKeyWord);
            eventBus.$off("selectProductConditions");
            eventBus.$on("selectProductConditions",(arg)=>{
                this.origin  = false;
                this.params1 = arg;
                this.params1.pageSize = 30;
                this.params1.pageNow = this.pageNow2;
                this.params1.keyWord = this.keyWord;
                // 下面是将之前的数据清空，之后重新赋值
                this.productList = [];
                this.productCont = 0;
                this.alreadyShowProduct = 0;
                this.showLoading2 = true;
                console.log(this.params1)
                this.getData(this.params1,Interface.productSearchKeyWord);
            })
        }
    }
</script>

<style lang="scss" scoped>
    *{
        margin:0;
        padding:0;
        list-style: none;
    }
    .list{
        background:#F7F7F7;
        text-align: left;
        width: 100%;
        ul{
            display: flex;
            flex-wrap: wrap;
            height: 100%;
            li{
                height:210px;
                width:151px;
                background:#fff;
                margin-left: 6px;
                margin-top: 6px;
                .imgBox{
                    width: 151px;
                    height: 151px;
                    overflow: hidden;
                    img{
                    }
                }

                .goodInfo{
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    height: 48px;
                    padding-left: 6px;
                    padding-top: 5px;
                    p:nth-of-type(1){
                        font-size: 12px;
                        width: 100%;
                        padding:5px 0;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }
                    p:nth-of-type(2){
                        font-size: 14px;
                        font-weight: bold;
                    }
                }
            }
        }
    }
    .gotoTop{
        width: 40px;
        height:40px;
        position: fixed;
        right:26px;
        bottom:45px;
        border-radius: 50%;
        background:#fff;
        z-index: 999;
        img{
            height: 24px;
            width: 24px;
            position: absolute;
            left: 0;
            right: 0;
            bottom:0;
            top:0;
            margin:auto;
        }
    }
    .notFound{
        width: 100%;
        height: 473px;
        background:url("../../common/images/notProduct.jpg") no-repeat center;
        background-size: 100% auto;
        line-height: 690px;
        font-size: 16px;
    }
    .showLoading{
        padding-bottom: 20px;
    }
    .after-all{
        display: inline-block;
        width: 100%;
        height:45px;
        line-height: 45px;
        text-align: center;
    }
</style>
<style>
    .goodInfo>p:nth-of-type(1) > em{
        font-style: normal;
        color: #3D9BE9;
    }
</style>
