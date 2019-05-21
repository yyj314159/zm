<template>
    <div>
        <ul class="videoItemWrapper" slot="filterData">
            <li v-for="item in items" class="firstLevel" :key="item.rowIndex">
                <h1>{{item.title}}</h1>
                <ul class="secLevelbox">
                    <li v-for="(type,index) in item.list" class="firstSecond" @click="selectItem(item.rowIndex,index,$event)">{{type}}</li>
                </ul>
            </li>
            <li class="location" @click="showChooseCity">
                <span class="tit">所在地</span>
                <span v-text="address" class="address"></span>
                <img src="../../common/images/rightjiantou.png">
            </li>
        </ul>
    </div>
</template>
<script>
    import {mapGetters} from "vuex";
    import eventBus from "../../common/js/eventBus"
    const productData = [
        {'title':"价格",list:['从低到高','从高到低','定制价格'],rowIndex:1},
        {'title':"类型",list:['新品','二手','翻新'],rowIndex: 2},
        {'title':"付款方式",list:['一次性付款','分阶段付款'],rowIndex:3}
    ];
    export default {
        data(){
            return{
                items:productData,       //筛选条件
                selectConditions:{},         //选择的条件
            }
        },
        methods:{
            selectItem(rowIndex,index,eve){
                // rowIndex        第几行
                // index           某行第几个
                let _this = eve.srcElement;
                if(_this.getAttribute("class").indexOf("selected")!=-1){
                    _this.className = 'firstSecond'
                }else{
                    let liArr = _this.parentNode.children;
                    for (var i = 0; i < liArr.length; i++){
                        liArr[i].className = 'firstSecond';
                    }
                    _this.className='firstSecond selected';
                }
                switch(rowIndex){
                    case 1:this.selectConditions.priceType = index+1;
                           break;
                    case 2:this.selectConditions.productType = index+1;
                            break;
                    case 3:this.selectConditions.productPayMent = index+1;
                            break;
                }
            },
            showChooseCity(){
                this.$store.dispatch('SHOW_CHOOSE_CITY',{chooseCity:true})
            },
            clearAll(){         //清空筛选条件
                let liArr = document.querySelectorAll(".firstSecond");
                let liArr2 = Array.from(liArr);
                liArr2.map((val)=>{
                    val.className = "firstSecond";
                });
                this.$store.dispatch("CLEAR_ADDRESS");
                this.selectConditions = {};
            },
            defineSearch() {
                this.address && (this.selectConditions.placeOrigin = this.address.replace(/\-/g, ">"));
                eventBus.$emit("selectProductConditions", this.selectConditions);
            }
        },
        computed:{
            ...mapGetters([
                "address"
            ]),
        },
    }
</script>
<style lang="scss" scoped>
    .location{
        height: 55px;
        box-sizing: border-box;
        border-bottom: 6px solid #F7F7F7;
        line-height: 55px;
        text-align: left;
        padding:0 10px;
        img{
            width: 7px;
            height: 11px;
            float: right;
            display: inline-block;
            margin-top:22px;
        }
        .tit{
            float: left;
        }
        .address{
            margin-left: 20px;
            display:block;
            float: left;
            width: 180px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            height: 49px;
        }
    }
    .selected{
        background: #E8EDF2 url(../../common/images/public/selecte.png) no-repeat right bottom!important;
        background-size: 16px 16px!important;
    }

    .select-icon{
        width: 16px;
        height: 16px;
        position: absolute;
        right: 0;
        bottom:0;
    }
</style>