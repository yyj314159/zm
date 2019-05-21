<template>
    <div ref="filterdiv">
       <ul>
            <li v-for="(item) in items"  class="fistItem" :class="{isfeeType:item.rowIndex == 1}">
                <h1>{{item.title}}</h1>
                <ul :class="{categoryItem:item.rowIndex == 2}" ref="categoryItemBox">
                    <li v-for="(val,index) in item.list"  class="secondItem" @click="itemSelect($event,index,item.rowIndex)">
                        {{val}}
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>
<script>
    import {mapGetters} from "vuex";
    import eventBus from "common/js/eventBus"
    const NewsData = [
        {'title':"收费类型",list:['免费','付费'],rowIndex:1},

    ];
    export default {
        data(){
            return{
                items:NewsData,       //筛选条件
                active:false,
                Id:this.$route.query.id,
                firstCategory:[],//一级类目
                firstCategoryId:[],//一级类目id
                filterData:{}//筛选条件
            }
        },
        mounted(){
            this.firstCategoryData();

        },
        methods:{
            firstCategoryData(){
                var _this = this;
                if(_this.$parent.$parent.apiType=='development') {
                    var videoApi = '/videoapi';
                }else{
                    var videoApi = '';
                }
                this.HttpCli.post(videoApi+'/video_web/search-api/categoryList')
                    .then(function (response) {
                        _this.firstCategory = _this.firstCategory.concat(response.data.data);
                        var firstCategoryArray = [];
                        _this.firstCategory.forEach(function(item,index){
                            if(item){
                                firstCategoryArray.push(item.fName);
                                _this.firstCategoryId.push(item.fId)
                            }
                        })
                        /*_this.setFilterCategoryID( _this.Id)*/
                        var obj = {};
                            obj.title = '视频类目';
                            obj.list = firstCategoryArray;
                            obj.rowIndex = 2
                        NewsData.push(obj)
                        console.log(_this.firstCategory)

                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            itemSelect(eve,index,type){
                if(eve.srcElement.getAttribute("class").indexOf("active")!=-1){
                    eve.srcElement.classList.remove('active');
                    return;
                }
                let arr =eve.srcElement.parentNode.children;
                for(let i=0; i<arr.length; i++){
                    arr[i].classList.remove('active');
                }
                eve.srcElement.classList.add('active')
                this.getFilterdata(index,type);
            },
            //获取筛选数据
            getFilterdata(index,type){

                if(index == 0 && type == 1){
                    this.filterData.feeType = 1;
                }
                if(index == 1 && type == 1){
                    this.filterData.feeType = 2;
                }
                if(type == 2){
                    this.filterData.categoryId = this.firstCategoryId[index];
                }
              console.log(this.filterData)
            },
            //设置一级类目
            setFilterCategoryID(id){
           var _this = this;
           var activeIndex;
           if(id){
                    this.firstCategoryId.forEach(function(item,index){
                        if(item == id){
                            activeIndex = index;
                        }
                    })
               setTimeout(function(){
                   _this.$refs.categoryItemBox[1].children[activeIndex].classList.add('active');
               },200)

                }

            },
            clearAll(){
                console.log("执行了清空")
                eventBus.$emit("clearselectConditions");
                var selectedBox = this.$refs.categoryItemBox;
                selectedBox.forEach(function(item,index){
                    for(var i = 0;i<item.children.length;i++){
                        item.children[i].classList.remove('active');
                    }
                })

                console.log(this.$refs.categoryItemBox)

            },
            defineSearch(){
               eventBus.$emit("selectConditions",this.filterData);
                console.log("确定")
            }
        }
    }
</script>

<style lang="scss">
    .fistItem{
        h1{
            height: 35px;
            text-align: left;
            line-height: 35px;
            text-indent: 10px;
            border-bottom: 1px solid #f2f2f2;
        }
        ul{
            display: flex;
            margin: 0 3.5px;
            flex-wrap: wrap;
            justify-content:flex-start;
        }

    }
    .fistItem:nth-of-type(1){
        padding-bottom: 6px;
        border-bottom: 6px solid #f2f2f2;
    }
    .secondItem{
        width: 84px;
        height: 30px;
        line-height: 30px;
        background-color: #f7f7f7;
        margin:6px 3.5px 0 3.5px;
        overflow: hidden;
        padding: 0 5px;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .active{
        background-image: url("../../common/images/public/selecte.png");
        background-color: #E8EdF2;
        background-size: 16px 16px;
        background-repeat: no-repeat;
        background-position: right bottom;
    }
</style>