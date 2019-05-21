<template>
    <div>
        <zhuanji :Search='Search' :keyword='keyword'></zhuanji>
    </div>
</template>
<script>
import zhuanji from "./zhuanji"; //引入专辑组件
    export default {
        props:{
             keyword:{
                type: String,
                default: ''
            }
        },
        data(){
            return {
                Search:true,
            }
        },
        components:{
            zhuanji,
        },
        created(){
           
        },
        mounted(){
        
        },
        methods:{

        },
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>