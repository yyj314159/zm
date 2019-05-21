<template>
    <div>
        <div class="btn-group-vertical" role="group">
            <search-input searchTypef="P" placeholder="搜商品" :navList="navList">
          <!--搜索框上部文字-->
                  <span slot="end">搜商品</span>
                  <!--搜索框左边文字-->
                  <span slot="before">购物</span>
            </search-input>
        </div>
        <cube-scroll
                ref="scroll"
                :data="goodList"
                :options="options"
                @pulling-up="onPullingUp"
                @scroll="scroll"
                :scroll-events="['scroll']"
                class="list"
        >
                <ul>
                    <div class="banner"></div>
                    <a href="" style="display: block" v-for="(item,index) of goodList" :key="item.productId+index" :href="item.wapUrl">
                        <li>
                            <div class="imgBox">
                                <img :src="item.productMainUrl" alt="" @load="imgAutoAdapt">
                            </div>
                            <div class="goodInfo">
                                <p>{{item.productName}}</p>
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
                            <span v-show="afterAll" class="after-all">╮(╯﹏╰）╭&nbsp;&nbsp;已经到底了</span>
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
import searchInput from "../public/commonsearch";
import MethodsUtil from "../../common/js/MethodsUtil";
import Loading from "../public/loading";
import Interface from "../../common/js/ConstStr";
  export default {
    name: 'Product',
      data(){
          return {
              goodList:[],
              showLoading:true,
              showGoTop:false,      //是否显示“回到顶部”按钮
              scrollTop:0,          //滚动距离
              isGetData:true,   //是否获取数据
              productCont:0,    //商品总数;
              alreadyShowProduct:null,  //当前已展示的商品数量;
              afterAll:false,           //数据是否加载完
              pageNow:1,
              navList:[
                  {iconSrc:'/img/shopCar.png',navTitle:'购物车',href: '/product_wap/cart/toGetShopCart'},
                  {iconSrc:'/img/productOrder.png',navTitle:'产品订单',href: '/wap/pOrder_wap/orderInfo/toOrderList?status=0'},
                  {iconSrc:'/img/productBargain.png',navTitle:'产品议价单',href: '/bargin_wap/wap/bargin/toWapBarginList?fType=1'}
              ],
              alreadyGetData:false
          }
      },
    components: {
      searchInput,
      Loading,
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
    methods: {
      scroll:function(dis){
          this.scrollTop = -dis.y;
      },
      onPullingUp:function() {
          if(!this.alreadyGetData){
              return;
          }
          if(this.alreadyShowProduct==this.productCont){
              this.showLoading = false;
              this.afterAll = true;
              setTimeout(()=>{
                  this.afterAll = false;
                  this.$refs.scroll.forceUpdate();
                  this.$refs.scroll.refresh();
              },2000)
          }else{
              this.getData({pageSize: 30,pageNow:this.pageNow});
              this.$refs.scroll.refresh();
              this.$refs.scroll.forceUpdate();
          }
      },
      goToTop:function(){
          this.$refs.scroll.scrollTo(0, 0, 1500);
      },
      getData:function(params){
          this.alreadyGetData = false;
              this.HttpCli.post(
                  Interface.productSearchKeyWord,
                  params
              ).then((res)=>{
                  if(res.data.status==0){
                      let data = res.data.data.content;
                      this.productCont = res.data.data.count;   //商品总量
                      data && (this.alreadyShowProduct+=data.length);
                      this.pageNow++;
                      setTimeout(()=>{
                          this.goodList.push(...data);
                          this.alreadyGetData = true;
                      },500)
                  }
              }).catch((err)=>{
                  console.log(err)
              })
      },
      imgAutoAdapt:function(e){
          MethodsUtil.imgAutoAdapt(e.target,true)
      },

    },
  computed: {
      options() {
          return {
              pullUpLoad: {
                  threshold: 0, //上拉阈值
                  stop:90,
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
                // immediate:true,
        }
    },
    mounted(){
        let h1 = document.querySelector(".searchBefore").offsetHeight;
        let WinH = document.documentElement.clientHeight;
        document.querySelector(".list").style.height = WinH-h1+"px";      //动态设置搜索列表的高度
        this.getData({pageSize:30,pageNow:this.pageNow});
    }
  }
</script>

<style lang="scss" scoped>
    *{
        margin:0;
        padding:0;
        list-style: none;
    }
.banner{
        width:100%;
        height:101px;
        line-height: 101px;
        font-size:14px;
        color:#000;
        font-weight: bold;
        background:url('../../common/images/product.jpg');
        background-size:contain;
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
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    padding: 5px 0;
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

