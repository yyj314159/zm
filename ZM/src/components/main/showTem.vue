<template>
  <div class="showTem" :style="{height:HeightW}">
    <div id="Whead" ref="Whead">
      <div id="left" @click="goBack()">      
        <img src="../../common/images/gobackpng.png" >&nbsp;
        <span>模板分类</span>      
      </div>
      <div id="right"> 
        <span @click="goBack()">{{bigT}}＞</span>   
        <span @click="goS">{{smlT}}</span>      
      </div>

    </div >
    <ul id="contentBox">
      <cube-scroll>
        <div class='temList ' v-for="(item,index) in templateList" :key="index">
          <div class='temListImg' :style="{backgroundImage:  (item.fUrl2  ? 'url('+item.fUrl2+')':'url(/static/img/u203.jpg)')}"></div>
          <div class='temListCon'>
              <div class="productTitle">{{item.fName}}</div>
              <div class="productBut" @click.stop.prevent="preview(item.fId)">预览</div>
              <div class='both'></div>
              <div class='productList'>
                  <span class='redCard' v-if="item.existCategoryList">{{item.existCategoryList[0]}}</span>
                  <span class='orangeCard' v-if="item.existCategoryList">{{item.existCategoryList[1]}}</span>
                  <span class='grayCard' v-if="item.existCategoryList">{{item.existCategoryList[2]}}</span>
                  <!-- <span class='redCard'>食品类</span><span class='orangeCard'>化妆品</span><span class='grayCard'>医药保健类</span> -->
              </div>
          </div>
        </div>
      </cube-scroll>
    </ul>
  </div>
</template>
<script>


export default {
  name: "showTem",
  data() {
    return {
      HeightW:'', // 屏幕动态高度
      // 大类
      bigT:'大类',
      // 小类
      smlT:this.$route.query.smlT,
      fCategoryId:this.$route.query.fCategoryId,
      sId:this.$route.query.categoryId,
      // 详细数据
      templateList:undefined,
      
    };
  },

  mounted() {
    // 初始加载页面清除数据
    let that = this;
    let urlwebT = '/passportapi' + this.ConstStr.webT;
    let parmasT = {
        iDisplayStart:0,
        iDisplayLength:15,
        fStatus:5,
        fIsTrash:0,
        // fCategoryId:this.fCategoryId,
        fCategoryId:'ec47855e6bcb483ea9b91f7be078bad0'
    }
    this.HttpCli.post(urlwebT,parmasT).then(res =>{
      if(res.data){
        // 拿到大类类目
        console.log(res.data)
        this.bigT = res.data.data[0].fLargeCategoryName
         this.templateList = res.data.data
      }
    })  
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
    goS(){
      this.$router.replace({ path: '/webTem', query:{sId:this.sId}});
    },
    preview(id){
      console.log(id,location.protocol+'//mobview.'+location.host.split('.')[1]+'.com/pre/'+ id+'?type=template&version=',123123)
      window.open(location.protocol+'//mobview.'+location.host.split('.')[1]+'.com/pre/'+ id+'?type=template&version=','_blank');
    },

  },

};
</script>

<style lang="scss" scoped>
.showTem {
  width: 100%;
  position: relative;
  #Whead {
    width: 100%;
    height: 46px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    top: 0;
    text-align: center;
    font-weight: bolder;
    background-color: white;
    padding: 0 4px;
    box-sizing: border-box;
    border-bottom: 1px solid #f2f2f2;
    #left{
      img {
          position: absolute;
          left: 4px;
          top: 16px;
          display: inline-block;
          width: 14px;
          height: auto;
      }
      span{
        font-size: 14px;
        margin-left: 15px;
      }
    }
    #right{
      span{
        font-size: 14px;
        color: #3d9be9;
      }
    }

  }
  #contentBox {
    position: absolute;
    width: 100%;
    height: 522px;
    top: 46px;
    bottom:0;
    overflow: auto;
    width: 100%;
      .temList{
        padding:10px 18px;
        .temListImg{
            height:330px;
            overflow: hidden;
            border-top-left-radius:10px;
            border-top-right-radius:10px;
            box-shadow: 0 0 15px -3px rgba(0,0,0,.5);
            background-repeat:no-repeat;
            background-position:center;
            background-size:100% auto;
        } 
        .temListCon{
            height:55px;
            background-color:#fff;
            padding:10px 15px;
            border-bottom-left-radius:15px;
            border-bottom-right-radius:15px;
            box-shadow: 0 0 15px -3px rgba(0,0,0,.5);
            .productTitle{
                float:left;
                font-size:15px;
                font-weight:700;
                margin-bottom: 5px;
                width:180px;
                text-align: left;
                overflow:hidden;
                white-space:nowrap;
                text-overflow:ellipsis;
            }
            .productBut{
                float:right;
                width:60px;
                height:30px;
                background-color:rgba(61,155,233,1);
                color:#ffffff;
                font-size:12px;
                text-align:center;
                line-height:30px;
                font-weight:700;
                border-radius:33px;
            }
            .productList{
                margin-top:5px;
                height:15px;
                span{
                    float:left;
                    font-size:10px;
                    line-height:10px;
                    padding:3px 6px;
                    margin-right:3px;
                    border-radius:2px;
                }
            }
            .redCard{
              font-size: 10px !important;
                color:#FF0000;
                border:1px solid rgba(255,0,0,1);
            }
            .orangeCard{
                color:#FFA000;
                border:1px solid rgba(255, 160, 0, 1);
            }
            .grayCard{
                color:#999999;
                border:1px solid rgba(153, 153, 153, 1);
            }

        }
    }

  }
  
}
</style>
