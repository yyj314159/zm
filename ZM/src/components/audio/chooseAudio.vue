<template>
  <div id="chooseAudio">
    <p class="haveChoose">已选择分类:{{hasChooseAudio}}</p>

    <section class="content">
      <!-- 内容过多需要滚动 -->

      <cube-scroll ref="scroll" id="pokCreator">
        <ul class="bigClass">
          <!-- 音频大类 -->
          <li v-for="(item,i1) in dataList" :key="i1" @click="showUl(i1)">
            <div class="contentList">
              <h4>{{item.name}}</h4>
              <img src="../../common/images/clickDown.png" alt="右箭头">
            </div>

            <ul class="smallClass" v-show="i1==currentIndex">
              <!-- 音频小类 第一个为全部 剩下的为后台接口数据 -->
              <li>
                <div class="radioBox" style="width:100%">
                  <label
                    for="all"
                    style="width:100%;display:inline-block"
                    @click="chooseRadio(item)"
                  >
                    <input type="radio" id="all" name="radios" value="全部">
                    <span>全部</span>
                  </label>
                </div>
              </li>
              <li v-for="(second,i2) in item.childrenItem" :key="i2">
                <div class="radioBox" style="width:100%">
                  <label
                    :for="second.id"
                    style="width:100%;display:inline-block"
                    @click="chooseRadio(item,second)"
                  >
                    <input
                      type="radio"
                      :id="second.id"
                      name="radios"
                      :value="item.name+'-'+second.name"
                    >
                    <span>{{second.name}}</span>
                  </label>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </cube-scroll>
    </section>
    <div class="cancel" @click="showChooseAudio">取消</div>
  </div>
</template>
<script>
import { setTimeout } from "timers";
import { Scroll } from "cube-ui";
export default {
  data() {
    return {
      items2: [
        {
          class: "音频大类01",
          list: [
            { fids: "01", name: "音频小类01-1" },
            { fids: "02", name: "音频小类01-2" },
            { fids: "03", name: "音频小类01-3" }
          ]
        },
        {
          class: "音频大类02",
          list: [
            { fids: "04", name: "音频小类02-1" },
            { fids: "05", name: "音频小类02-2" },
            { fids: "06", name: "音频小类02-3" }
          ]
        }
      ],
      showList: false,
      currentIndex: 0,
      hasChooseAudio: "",
      dataList: []
    };
  },
  methods: {
    showChooseAudio() {
      this.$store.dispatch("SHOW_CHOOSE_AUDIO", {
        chooseAudio: false,
        musicClass: "音频分类"
      });
    },
    showUl(i) {
      this.currentIndex = this.currentIndex ==i ? -1 :i
    },
    chooseRadio(first, second) {
      let name1 = first.name;
      let id1 = first.id;
      let ids = null;
      if (second) {
        //如果点击了非全部
        let name2 = second.name;
        let id2 = second.id;
        this.hasChooseAudio = name1 + "-" + name2;
        ids = id1 + "-" + id2;
      } else {
        //点击全部
        this.hasChooseAudio = name1;
        ids = id1;
      }
      let test = `<span style="color:#3992db">${
        this.hasChooseAudio
      }</span> <input value='${ids}' id='hide' type='hidden'/>`;
      setTimeout(() => {
        this.$store.dispatch("SHOW_CHOOSE_AUDIO", {
          chooseAudio: false,
          musicClass: test
        });
      }, 1000);
    }
  },
  created() {
    let that = this;
    that.HttpCli.get("/audio_web/music/queryFirstCategory").then(res => {
      if (res.data.status == 0) {
        that.dataList = res.data.data.categoryList;
      }
    });
  }
};
</script>
<style lang="scss" scoped>
#chooseAudio {
  width: 280px;
  height: 100%;
  background: #f7f7f7;
  position: absolute;
  z-index: 9999;
  right: 0;
  bottom: 0;
  text-align: left;
  font-family: "Microsoft YaHei";
  .haveChoose {
    background: #fff;
    padding: 15px 5px 15px 10px;
  }
  .content {
    background: white;
    margin-top: 6px;
    height: calc(100% - 50px);
    // min-height: 300px;
    position: relative;
    .bigClass {
      padding-bottom: 100px;
      li {
        padding: 10px 10px 0 10px;
        border-bottom: 1px solid #f2f2f2;
        .contentList {
          display: flex;
          justify-content: space-between;
          padding-bottom: 10px;
          img {
            height: 6px;
            margin-top: 4px;
          }
        }

        .smallClass {
          width: 100%;
          li {
            padding: 10px 0;
            border-top: 1px solid #f2f2f2;
            border-bottom: none;
            .radioBox {
              input[type="radio"] + span::before {
                content: "\a0";
                display: inline-block;
                vertical-align: middle;
                font-size: 12px;
                width: 12px;
                height: 12px;
                margin-right: 10px;
                border: 1px solid #d9d9d9;
                border-radius: 50%;
                text-indent: 5px;
                line-height: 1;
                margin-top: -2px;
              }
              input[type="radio"]:checked + span::before {
                width: 10px;
                height: 10px;
                background-clip: content-box;
                background: #64afed url("../../common/images/selected.png")
                  no-repeat center;
                background-size: 80%;
                padding: 2px;
                border: none;
                margin-top: -2px;
              }
              input[type="radio"] {
                position: absolute;
                clip: rect(0, 0, 0, 0);
              }
            }
          }
        }
      }
    }
  }
  .cancel {
    position: absolute;
    left: 0;
    bottom: 0px;
    text-align: center;
    width: 100%;
    line-height: 40px;
    background: #fff;
    z-index: 9999;
  }
}
</style>