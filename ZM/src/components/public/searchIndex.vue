<template>
    <div class="commonSearch">
        <div class="searchBefore">
            <i class="back" v-if="!ifsearch" @click="goback"></i>
            <div class="searchBox focusWidth">
                <i class="searchIcon"></i>
                <input  class="searchInput"
                        v-model="inputValue"
                        @focus="handleFocus"
                        v-focus
                        @blur="handleBlur"
                        v-on:keyup.enter="searchData"
                        :placeholder="searchType"
                        type="text">
            </div>
            <div class="search-right">
                <!--聚焦状态-->
                <div class="defaultText"
                     @click="searchData">
                    <span >搜索</span>
                </div>
            </div>
        </div>

    </div>

</template>
<script>
    import searchResult from 'components/public/searchResult.vue';
    import eventBus from "common/js/eventBus"
    export default {
        name:'searchIndex',
        data(){
            return {
                inputValue: "",//搜索内容
                isfocus:false,//是否聚焦
                ifsearch:false,
                show: false,
                resultShow: false,
                searchType:this.formaterType(),
                id:null
            }
        },
        mounted(){
          this.id = this.$route.query.id;
          if(this.$route.query.value){
              this.inputValue = this.$route.query.value     //回显搜索词
          }
           eventBus.$on("inputValue",(arg)=>{
               this.inputValue = arg

            })
        },

        methods:{
          handleFocus(event){
                this.$emit('on-focus', event);
                this.isfocus = true;

            },
           handleBlur(event){
                this.$emit('on-blur', event);

            },
            searchData(){
                this.$emit('on-search', event);
                if(this.inputValue ==''){       //没输入关键词，禁止搜索
                    return false;
                }
                this.$router.push({
                    path: '/searchResult',
                    query: {
                        searchType: this.$route.query.searchType,
                        keyWord:this.inputValue,
                        id:this.id ? this.id : null
                    }
                })
            },
            goback(){
                history.go(-1)
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
                this.searchType = this.formaterType()

            },
        },
        directives:{
          focus:{       //获焦
              inserted:function (el,binding) {
                  el.focus()
              }
          }  
        },
        components: {
            searchResult
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

    .commonSearch
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
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








</style>