<template>
    <div>
        <ul>
            <li v-for="(val,index) in items" :key=index class="fistItem">
                <h1>{{val.title}}</h1>
                <ul>
                    <li v-for="(item,i) in val.list" :key=i class="secondItem" @click="itemSelect(i,$event)">
                        {{item}}
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>
<script>
import {mapGetters} from "vuex";
import eventBus from "../../common/js/eventBus";
import { constants } from 'crypto';
const BlogData = [{"title":"博客类型",list:["纯文本","图文博客","视频博客"]}];
export default{
    data(){
        return{
            items:BlogData,
            selectblogType:null
        }
    },
    methods:{
      itemSelect(index,eve){
        if(eve.srcElement.getAttribute("class").indexOf("active")!=-1){
                        eve.srcElement.classList.remove('active');
                        return;
                    }
                    let arr =eve.srcElement.parentNode.children;
                    for(let i=0; i<arr.length; i++){
                        arr[i].classList.remove('active');
                    }
                    eve.srcElement.classList.add('active');

                    switch(index){
                     case 0: this.selectblogType = 1; break;
                     case 1: this.selectblogType = 6; break;
                     case 2: this.selectblogType = 18; break;
                    }
                    console.log("selectblogType",this.selectblogType)
      }, 
       clearAll(){
                console.log("执行了清空")
            },
       defineSearch(){
                console.log("确定")
                eventBus.$emit("selectblogType",this.selectblogType);
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