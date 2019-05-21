<template>
    <div class="commonSearch">
        <!--搜索前的结构-->
        <div class="searchBefore">
            <i class="back" @click="goback"></i>
        <div class="searchCategoryText"
              v-if="!isfocus"><slot name="before"></slot>
        </div>
        <div class="searchBox" :class="{focusWidth:isfocus}">
            <i class="searchIcon"></i>
            <input  class="searchInput"
                    v-model="inputValue"
                    @focus="handleFocus()"
                    @blur="handleBlur"
                    :placeholder="placeholder"
                    :searchType="searchTypef"
                    type="text">
        </div>
        <div class="search-right" @click="show_nav = !show_nav">
            <!--聚焦状态-->
            <div class="defaultStyle">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
        </div>
        <!--导航部分-->
        <PublicNav v-if="show_nav" :navList="navList"></PublicNav>
    </div>

</template>
<script>
    import PublicNav from "./publicNav"
    export default {
        name:'SearchInput',
        components:{
            PublicNav
        },
        props:{
            placeholder: {
                type: String,
                default: ''
            },
            searchTypef:{
                type: String,
                default: ''
            },
            navList:{
                type:Array,
                required: false,
            }
        },
        data(){
            return {
                inputValue: this.value,//搜索内容
                isfocus:false,//是否聚焦
                show_nav:false      //显示导航
            }
        },
        mounted(){
            let _this = this;
            document.addEventListener("click",function(e){
                let ele = document.querySelector(".search-right");
                if(_this.show_nav){
                    if(!ele.contains(e.target)){
                        _this.show_nav = false;
                    }
                }
             });
        },
        methods:{
            handleFocus(event,type){
                this.$emit('on-focus', event);
                this.isfocus = true;
                //跳转路由
                var type = this. searchTypef;
                this.$router.push({
                    path: '/searchIndex',
                    query: {
                        searchType: type
                    }
                })
            },
            handleBlur(event){
                this.$emit('on-blur', event);
            },
            goback(){
                history.go(-1)
            },
        },
        destroyed(){
            document.removeEventListener("click",()=>{});
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

    .commonSearch
        position: fixed;
        top: 0;
        left: 0;
        height: 40px;
        width: 100%;
        z-index: 999;
        background: #fff;
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
            display inline-block
            width 50px
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
             width:45px;

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
                    background #8A8A8A
                    display inline-block
                    width 5px
                    height 5px
                    border-radius 50%
                .span-center
                    margin 0 2px




</style>