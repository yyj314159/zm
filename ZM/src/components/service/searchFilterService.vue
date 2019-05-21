<template>
    <div>
        <div class="sFilter">
            <ul class="filterData">
                <li class="firstLevel" v-for="i in sItems" :key="i.id">
                    <h1 class="">{{ i.tittle }}</h1>
                    <ul class="secLevelbox">
                        <li class="firstSecond" v-for="(k,index) in i.list" :key="index" @click="selectData(i.id,index,$event)">{{k}}</li>
                    </ul>
                </li>
                <li class="location" @click="showChooseCity">
                    <span class="tit">所在地</span>
                    <span v-text="address" class="address"></span>
                    <img src="../../common/images/rightjiantou.png">
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import eventBus from "../../common/js/eventBus"
import { mapGetters } from 'vuex';
const sFilterData = [
    {tittle:"价格",list:["从低到高","从高到底","定制价格"],id:1},
    {tittle:"议价选项",list:["一口价","接受议价"],id:2},
    {tittle:"付款方式",list:["一次性付款","分阶段付款","分时段付款"],id:3},
    {tittle:"服务耗时",list:["分钟","小时","天","月"],id:4},
    {tittle:"服务方式",list:["上门","到店","线上","电话","代办"],id:5}
];
export default {
    data(){
        return {
            sItems : sFilterData,
            sendServiceData : {
                // priceSort : null,
                // isOpenPrice : null,
                // payType : null,
                // takeType : null,
                // serviceType : null
            }
        }
    },
    methods: {
        selectData(k,v,event) {
            let Target = event.target ? event.target : event.srcElement;
            if(Target.classList.contains('selected')){
                Target.classList.remove("selected");
                this.hasServiceData(k)
            }else{
                let lis = Target.parentNode.children; 
                for (const iterator of lis) {
                    iterator.classList.remove("selected");
                }
                Target.classList.add("selected");
                this.hasServiceData(k,v)
            }
        },
        showChooseCity(){
            this.$store.dispatch('SHOW_CHOOSE_CITY',{chooseCity:true})
        },
        clearAll() {
            console.log("执行了清空")
        },
        defineSearch() {
            this.address && (this.sendServiceData.serviceShopAddress = this.address.replace(/\-/g,">"));
            console.log(this.sendServiceData,'/////')
            eventBus.$emit("sendServiceData",this.sendServiceData);
            this.$store.dispatch("CLEAR_ADDRESS");  //清空地址
        },
        hasServiceData(m,n) {
            switch (m) {
                case 1:
                    this.sendServiceData.priceSort = (n == null||undefined||'' ? n = null : n+1);
                    break;
                case 2:
                    this.sendServiceData.isOpenPrice = (n == null||undefined||'' ? n = null : n);
                    break;
                case 3:
                    this.sendServiceData.payType = (n == null||undefined||'' ? n = null : n);
                    break;
                case 4:
                    this.sendServiceData.takeType = (n == null||undefined||'' ? n = null : n+1);
                    break;
                case 5:
                    this.sendServiceData.serviceType = (n == null||undefined||'' ? n = null : n+1);
                    break;
            }  
        }
    },
    computed: {
        ...mapGetters(["address"])
    },
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
$onePX = 1px
.sFilter
    .filterData 
        .firstLevel
            h1
                color #5e5e5e
            .secLevelbox
                .firstSecond
                    color #797979
                    &.selected
                        background rgba(61,155,233,.06) url(../../common/images/public/selecte.png) no-repeat right bottom
                        background-size 16*$onePX $onePX*16
        .location
            height 46px
            line-height @height
            padding 0 10px
            border-bottom: 6px solid #f2f2f2;
            text-align left
            overflow hidden
            .tit
                float left
            .address
                width 180px
                height 40px
                float left
                margin-left 20px
                overflow hidden
                white-space nowrap
                text-overflow ellipsis
            img
                width 7px
                height 11px
                float right
                margin-top 15px
            
</style>
