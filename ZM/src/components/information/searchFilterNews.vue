<template>
    <div>
        <ul>
            <li v-for="(item) in items" :key=item.rowIndex class="fistItem">
                <h1>{{item.title}}</h1>
                <ul>
                    <li v-for="(val,index) in item.list" :key=index  class="secondItem" @click="itemSelect(item.rowIndex,index,$event)">
                       {{val}} 
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>
<script>
import {mapGetters} from "vuex";
import eventBus from "../../common/js/eventBus";
const NewsData = [
        {'title':"新闻类型",list:['图文','图集','视频'],rowIndex:1},
    ];
     export default {
        data(){
            return{
                items:NewsData,         //筛选条件
                selectnewsType:{},      //bus 传值
                firstcategory:[],       //一级类目名称
                firstcategoryId:[],     //一级类目名称id
            }
        },
        mounted(){
            this.getData();
        },
        methods:{
            getData(){
                NewsData.splice(1,1);
                this.HttpCli.post(
                   "/news_web/news/queryFristCategory", 
                ).then((res)=>{
                    if(res.status == 200){
                        this.firstcategory = this.firstcategory.concat(res.data);
                        let fcategoryArr = [];
                        this.firstcategory.forEach((item,index)=>{
                            if(item){
                                fcategoryArr.push(item.fName);
                                this.firstcategoryId.push(item.fId); 
                            }
                        })
                        let obj = {};
                        obj.title = "新闻分类";
                        obj.list = fcategoryArr;
                        obj.rowIndex = 2;
                         
                        NewsData.push(obj);
                    }
                }).catch((err)=>{

                })
            },
            itemSelect(rowIndex,index,eve){
                    if(eve.srcElement.getAttribute("class").indexOf("active")!=-1){
                                eve.srcElement.classList.remove('active');
                                return;
                             }
                            let arr =eve.srcElement.parentNode.children;
                            for(let i=0; i<arr.length; i++){
                                arr[i].classList.remove('active');
                             }
                            eve.srcElement.classList.add('active')
                    // 记录筛选值
                switch(rowIndex){
                    case 1 : this.selectnewsType.fNewsType = Math.pow(2,index) ; break;
                    case 2 : this.selectnewsType.fFristZumaItemId = this.firstcategoryId[index] ; break;
                }
               
            },
            clearAll(){
                console.log("执行了清空")
            },
            defineSearch(){
                eventBus.$emit("selectnewsType",this.selectnewsType);
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
    }
.active{
    background-image: url("../../common/images/public/selecte.png");
    background-color: #E8EdF2;
    background-size: 16px 16px;
    background-repeat: no-repeat;
    background-position: right bottom;
}
</style>