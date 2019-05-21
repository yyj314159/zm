<template>
  <div id="creatorFillter">
    <ul>
      <li class="creatorType">
        <h1>类型</h1>
        <ul class="creatorType-list creatorList-ul">
          <li v-for="(li,i) in typeCreator" :key="i"  @click="SelectCreator(li.fValue,$event,i,0)">
            <span class="selectedWrap" v-show="typlLi==i">
              <div class="selectImgBoxC">
                <img src="@/common/images/selected.png" alt="select">
              </div>
            </span>
            {{li.fText}}
          </li>
        </ul>
      </li>
      <li class="creatorCountry">
        <h1>国籍</h1>
        <ul class="creatorCountry-list creatorList-ul">
            <!-- 中国-_-中国台湾-_-中国香港-_- -->
          <li v-for="(li,i) in guojiCreator.slice(0,3)" :key="i" @click="SelectCreator(i+1,$event,i,1)">
            <span class="selectedWrap" v-show="guojiLi==i">
              <div class="selectImgBoxC">
                <img src="@/common/images/selected.png" alt="select">
              </div>
            </span>
            {{li.fText}}
          </li>
          <!-- 所有的外国统称为海外 -->
          <li @click="SelectCreator(4,$event,3,1)">
            <span class="selectedWrap" v-show="guojiLi==3">
              <div class="selectImgBoxC">
                <img src="@/common/images/selected.png" alt="select">
              </div>
            </span>海外
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
<script>
import bus from './bus.js'
export default {
  data() {
    return {
      typeCreator: [],
      guojiCreator: [],
      typlLi: -1,
      guojiLi: -1,
    typeValue:null,
      guojiValue:null,
    };
  },
  created() {
    let that = this;
    that.getCreatorSearchData("WRITERTYPE"); //加载类型筛选条件
    that.getCreatorSearchData("COUNTRY"); //加载国籍筛选条件
  },
  methods: {
    //获取创作人国籍类型信息
    getCreatorSearchData(parms) {
      let that = this;
      that.HttpCli.get("/dictionary/getDictionaryInfoByType", {
        type: parms
      }).then(res => {
        if (parms == "WRITERTYPE") {
          this.typeCreator = res.data.data;
        } else {
          this.guojiCreator = res.data.data;
        }
      });
    },
    //创作人 条件信息筛选
    SelectCreator(data, event, i, type) {
      if (type == 0) {
        this.typlLi = this.typlLi == i ? -1 :i
        this.typeValue=data;
      } else {
        this.guojiLi = this.guojiLi == i ?-1:i
        this.guojiValue=data
      }

      console.log(data, this.typlLi, "参数们11", type);
    },
    defineSearch(){
        bus.$emit('creator-confirm',this.typeValue,this.guojiValue)
    },
    clearAll(){
        this.typeValue='';
        this.guojiValue='';
        this.typlLi= -1;
         this.guojiLi= -1;
    }

  }
};
</script>

<style lang="scss">
.content{
  width: 100%
}
#creatorFillter {
  h1 {
    padding: 10px 0 10px 5px;
    border-bottom: 1px solid #f2f2f2;
    text-align: left;
  }
  .creatorList-ul {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0 10px;
    li {
      display: inline-block;
      width: 30%;
      background: #f7f7f7;
      text-align: center;
      line-height: 30px;
      margin-top: 10px;
      position: relative;
      .selectedWrap {
        position: absolute;
        width: 100%;
        height: 100%;
        display: block;
        background: rgba(61, 155, 233, 0.1);
        right: 0;
        .selectImgBoxC {
          right: 0;
          bottom: 0;
          position: absolute;
          height: 0px;
          width: 0px;
          border-bottom: 20px solid rgba(61, 155, 233, 0.9);
          border-left: 20px solid transparent;
          box-sizing: border-box;
          text-align: center;
          img {
            display: inline-block;
            width: 10px;
            height: 10px;
            right: 1px;
            bottom: -20px;
            position: absolute;
          }
        }
      }
    }
  }
}
</style>