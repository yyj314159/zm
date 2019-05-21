<template>
  <div class="Main" ref="homePage">
    <div id="head">
      <img src="../../common/images/public/Logo.png" >
      <div id="searchBox" @click="webShow('sortPage')">
        <img src="../../common/images/searchIcon.png" alt>
        <span>搜索</span>
      </div>
      <div id="location" @click="selectArea">
        {{deAdr}}<img id="turnR" src="../../common/images/public/turnR.png" alt>
      </div>
    </div> 
    <cube-scroll>
      <ul id="nav" class="comCss">
        <li :key="n" v-for="(route,n) in routeData">
          <router-link :to="route.route">
            <img :src=route.png alt>
            <p>{{route.name}}</p>
          </router-link>
        </li>
        <router-view/>
      </ul>
      <div id="Intro" class="comCss">
        <img src="../../common/images/public/webAdv.jpg" @click="webShow('webAdv')">
        <img src="../../common/images/public/webTem.jpg" @click="webShow('webTem')">
        <img src="../../common/images/public/webShow.jpg" @click="webShow('webShow')">
      </div>
      <div id="content">
        <div id="product" class="comCss">
          <div class="title">
            <img src="../../common/images/public/H_Prod.png" alt>购物&nbsp;&nbsp;&nbsp;
          </div>
          <ul :key="n" v-for="(items,n) in productData">
            <li :key="index" v-for="(item,index) in items"  @click="search(1,item.fName,item.fId)">{{item.fName}}</li>
          </ul>
        </div>
        <div id="service" class="comCss">
          <p class="title">
            <img src="../../common/images/public/H_Sev.png">找服务
          </p>
          <ul :key="n" v-for="(items,n) in serviceData">
            <li :key="index" v-for="(item,index) in items" @click="search(2,item.fName,item.fId)">{{item.fName}}</li>
          </ul>
        </div>
        <div id="video" class="comCss">
          <p class="title">
            <img src="../../common/images/public/H_Vid.png">找视频
          </p>
          <ul :key="n" v-for="(items,n) in videoData">
            <li :key="index" v-for="(item,index) in items" @click="search(3,item.fName,item.fId)">{{item.fName}}</li>
          </ul>
        </div>
        <div id="audio" class="comCss">
          <p class="title">
            <img src="../../common/images/public/H_Aud.png">找声音
          </p>
          <ul :key="n" v-for="(items,n) in audioData">
            <li :key="index" v-for="(item,index) in items" @click="search(4,item.name,item.id)">{{item.name}}</li>
          </ul>
        </div>
        <div id="news" class="comCss">
          <p class="title">
            <img src="../../common/images/public/H_Nws.png">找新闻
          </p>
          <ul :key="n" v-for="(items,n) in newsData">
            <li :key="index" v-for="(item,index) in items" @click="search(5,item.fName,item.fId)">{{item.fName}}</li>
          </ul>
        </div>
        <div id="blog" class="comCss">
          <p class="title">
            <img src="../../common/images/public/H_Blg.png">找博客
          </p>
          <ul :key="n" v-for="(items,n) in blogData">
            <li :key="index" v-for="(item,index) in items" @click="search(6,item.fLabelName,item.fLabelId)">{{item.fLabelName}}</li>
          </ul>
        </div>
      </div>
    </cube-scroll>

    <transition name="rightIn">
        <choose-city v-if="choose_city" class="pick-city" @isShowCity="chooseCity" :alreadyCity="deAdr" :width = "'100%'"></choose-city>
    </transition>
    <Footer/>
  </div>
