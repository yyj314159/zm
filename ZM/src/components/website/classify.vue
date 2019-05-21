<template>
    <transition name='slide'>
    <div class="classify" v-show='classifyState.isClassify'>
        <div class='top'>
            <span>已选分类：</span><span class='classify-name'>{{largeName}}-{{smallName}}</span>
        </div>
        <p class="line"></p>
        <div class='content'>
            <ul class='classify-con'>
                <li class='classify-top' v-for='(item,indexF) in fLargeCategoryNameList' :key='item.id'>
                    <p class='name' @click='showCon(indexF);clickClassName2(item.fId,indexF,$event)' :attrData='item.fCategoryName'><span>{{item.fCategoryName}}</span><i v-bind:class="{on:indexF==isShow}"></i></p>
                    <transition name='fade'>
                        <ul class='classify-small' v-show="indexF==isShow"  transiton='fade' ref='smallLi'>
                            <li v-for='(alist,index) in item.fSmallArr' @click="clickClassName(indexF,index,$event)"  v-bind:class="{onActive:alist.active}" :attrData='alist.fCategoryName'><i></i><span>{{alist.fCategoryName}}</span></li>
                        </ul>
                    </transition>
                </li>
            </ul>
        </div>
        <div class='bottom' @click="removeClassify()">
            <span>取消</span>
        </div>
    </div>
    </transition>
</template>
<script>
import { isAbsolute } from 'path';
import { setTimeout } from 'timers';
import {mapState, mapGetters, mapMutations} from 'vuex'
    export default {
        name: 'classify',
        components:{

        },
        data(){
            return{
                // classifyList:classifyData,
                isShow:0,//一级菜单index;
                isActive:0, //二级菜单选中的index;
                // topName:'',//顶部已选分类的字符串拼接;
                largeName:'',//大类名称
                smallName:'',//小类名称
                isActiveF:'',
                fLargeCategoryNameList:[]//模板大类
                // fSmallCategoryNameList:[],//模板小类
            }
        },
        methods:{
            showCon:function(indexF){
                this.isShow=indexF;
            },
            clickClassName:function(indexF,index,$event){ //点击二级分类,获取被选中的分类名
                this.isActive=index;
                this.fLargeCategoryNameList[indexF].fSmallArr[index].active=true;
                var list=this.fLargeCategoryNameList[indexF].fSmallArr;
                for(let i=0;i<list.length;i++){
                    if(index==i){
                        list[i].active=true;
                    }else{
                        list[i].active=false;
                    }
                }
                let el=event.currentTarget;
                this.isActiveF=indexF;
                // this.topName=el.parentElement.previousElementSibling.getAttribute('attrData')+'-'+el.getAttribute('attrData');
                this.largeName=el.parentElement.previousElementSibling.getAttribute('attrData');
                this.smallName=el.getAttribute('attrData');
            },
            clickClassName2:function(fId,indexF,$event){ //点击一级分类,获取选中的分类名
                // this.getFSmallCategoryName(fId);
                let el=event.currentTarget;
                let li=document.getElementsByClassName('classify-top')[indexF].getElementsByTagName("li");
                let smallData='';
                let activeLen=0;
                for(let i=0;i<li.length;i++){
                    if(li[i].className=='onActive'){
                        smallData=li[i].getAttribute('attrData');
                    }
                }
                // this.topName=el.getAttribute('attrData')+'-'+smallData;
                this.largeName=el.getAttribute('attrData');
                this.smallName=smallData;
            },
            removeClassify:function(){ //点击取消
                this.$store.commit('SHOW_CLASSIFY',{
                    isClassify:false,
                    isLoadClassify:false,
                    largeName:this.largeName,
                    smallName:this.smallName
                })
            },
            addActive:function(){
                let classifyTop=document.getElementsByClassName('classify-top');
                for(let i=0;i<classifyTop.length;i++){
                    classifyTop[i].children[1].children[0].classList.add('active')
                }
            },
            //模板大类
            getFLargeCategoryName:function(){
                this.HttpCli.get(
                    // "/WebsiteCon/manage-api/template/webCategory/queryCategoryDropList",
                    "/manage-api/template/webCategory/queryCategoryDropList",
                ).then((res)=>{
                    if(res.data.status==0){
                        // this.fLargeCategoryNameList = res.data.data;
                        let fBigList=[];
                        // let newList=[];
                        let fSmall=[];
                        let newFSamll=[];
                        fBigList=res.data.data
                        for(let i=0;i<fBigList.length;i++){
                            this.HttpCli.get(
                                // "/WebsiteCon/manage-api/template/webCategory/queryCategoryDropListExp?categoryId="+fBigList[i].fId,
                                "/manage-api/template/webCategory/queryCategoryDropListExp?categoryId="+fBigList[i].fId,
                            ).then((res)=>{
                                if(res.data.status==0){
                                    fSmall=res.data.data;
                                    for(let i=0;i<fSmall.length;i++){
                                        fSmall[i].active=false;
                                    }
                                    fSmall.unshift({
                                        fCategoryName:"全部",
                                        active:true,
                                    });
                                    fBigList[i].fSmallArr=fSmall;
                                    this.fLargeCategoryNameList=fBigList;
                                    this.largeName=fBigList[0].fCategoryName;
                                    this.smallName=fBigList[0].fSmallArr[0].fCategoryName
                                    // this.topName=fBigList[0].fCategoryName+'-'+fBigList[0].fSmallArr[0].fCategoryName;//进入分类页之后,默认第一个大类的小类全部
                                }
                            }).catch((err)=>{
                                console.log(err)
                            })
                        }
                    }
                }).catch((err)=>{
                      console.log(err)
                })
            }
        },
        watch:{
            '$store.state.classifyState.isLoadClassify':function(newVal,oldVal){
                if(newVal==true){
                    this.getFLargeCategoryName();
                    this.addActive();
                }
            }
        },
        mounted(){
            this.getFLargeCategoryName();
            this.addActive();
        },
        computed:{
             ...mapGetters([
                "classifyState"
            ]),
        }
        // created() {
        //     this.isLoadClassifyData = this.classifyState.isLoadClassify;
        // }
    }
