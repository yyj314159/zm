<template>
    <div>
        <div class="searchHead">
            <Search searchTypef="S" placeholder="搜服务" :navList="navList">
                <span slot="before">找服务</span>
            </Search>
        </div>
        <servicePage></servicePage >
    </div>
</template>

<script>
import servicePage from "./publicServicePage";
import Search from "../public/commonsearch";
export default {
    name: "Service",
    data() {
        return {
            navList:[
                {iconSrc : '/img/serviceOrder.png',navTitle : '服务订单',href : ''},
                {iconSrc : '/img/serviceBargain.png',navTitle : '服务议价单',href : ''}
            ]    
        }
    },
    components: {
        Search,
        servicePage
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.searchHead
    height 40px
</style>
