<template>
  <div class="Footer">

      <div id="hPage" class="size">
        <p></p>首页
      </div>

      <div id="mes" class="size" @click="link('mes')">
        <p></p>消息
        <span v-show="mesN"></span>
      </div>
      <div id="sCart" class="size" @click="link('scart')"> 
        <p></p>购物车
        <span v-show="sCartN">{{sCartNum}}</span>
      </div>


      <div id="mine" class="size" @click="link('mine')">
        <p></p>我的
      </div>
  </div>
</template>
<script>
import {mapState, mapGetters, mapMutations} from 'vuex';
import { type } from 'os';
export default {
  name: "Footer",
  data() {
    return {
      mesN:false,
      sCartN:false,
      sCartNum:0,
    };
  },
  mounted(){
    // 判断登录状态
    let that = this;
    let urlL = this.ConstStr.Logon
    this.HttpCli.get(urlL).then(
      res => {
        if(res.data.data != 0){
          // 请求后台消息数量
          let urlMes = this.ConstStr.mesNum
          this.HttpCli.get(urlMes).then(        
            res =>{
              if(res.data != 0){
                this.mesN =  true; 
              }         
            }
          )
          // 请求后台购物车数量
          let urlScart = this.ConstStr.sCartNum
          this.HttpCli.get(urlScart).then(
            res =>{
              if(res.data.data != 0){
                that.sCartN = true;
                that.sCartNum =  res.data.data
              }          
            }
          )
        }
      }
    )
  },
  methods:{
    link(route){
      if(this.Logon == 0){
          window.location.href = this.ConstStr.Login;
      }else{
        switch(route){
          case'mes': window.location.href = this.ConstStr.mes;break;
          case'scart': window.location.href = this.ConstStr.scart;break;
          case'mine': window.location.href = this.ConstStr.mine;break;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .Footer {
    width: 100%;
    height: 46px;
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    padding: 10px 0;
    background-color: white;
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 9;
    .size {
      width: 60px;
      height: 36px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      p {
        width: 20px;
        height: 20px;
        background-size: auto 100%;
      }
    }
    #hPage {
      p {
        background-image: url("../../common/images/public/homeAt.png");
      }
    }
    #mes {
      position: relative;
      p {
        background-image: url("../../common/images/public/mes.png");
      }
      span {
        display: block;
        width: 6px;
        height: 6px;
        background-color: red;
        border-radius: 50%;
        position: absolute;
        left: 36px;
      }
    }
    #sCart {
      position: relative;
      p {
        background-image: url("../../common/images/public/sCart.png");
      }
      span {
        transform: scale(0.8);
        display: block;
        width: 20px;
        height: 12px;
        text-align: center;
        line-height: 12px;
        background-color: red;
        border-radius: 5px;
        position: absolute;
        left: 34px;
        top: -2px;
        font-size: 6px;
        color: white;
      }
    }
    #mine {
      p {
        background-image: url("../../common/images/public/mine.png");
      }
    }
  }
</style>