</script>

<style lang="scss" scope>
*{
    padding: 0;
    margin: 0;
    cursor: pointer;
    box-sizing:border-box;
    -webkit-tap-highlight-color:transparent;
}
input,textarea{
    -webkit-appearance: none;
}
.slide-enter-active, .slide-leave-active{
    transition: all 0.3s
    }
.slide-enter, .slide-leave-to{
    transform: translate3d(100%, 0, 0)
}
.slide-box{
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
    z-index: 10;
}
.classify{
    width: 280px;
    height: 100%;
    color: #5e5e5e;
    position: fixed;
    background: #fff;
    top: 0px;
    right: 0px;
    z-index: 1000;
    overflow: hidden;
    .content{
        position: absolute;
        width: 100%;
        top: 56px;
        bottom: 40px;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .bottom{
        height: 40px;
        text-align: center;
        font-size: 12px;
        line-height: 40px;
        position:fixed;
        bottom: 0px;
        width: 280px;
        background: #fff;
        border-top:1px solid #f2f2f2;
    }
    .top{
        line-height: 50px;
        text-align: left;
        height: 50px;
        padding: 0 10px;
        font-size: 12px;
    }
    .line{
        width: 100%;
        height: 6px;
        background: #f2f2f2;
    }
    .name{
        display: flex;
        height: 36px;
        line-height: 35px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        border-bottom: 1px solid #f2f2f2;
        i{
            display:inline-block;
            background:url('../../common/images/clickDown.png') 50% 50% no-repeat;
            width: 11px;
            height: 7px;
            background-size: 100%;
        }
        i.on{
            background:url('../../common/images/clickUp.png') 50% 50% no-repeat;
            background-size: 100%;
        }
    }
    .classify-small{
        padding: 0 10px;
        text-align: left;
        border-bottom: 1px solid #f2f2f2;
        li{
            height: 41px;
            line-height: 40px;
            border-bottom: 1px solid #f2f2f2;
        }
        li:last-child{
            border-bottom: transparent;
        }
        i{
            display: inline-block;
            border-radius: 50%;
            width: 16px;
            vertical-align: middle;
            height: 16px;
            border: 1px solid #f2f2f2;
        }
        li.onActive{
            i{
                background:#3D9BE9 url('../../common/images/selected.png') 50% 50% no-repeat;
                background-size: cover;
            }
        }
        span{
            display: inline-block;
            vertical-align: middle;
            margin-left: 10px;
        }
    }
    
}
</style>
