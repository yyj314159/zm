<template>
    <div>
        <div class="notFound" v-show="notFound">
            抱歉！没有找到符合条件的服务！
        </div>
        <!-- <servicePage :serviceData='newData' :sKey='keyword' @hidePrev='changeBoolen'></servicePage>        -->
        <servicePage @hidePrev='changeBoolen'></servicePage>       
    </div>
</template>
<script>
import servicePage from "./publicServicePage";
import eventBus from "../../common/js/eventBus"
export default {
    // props:['keyword'],//传值给子组件
    data() {
        return {
            notFound : false
            // ,newData : null
        }
    },
    components: {
        servicePage
    },
    methods: {
        changeBoolen(bol) {//接收子组件传来的值 
            // console.log(bol);
            this.notFound = bol;
        },

    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.notFound
    width 100%
    height 473px
    background url("../../common/images/notService.jpg") no-repeat center
    background-size 100% auto
    line-height 720px
    font-size 16px
    color #a1a1a1  

</style>
<style>
em {color: #3d9be9;font-style: normal;}
</style>