</template>
<script>
import {mapState, mapGetters, mapMutations} from 'vuex';
import chooseCity from "../public/chooseCity.vue";
import Footer from "../public/Footer.vue";
export default {
  name: "Main",
  data() {
    return {
      // 缓存高度
      offsetTop:0,
      // 地址选择
      choose_city: false,
      deAdr:'上海',
      //路由数据
      routeData: [
        { route: "/product", name: "购物" ,png:require('../../common/images/public/N_Prod.png')},
        { route: "/service", name: "找服务" ,png:require('../../common/images/public/N_Sev.png')},
        // { route: "/video", name: "找视频" ,png:require('../../common/images/public/N_Vid.png')},
        { route: "/audio", name: "找声音" ,png:require('../../common/images/public/N_Aud.png')},
        { route: "/information", name: "找资讯" ,png:require('../../common/images/public/N_Nws.png')},
        { route: "/website", name: "网站" ,png:require('../../common/images/public/N_Web.png')},
      ],
      // content数据
      productData: [],
      serviceData: [],
      videoData: [],
      audioData: [],
      newsData: [],
      blogData: [],
    };
  },
  computed:{
      ...mapGetters([
          "Logon"
      ]),
  },
  components:{
    chooseCity,Footer,
  },
//   activated() {
// 　　// keep-alive组件 页面进入的时候设置滚动高度
//     this.$refs.homePage.scrollTop = this.offsetTop;
//   },
//   beforeRouteLeave(to, from, next) {
//   //  组件离开的时候，获取页面滚动高度 
//     this.offsetTop = this.$refs.homePage.scrollTop;
//     next() 
//   }, 
  beforeMount() {
    let that = this;
    let url =this.ConstStr.Home
    this.HttpCli.get(url,{}).then(
      res => {
        if(res.data.status == 0){
          let data = res.data.data;
          this.productData = Rearr(data.product);
          this.serviceData = Rearr(data.service);
          this.videoData = Rearr(data.video);
          this.audioData = Rearr(data.music);
          this.newsData = Rearr(data.news);
          this.blogData = Rearr(data.blog);
        }else{
          console.log(res.data.message)
        }
      }
    )
    // 格式请求的数据
    function Rearr(arr){ 
        let arrN = [];
        let a = [];
        let n = Math.floor(arr.length/4)
        for(let i = 0; i<n;i++){
          for (let j =4*i; j<4*(i+1);j++) {
            a.push(arr[j])
          }
          arrN.push(a);
          a = []
        }
        return arrN;
    }  
    // 判断登录状态
    let urlL =this.ConstStr.Logon
    this.HttpCli.get(urlL).then(
      res => {
        // 改变state中的登录状态
        this.$store.dispatch('Logon',res.data.data)
        // 获取定位信息
        if(this.Logon == 0){
          // 百度地图定位信息
          let geolocation = new BMap.Geolocation();
          geolocation.getCurrentPosition(function(r){
            if(this.getStatus() == BMAP_STATUS_SUCCESS){
              that.deAdr = r.address.province
            }else {
              that.deAdr = '无定位'
            }        
          });
        }else{
          // 请求后台定位地址
          let urlLoc =this.ConstStr.LocQuery
          this.HttpCli.post(urlLoc).then(
            res =>{
              if(res.data.data)that.deAdr = res.data.data.fProvince;
            }
          )
        }
      }
    )
  },
  methods: {
    sortData() {
      console.log(this.$store.state.mesNum,this.$store.state.sCartNum)
      this.Hstatus = 2;
    },
    selectArea(){
      this.choose_city = true;
    },
    chooseCity(arg,address,n){
      if(!arg) this.choose_city = arg;
      let url = this.ConstStr.LocUpload;
      if(address){
        this.deAdr = address.fProvince;
        // 上传地址
        let parmas = {fProvinceId:address.fProvinceId,fProvince:address.fProvince}
        this.HttpCli.get(url,parmas).then(
          res =>{
            if(rtes.data.status == 0){

            }else{
              console.log('报错了')
            }
          }
        )
      }
    },
    webShow(str){
       this.$router.push({ path: "/"+ str });
    },
    search(type,name,id){
      let route = '';
      switch (type) {
        case 1: route = '/searchResult?searchType=P'; break;
        case 2: route = '/searchResult?searchType=S'; break;
        case 3: route = '/searchResult?searchType=V'; break;
        case 4: route = '/searchResult?searchType=AUDIO'; break;
        case 5: route = '/searchResult?searchType=N'; break;
        case 6: route = '/searchResult?searchType=B'; break;
        default: route = '/'; break;
      }
      this.$router.push({ path: route, query:{keyWord:name,id:id}});
    }
  }
};
</script>

<style lang="scss" scoped>
.Main {
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;
  padding-top: 46px;
  overflow: auto;
  #head {
    width: 100%;
    height: 46px;
    position: fixed;
    top: 0;
    background-color: white;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 4px;
    box-sizing: border-box;
    img {
      display: block;
      height:18px; 
      width:auto; 
    }
    #searchBox {
      background: #f2f2f2;
      width: 190px;
      padding-left: 6px;
      height: 26px;
      border-radius: 13px;
      display: flex;
      align-items: center;
      color: #cccccc;
      img {
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: 8px;
      }
    }
    #location {
      width: 50px;
      height: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      #turnR{display: block; height: 10px; width: auto; transform: rotate(90deg);}
    }
  }
  #nav {
    width: 100%;
    height: 78px;
    margin: 6px 0;
    padding: 4px 0;
    overflow: hidden;
    background-color: white;
    li {
      width: 20%;
      height: 70px;
      float: left;
      margin: 6px 0;
      img {
        display: inline-block;
        width: 40px;
        height: 40px;
        background-size: auto 100%;
      }
      p {
        margin-top: 2px;
      }
    }
  }
  #Intro {
    width: 100%;
    height: 120px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: white;
    margin-bottom: 6px;
    img {
      display: block;
      width: 96px;
      height: 96px;
      background-color: #cccccc;
    }
  }
  #content {
    margin-bottom: 52px;
    .comCss {
      background-color: white;
      margin-bottom: 6px;
      overflow: hidden;
      .title {
        width: 64px;
        height: 30px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        img {
          display: inline-block;
          width: 16px;
          height: auto;
          background-size: auto 100%;
        }
      }
      ul {
        width: 100%;
        height: 36px;
        border-bottom: 1px solid #f2f2f2;
        li {
          width: 25%;
          height: 20px;
          line-height: 20px;
          font-size: 10px !important;
          box-sizing: border-box;
          border-right: 1px solid #f2f2f2;        
          float: left;
          margin: 8px 0;
        }
        li:nth(4n) {
          border-right: none;
        }
      }
    }
  }
  .pick-city{
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 9999;
  }

}
    .rightIn-enter-active{
      animation: 0.5s rightIn ease;
    }
    .rightIn-leave-active{
        animation: 0.5s rightOut ease;
    }
    @keyframes rightIn {
        0%{
            right:-100%
        }
        100%{
            right: 0;
        }
    }
    @keyframes rightOut {
        0%{
            right:0
        }
        100%{
            right: -100%;
        }
    }
</style>
