<template>
  <div class="webShow" :style="{height:HeightW}">
    <div id="Whead" ref="Whead">
      <img src="../../common/images/gobackpng.png" @click="goBack" @load="imgAutoAdapt">
        建站演示视频
    </div>
    <cube-scroll>
      <ul id="contentBox"  @scroll.stop="scroll" ref="scroll">
          <li :key="n" v-for="(item,n) in webData" @click="play(item.fVideoAddress)">
              <img :src="item.fVideoThumbnail"  >
              <p>{{item.fVideoName}}</p>
          </li>
          <div id='Loading'>
            <Loading v-show="showLoading"></Loading>
            <div class="after-all" v-if="afterAll">╮(╯﹏╰)╭&nbsp;&nbsp;已经到底了</div>
          </div>
      </ul>
    </cube-scroll>
  </div>
</template>
<script>
import Loading from "../public/loading";
export default {
  name: "webShow",
  data() {
    return {
      picSrc:this.ConstStr.picSrc, // 静态常量
      showLoading:false,    //是否显示loading组件
      afterAll:false,
      diff:null,
      isGetData:true,   //是否获取数据
      HeightW:'', // 屏幕动态高度
      webData:[],       // 网站数据
    };
  },
  components:{
    Loading
  },
  mounted() {
    // 初始加载页面清除数据
    let that = this;
    let url = this.ConstStr.website
    this.HttpCli.get(url).then(
        res => {
            if(res.data.status == 0){
                that.webData = res.data.data
            }
        }
    )   
    that.$nextTick(() => {
        //根据不同手机设置不同高度
        let phoneHeight = window.innerHeight;
        this.HeightW= phoneHeight+'px';
    });
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    imgAutoAdapt:function(e){
      this.MethodsUtil.imgAutoAdapt(e.target,true)
    },
    play(adr){
        window.open(adr,'height=200,width=200,top=30,resizable=no')
    },
    scroll(e){
      let scrollHeight = this.$refs.scroll.scrollHeight;
      let scrollTop = this.$refs.scroll.scrollTop ;
      let diff = scrollHeight+this.$refs.Whead.offsetHeight-scrollTop-Math.floor(`${document.documentElement.clientHeight}`);
      this.diff = diff;
    }
  },
  watch:{
    diff(diff){
      if(diff == 0){
        this.afterAll = true;
        this.showLoading = true;
        setTimeout(()=>{
            this.afterAll = false;
            this.showLoading = false;
        },2000)
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.webShow {
  width: 100%;
  position: relative;
  #Whead {
    width: 100%;
    height: 46px;
    position: fixed;
    top: 0;
    text-align: center;
    line-height: 46px;
    font-size: 16px;
    font-weight: bolder;
    background-color: white;
    padding: 0 4px;
    box-sizing: border-box;
    border-bottom: 1px solid #f2f2f2;
    img {
        position: absolute;
        left: 4px;
        top: 16px;
        display: inline-block;
        width: 14px;
        height: auto;
    }
  }
  #contentBox {
    position: absolute;
    width: 100%;
    top: 46px;
    bottom:0;
    overflow: auto;
    width: 100%;
    li{width: 50%; display: flex; float: left; margin: 12px 0; flex-direction: column; justify-content: center; align-items: center;
        img{display: block; width: 136px; height: 76px; margin-bottom: 6px;}
        p{width: 100%; white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
    }
    #Loading{
      margin-top: 2px;
      .after-all{
        width: 100%;
        height:45px;
        line-height: 45px;
        text-align: center;
      }
    }
  }
  
}
</style>
