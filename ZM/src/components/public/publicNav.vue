<template>
    <div class="public-nav" ref="nav">
        <div class="triangle-up"></div>
        <ul>
            <li>
                <a href="/" class="nav-icon">
                    <img src="/img/homePage.png" alt="">
                </a>
                <a href="/" class="nav-title">首页</a>
            </li>
            <li v-for="(item,index) in navList" :key="index">
                <a :href="item.href" class="nav-icon">
                    <img :src="item.iconSrc" alt="">
                    <i class="hasProduct" v-if="hasProduct&&item.navTitle=='购物车'"></i>
                </a>
                <a :href="item.href" class="nav-title">{{item.navTitle}}</a>
            </li>
            <li>
                <a href="/wap/customService/message_list" target="_blank" class="nav-icon">
                    <img src="/img/myMessage.png" alt="">
                    <i class="hasMessage" v-if="hasMssage"></i>
                </a>
                <a href="/wap/customService/message_list" class="nav-title">我的消息</a>
            </li>
            <li>
                <a href="/wap/member/memberCenterIndex" class="nav-icon">
                    <img src="/img/vipCenter.png" alt="">
                </a>
                <a href="/wap/member/memberCenterIndex" class="nav-title">会员中心</a>
            </li>
        </ul>
    </div>
</template>

<script>
    import Interface from "../../common/js/ConstStr";
    import axios  from "axios";
    export default {
        data(){
            return {
                hasMssage:false,
                hasProduct:false,
            }
        },
        props:{
            navList:{
                type:Array,
                required: false,
            }
        },
        methods:{
          async getMessage(){
             let status =  await axios({url:Interface.Logon});
              if(status.data.data==0){
                  console.log("未登录")
              }else{
                  axios.all([
                      axios.get(Interface.mesNum),
                      axios.get(Interface.sCartNum)
                  ]).then(axios.spread((messageCount,cartSum)=> {
                            if(messageCount.data!=0)this.hasMssage = true;
                            if(cartSum.data.data!=0)this.hasProduct = true;

                      }));
              }
          }
        },
        mounted(){
           this.getMessage()
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

    /*导航部分*/
    .public-nav
        position absolute
        right 18px
        top 30px
        z-index 99
        .triangle-up
            width 0
            height 0
            border-left 5px solid transparent
            border-right @border-left
            border-bottom 5px solid #000000
            margin-left 92px
        ul
            background #484848
            width 109px
            border-radius 4px
            li
                height 36px
                line-height 36px
                display flex
                &:last-child
                    .nav-title
                        border-bottom none
                .nav-title
                    width 74px
                    color #FFF
                    border-bottom solid 1px #6D6D6D
                    text-align left
                    box-sizing border-box
                .nav-icon
                    width 35px
                    position relative
                    img
                        width 15px
                        height 15px
                        position absolute
                        left 0
                        bottom 0
                        right 0
                        top 0
                        margin auto
                    i
                        display inline-block
                        height 6px
                        width 6px
                        border-radius 50%
                        background #f00
                        position absolute
                        top 10px
                        left 20px


</style>