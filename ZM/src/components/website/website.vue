<template>
    <div class='webSiteBox' >
        <div class="btn-group-vertical" role="group" :navList="navList">
           <search-input :navList="navList"
                    searchTypef="WEBSITE"
                    placeholder="搜模板" >                
                <span slot="end">网站</span>
                <span slot="before">搜模板</span>
            </search-input>

        </div>
        <div class="templateList" ref='viewBox'>
            <cube-scroll ref="contentScroll" :scroll-events="['scroll']" @scroll="scroll"    :data='items' :options="options" @pulling-down="onPullingDown" @pulling-up="onPullingUp">
                <div class="webSiteContent">
                    <div class="webBannerBox">
                        <div class='webBanner'></div>
                    </div>
                </div>
                <div class='registerBox'>
                    <div class='btnLogin' v-show="btnLoginShow"></div>
                    <div class='btnOkBox' v-show="btnOkShow"><p></p><span>感谢您的留言，我们会在第一时间和您联系的！</span></div>
                    <div class=register>
                        <div class='registerCon'>
                            <input type="text" placeholder="您的姓名" class='longInput name' v-model="userName">
                            <input type="text" placeholder="您的手机" class='longInput phoneNum' v-model="userPhoneNum">
                            <p class=''><input type="text" placeholder="手机验证码" class="smallInput" v-model="userVerificationCode"><span class='verificationCode' @click='countDown'>{{btnText}}</span></p>
                            <textarea name="" id=""  placeholder="您的留言..." class='leavMessage' v-model="userLeavMessage"></textarea>
                        </div>
                    </div>
                    <a href="JavaScript:;" class='Submission' @click='checking'>提交</a>
                </div>
                <ul>
                    <li class='templateCon' v-for='item in items' :key="item.id">
                        <a class='imgBox' :href="'/mobview.zuma.com/pre/'+item.fId+'type=template&version='+item.fVersion">
                            <img v-bind:src="item.fUrl2" alt="" @load="imgAutoAdapt">
                        </a>
                        <p><a :href="'/mobview.zuma.com/pre/'+item.fId+'type=template&version='+item.fVersion" class='t-name'>{{item.fName}}</a></p>
                        <p class='abc'>
                            <span class="t-price">免费</span>
                            <a :href="'/mobview.zuma.com/pre/'+item.fId+'type=template&version='+item.fVersion" class="t-look">预览</a>
                        </p>
                    </li>
                </ul>
                <template slot="pulldown" slot-scope="props">
                    <div v-if="props.pullDownRefresh"
                        class="cube-pulldown-wrapper"
                        :style="props.pullDownStyle">
                        <div v-if="props.beforePullDown"
                        class="before-trigger"
                        :style="{paddingTop: props.bubbleY + 'px'}">
                        <span :class="{rotate: props.bubbleY > 0}"></span>
                        </div>
                        <div class="after-trigger">
                        <div v-show="props.isPullingDown" class="">
                            <Loading></Loading>
                        </div>
                        </div>
                    </div>
                </template>
                <template slot="pullup" slot-scope="props">
                    <div v-if="props.pullUpLoad"
                    class="before-trigger"
                    :style="{paddingTop: props.bubbleY + 'px'}">
                    <span :class="{rotate: props.bubbleY > 0}"></span>
                    </div>
                    <div class="after-trigger">
                        <div v-show="props.pullUpLoad" class="">
                            <template>
                                <div v-if='dataNone' class="isDataNone">╮(╯﹏╰）╭&nbsp;&nbsp;已经到底了</div>
                                <div v-else>
                                    <Loading></Loading>
                                </div>
                            </template>
                        </div>
                    </div>
                </template>
            </cube-scroll>
        </div>
        <div class='backTop' v-show='isTop' @click='onBackTop'></div>
    </div>
</template>
<script>
    import searchInput from "../public/commonsearch";
    import Loading from "../public/loading";
    import { clearInterval, setTimeout } from 'timers';
    import { type } from 'os';
    import MethodsUtil from "../../common/js/MethodsUtil";
    export default {
        name: 'website',
        components:{
            searchInput,
            Loading
        },
        data(){
            return{
                btnText:'获取验证码',
                totalTime:60, //倒计时时间
                clickFlag:true, //是否可以点击获取验证码
                userName:'',//用户姓名
                userPhoneNum:'',//用户手机号码
                userVerificationCode:'',//验证码
                userLeavMessage:'',//用户留言
                items:[], //模板列表.
                // isShowClassify:false,//是否展示详细分类/
                // screenList:screenListData,//赛选//
                isShowNone:true,
                options: {
                    pullDownRefresh: {threshold: 0},
                    pullUpLoad: {threshold: 0}},
                pageNow:1,
                pageSize:10,
                scrollTopVal:0,
                btnLoginShow:false,//提交是否暂时loading
                btnOkShow:false,//提交成功
                isTop:false,//是否显示回到顶部
                dataNone:false,//是否显示已经到底
                isPullUp:true, //下拉是否添加数据
                navList:[
                  {iconSrc:'/img/shopCar.png',navTitle:'购物车'}
              ]
            }
        },
        methods:{
            scroll:function(dis){
                this.scrollTopVal = -dis.y;
            },
            onBackTop:function(){
                this.$refs.contentScroll.scrollTo(0, 0, 1000);
            },
            onPullingUp() {
                if(this.isPullUp){
                    this.pageNow++;
                    setTimeout(() => {
                        this.getData(this.pageNow,this.pageSize,true);
                    }, 1000)
                    this.$refs.contentScroll.refresh();
                }else{
                    this.$refs.contentScroll.forceUpdate();
                }
            },
            onPullingDown() {
                this.pageNow=1;
                this.$refs.contentScroll.refresh();
                setTimeout(() => {
                    this.items=this.getData(this.pageNow,this.pageSize,false);
                }, 1000)
            },
            beginSearch(){
                // console.log("搜索",searchWord)
                // let params={};
                //     params.keyWord = searchWord;
                //     params.pageSize = 30;
                // this.getData(params);
            },
            clearSelected(){

            },
            imgAutoAdapt:function(e){
                MethodsUtil.imgAutoAdapt(e.target,true)
            },
            cancelF(){

            },
            confirmF(){

            },
            getData:function(pageNow,pageSize,isPullUpFlag){
                this.HttpCli.get(
                    // "/WebsiteCon/manage-api/template/queryTemplateByAnyConditionsToES?pageNow="+pageNow+"&pageSize="+pageSize,
                    "/manage-api/template/queryTemplateByAnyConditionsToES?pageNow="+pageNow+"&pageSize="+pageSize,
                ).then((res)=>{
                    let listCount=res.data.data.count
                    let listData=res.data.data.content;
                    if(listData.length<pageSize){
                        this.dataNone=true;
                        this.isPullUp=false
                    }else{
                        this.dataNone=false;
                        this.isPullUp=true;
                    }
                    if(res.data.status==0){
                        if(isPullUpFlag==true){
                            this.items=this.items.concat(listData);
                        }else{
                            this.items=listData;
                        }
                    }
                }).catch((err)=>{
                      console.log(err)
                })
            },
            postLogin:function(userName,userPhoneNum,userLeavMessage,userVerificationCode){
                this.HttpCli.post(
                    // "/WebsiteCon/admin/c_m/sysLeaveMessage/save?fCustomerName="+userName+"&fCustomerPhone="+userPhoneNum+'&fLeaveMessage='+userLeavMessage+'&code='+userVerificationCode,
                    "/admin/c_m/sysLeaveMessage/save?fCustomerName="+userName+"&fCustomerPhone="+userPhoneNum+'&fLeaveMessage='+userLeavMessage+'&code='+userVerificationCode,
                ).then((res)=>{
                    this.btnLoginShow=false;
                    if(res.data.status==0){
                        this.btnOkShow=true;
                        setTimeout(()=>{
                            this.btnOkShow=false;
                        },1000);
                    }else{
                        this.toast = this.$createToast({
                            txt:res.data.message,
                            type: 'txt',
                            time: 1000
                        })
                        this.toast.show();
                    }
                }).catch((err)=>{
                      console.log(err)
                })
            },
            countDown(){
                if(this.clickFlag){
                    this.clickFlag=false;
                    this.HttpCli.post(
                    // "/WebsiteCon/admin/c_m/sysLeaveMessage/getPhoneCode?phone="+this.userPhoneNum,
                    "/admin/c_m/sysLeaveMessage/getPhoneCode?phone="+this.userPhoneNum,
                    ).then((res)=>{
                        if(res.data.status==0){
                           let clock=window.setInterval(()=>{
                                this.totalTime--;
                                this.btnText=this.totalTime;
                                if(this.totalTime==0){
                                    window.clearInterval(clock)
                                    this.btnText='获取验证码';
                                    this.clickFlag=true;
                                    this.totalTime=60
                                }
                            },1000)
                        }else{
                            this.toast = this.$createToast({
                                txt:res.data.message,
                                type: 'txt',
                                time: 1000
                            })
                            this.toast.show();
                            this.clickFlag=true;
                        }
                    }).catch((err)=>{
                        console.log(err)
                    })   
                }
            },
        
            checking(){
                this.btnLoginShow=true;
                let checkNum=0;
                let tipCon='';
                let reg=/^((13|14|15|17|18)[0-9]{1}\d{8})$/;
                setTimeout(()=>{
                    if(this.userVerificationCode&&this.userVerificationCode!=''){
                        checkNum++;
                    }else{
                        tipCon='请输入正确的手机验证码';
                    }
                    if(this.userPhoneNum&&reg.test(this.userPhoneNum)){
                        checkNum++;
                    }else{
                        tipCon='请输入正确格式的手机号码';
                    }
                    if(this.userName&&this.userName!=''){
                        checkNum++;
                    }else{
                        tipCon='请输入您的姓名';
                    }
                    if(checkNum==3){
                        this.postLogin(this.userName,this.userPhoneNum,this.userLeavMessage,this.userVerificationCode);
                    }else{
                        this.toast = this.$createToast({
                            txt: tipCon,
                            type: 'txt',
                            time: 1000
                        })
                        this.btnLoginShow=false;
                            this.toast.show();
                        
                    }
                },500)
                
            }
        },
        mounted(){
            this.getData(this.pageNow,this.pageSize,false);
        },
        watch:{
            scrollTopVal:{
                 handler:function(newVal,oldVal){
                     if(newVal>=800){
                         this.isTop = true;
                     }else{
                         this.isTop = false;
                     };
                },
                deep:true,
                // immediate:true,
            }
        }

};
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
    .btn-group-vertical{
        height: 40px;
    }
    .btn-group-vertical .commonSearch{
        height: 40px;
    }
    .btnOk-icon{
        width: 200px;
        height: 120px;
        background-color:rgba(0,0,0,0.6);
        p{
            margin: 0 auto;
            width: 43px;
            height: 43px;
            background:url('../../common/images/gotoTop.png')  50% 50% no-repeat;
            background-size:43px 43px;
        } 
        span{
            text-align: center;
            width: 100%;
            display: inline-block;
            padding: 0 10px;
            font-size: 12px;
        }
    }
    .backTop{
        width: 40px;
        height: 40px;
        position: fixed;
        right: 0.25rem;
        bottom: 0.46875rem;
        border-radius: 50%;
        -webkit-box-shadow: 0 0 5px rgba(0,0,0,0.2);
        box-shadow: 0 0 5px rgba(0,0,0,0.2);
        z-index: 1;
        background:rgba(255,255,255,0.6) url('../../common/images/gotoTop.png')  50% 50% no-repeat;
        background-size: 24px 24px;
    }
    .isDataNone{
        display: inline-block;
        width: 100%;
        height:45px;
        line-height: 45px;
        text-align: center;
        color: #AEAEAE;
    }
    .cube-toast .cube-popup-content{
        width: 280px;
        max-width: 280px;
        text-align: center;
        padding-left: 0px;
        padding-right: 0px;
        font-size: 12px;
    }
    .cube-toast-tip{
        text-align: center;
        width: 100%;
        max-width: 100%;
    }
    .classifyBtn{
        font-size: 12px;
        color: #5e5e5e;
        height: 41px;
        line-height: 35px;
        border-bottom:6px solid #f2f2f2;
        text-align: left;
        padding: 0 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .icon-click{
            background: url('../../common/images/rightjiantou.png')  no-repeat;
            width: 7px;
            display: inline-block;
            height: 11px;
            background-size: 100%;
        }
    }
    .fl{
        float: left;
    }
    .fr{
        float: right;
    }
    .abc{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .webSiteBox{
        position: relative;
        height: 100%;
        overflow: hidden;
        .webSiteContent{
        }
    }
    body{
        background: #f7f7f7;
    }
    body,html{
        overflow: hidden;
        position: relative;
        height: 100%;
    }
    .registerBox{
        margin-bottom: 25px;
        position: relative;
        .btnLogin{
            width: 60px;
            position: absolute;
            left: 50%;
            margin-left: -30px;
            top: 50%;
            margin-top: -30px;
            height: 60px;
            border-radius: 5px;
            background-color:rgba(0,0,0,0.6); 
        };
        .btnOkBox{
            width: 200px;
            height: 120px;
            border-radius: 5px;
            position: absolute;
            left:50%; 
            margin-left: -100px;
            top: 50%;
            margin-top: -60px;
            background-color:rgba(29,27,27,0.6);
            p{  
                width: 43px;
                height: 43px;
                margin: 15px auto;
                background: url('../../common/images/webSite.jpg') no-repeat;
                background-size:43px 43px;
            };
            span{
                display: block;
                padding: 0 10px;
                text-align: center;
                font-size: 12px;
                color: #fff;
                line-height: 18px;
            }
        }
    }
    #app{
        height: 100%;
    }
    .register{
        input::-webkit-input-placeholder{
            color: #949494;
        }    /* 使用webkit内核的浏览器 */
        input:-moz-placeholder{
            color: #949494;
        }                  /* Firefox版本4-18 */
        input::-moz-placeholder{
            color: #949494;
        }                  /* Firefox版本19+ */
        input:-ms-input-placeholder{
            color: #949494;
        }           /* IE浏览器 */
        textarea::-webkit-input-placeholder{
            color: #949494;
        }    /* 使用webkit内核的浏览器 */
        textarea:-moz-placeholder{
            color: #949494;
        }                  /* Firefox版本4-18 */
        textarea::-moz-placeholder{
            color: #949494;
        }                  /* Firefox版本19+ */
        textarea:-ms-input-placeholder{
            color: #949494;
        }
        .registerCon{
            font-size: 12px;
            background: #fff;
            padding: 10px 20px;
            input,textarea,span{
                margin-top: 10px;
            }
            // input:focus,textarea:focus{
            //     border-color:none;
            //     border-color:red  
            // }
            P{
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .longInput{
                width: 280px;
                height: 30px;
                border: 1px solid #e4e4e4;
                padding: 0 10px;
                border-radius: 2px
            }
             .smallInput{
                width: 180px;
                // float: left;
                height: 30px;
                border: 1px solid #e4e4e4;
                padding: 0 10px;
                border-radius: 2px
            }
            .verificationCode{
                width:89px;
                height:30px;
                // float: right;
                background: #3D9BE9;
                font-size: 12px;
                color: #fff;
                display: inline-block;
                text-align: center;
                line-height: 30px;
                border-radius:2px;
            }
            .leavMessage{
                width: 280px;
                height: 50px;
                border: 1px solid #e4e4e4;
                padding: 5px 10px;
                border-radius: 5px
            }
            
        }
    }
    .btn-group-vertical{
        height: 40px;
    }
    .webBannerBox{
        margin-bottom: 10px;
        background: #f7f7f7;
        overflow: hidden;
         img{
             width: 320px;
            height: 101px;
         }
        .webBanner{
            width: 320px;
            height: 101px;
            margin-top: 6px;
            background-color: #FE7A4A;
            text-align: center;
            line-height: 101px;
            font-size: 14px;
            color: #fff;
            background: url('../../common/images/webSite.jpg') no-repeat;
            background-size: 100%
        }
    }
    .Submission{
        width: 280px;
        height: 30px;
        background: #3D9BE9;
        color: #fff;
        border-radius: 2px;
        display: block;
        line-height: 30px;
        text-align: center;
        margin: 0 auto;
    }
    .templateList{
        overflow-y: auto;
        position: absolute;
        bottom: 0px;
        left: 0px;
        right: 0px;
        top:40px;
        ul{
            padding: 0 6px;
        }
        .templateCon{
            background-color: #fff;
            .imgBox{
                display: block;
                width: 308px;
                height: 260px;
                background: #bbbbbb;
                overflow: hidden;
            }
            p{
                width: 100%;
                height:50px;
                line-height: 50px;
                text-align: left;
                padding: 0 10px;
                border-bottom: 1px solid #F2F2F2;
                .t-name{
                    font-size: 14px;
                    color: #434343;
                }
                .t-price{
                    font-size:14px;
                    color: #3D9BE9;
                }
                .t-look{
                    width: 120px;
                    height: 30px;
                    border-radius: 58px;
                    text-align: center;
                    line-height: 30px;
                    background: #60C1E8;
                    color: #fff;
                }
            }
        }
    }
</style>
