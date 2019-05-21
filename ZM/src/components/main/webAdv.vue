<template>
  <!-- 产品优势详情 -->
  <div class="webAdv">
    <div id="Whead" ref="Whead">
      <img src="../../common/images/gobackpng.png" @click="goBack">
      产品优势
    </div>
    <section id="contentBox" :style="{height:HeightW}">
      <div>
        <!-- 编辑功能 -->
        <dl>
          <dt>
            <img src="../../common/images/public/editor.png" alt>
            <h6>强大的网页编辑能力</h6>
          </dt>
          <dd>
            <ul>
              <li>
                <h1>自由拖拽组合</h1>
                <p>组件允许自由拖拽，调整位置，满足页面排版需求。</p>
              </li>
              <li>
                <h1>精彩网站模板</h1>
                <p>我们提供大量的精彩网站模板满足各行各业的建站需求。</p>
              </li>
              <li>
                <h1>丰富精美组件</h1>
                <p>上百种精美组件满足用户的建站需求。</p>
              </li>
              <li>
                <h1>样式自由调整</h1>
                <p>样式可根据客户需求自由调整，轻松实现组件切换。</p>
              </li>
              <li>
                <h1>手机自动适应</h1>
                <p>PC端完成网页排版后，手机端自动实现排版。</p>
              </li>
              <li>
                <h1>历史版本备份</h1>
                <p>我们为用户提供50次历史版本数据备份，多服务器存储，确保数据安全。</p>
              </li>
              <li>
                <h1>轻量化Html</h1>
                <p>轻量化Html网页发布，网页快捷响应。</p>
              </li>
              <li>
                <h1>微传单快速发布</h1>
                <p>发布微传单，让信息通过微信实现快速传播。</p>
              </li>
              <li>
                <h1>精美免费影像资源</h1>
                <p>提供海量精美版权图片及视频，供建站用户免费使用。</p>
              </li>
              <li>
                <h1>在线操作，随时预览效果</h1>
                <p>实现编辑过程随时可预览，预览页面支持交互效果展示，所见即所得。</p>
              </li>
            </ul>
          </dd>
          <p>
            <!-- <router-link to="/product">入驻建站</router-link> -->
            <a href="javascript:;" @touchend="toCreate($event)">入驻建站</a>
            <span>&nbsp;&gt;</span>
          </p>
        </dl>
        <!-- 发布功能 -->
        <dl>
          <dt>
            <img src="../../common/images/public/release.png" alt>
            <h6>强大的发布功能</h6>
          </dt>
          <dd>
            <ul>
              <li>
                <h1>产品发布</h1>
                <p>支持新品、二手、定制商品的在线发布，提供运费模板供维护，提供分阶段付款交易流程。</p>
              </li>
              <li>
                <h1>服务发布</h1>
                <p>支持上门服务、到店服务、线上服务、电话服务、代办服务SKU在线发布，提供预约时间工具，提供分时段付款流程。</p>
              </li>
              <li>
                <h1>视频发布</h1>
                <p>支持上电影、剧集、微视频、预告片、花絮的发布，提供强大弹幕功能，支持视频收费播放。</p>
              </li>
              <li>
                <h1>创作人认领</h1>
                <p>站点通过创作人认领，取得创作人音频作品发布权，并设置创作人收益比例。</p>
              </li>
              <li>
                <h1>音频作品发布</h1>
                <p>快速发布音频文件，提供歌词发布工具，支持为音频作品定价。</p>
              </li>
              <li>
                <h1>新闻动态发布</h1>
                <p>支持图文新闻、图集新闻及视频新闻的快速发布。</p>
              </li>
              <li>
                <h1>博客发布</h1>
                <p>支持博客快速发布，博客界面支持个性化编辑。</p>
              </li>
              <li>
                <h1>调研问卷发布</h1>
                <p>提供调研问卷发布工具，满足招聘，信息采集功能。</p>
              </li>
              <li>
                <h1>文件发布</h1>
                <p>允许发布文件用于网页下载。</p>
              </li>
            </ul>
          </dd>
          <p>
            <!-- <router-link to="/product">入驻建站</router-link> -->
            <a href="javascript:;" @touchend="toCreate($event)">入驻建站</a>
            <span>&nbsp;&gt;</span>
          </p>
        </dl>
        <!-- 购物交易流程 -->
        <dl>
          <dt>
            <img src="../../common/images/public/shopping.png" alt>
            <h6>强大的购物交易流程</h6>
          </dt>
          <dd>
            <ul>
              <li>
                <h1>产品定价公式</h1>
                <p>专利【行业计算器】模块，方便卖家设定变量及公式，彻底攻克定制产品在线交易难的瓶颈。</p>
              </li>
              <li>
                <h1>分阶段付款</h1>
                <p>诚意金、预付定金、协议保证金三种类型任您使用，彻底解决定制商品和大额交易信任缺失和风险问题。</p>
              </li>
              <li>
                <h1>在线批发</h1>
                <p>族蚂购物交易流程支持零售、预售及批发业务。</p>
              </li>
              <li>
                <h1>议价功能</h1>
                <p>专利提供议价模块，撮合买卖双方议价成交。</p>
              </li>
              <li>
                <h1>运费模板</h1>
                <p>提供专业电子商务运费模板维护功能。支持按体积、重量、件数收费及包邮功能。</p>
              </li>
              <!-- <li>
            <h1>购物售后流程</h1>
            <p>提供专业电子商务运费模板维护功能。</p>
              </li>-->
              <li>
                <h1>购物评价功能</h1>
                <p>支持买家购物消费晒图及文字评价。</p>
              </li>
              <li>
                <h1>购物售后流程</h1>
                <p>提供专业的电子商务购物售后流程，提供：仅退款、退货退款、换货以及族蚂客服介入等多种售后方式。</p>
              </li>
            </ul>
          </dd>
          <p>
            <!-- <router-link to="/product">入驻建站</router-link> -->
            <a href="javascript:;" @touchend="toCreate($event)">入驻建站</a>
            <span>&nbsp;&gt;</span>
          </p>
        </dl>
        <!-- 服务交易流程 -->
        <dl>
          <dt>
            <img src="../../common/images/public/service.png" alt>
            <h6>强大的服务交易流程</h6>
          </dt>
          <dd>
            <ul>
              <li>
                <h1>服务定价公式</h1>
                <p>专利【行业计算器】模块，方便卖家设定变量及公式，彻底攻克定制化服务SKU在线交易难的瓶颈。</p>
              </li>
              <li>
                <h1>分阶段付款</h1>
                <p>诚意金、预付定金两种类型任您使用，彻底解决定制化和大额交易信任缺失和风险问题。</p>
              </li>
              <li>
                <h1>分时段付款</h1>
                <p>适用于宾馆服务业、租赁服务业及其它允许买家分多次按固定时间规律付款给卖家的服务行业</p>
              </li>
              <li>
                <h1>服务预约功能</h1>
                <p>独家提供按分钟、小时、天、月，4种服务预约功能，让服务开始时间更精准，解决服务交易用户体验差的难题。</p>
              </li>
              <li>
                <h1>附近的交易/同城交易</h1>
                <p>提供百度地图精准定位功能，让买家精准找到附近的商家。</p>
              </li>
              <li>
                <h1>服务消费评价</h1>
                <p>支持买家服务消费晒图及文字评价。</p>
              </li>
              <li>
                <h1>服务投诉流程</h1>
                <p>提供专业的电子商务服务投诉流程，提供：申请取消/关闭订单、折扣或退款、投诉建议以及族蚂客服介入等多种投诉方式。</p>
              </li>
            </ul>
          </dd>
          <p>
            <!-- <router-link to="/product">入驻建站</router-link> -->
            <a href="javascript:;" @touchend="toCreate($event)">入驻建站</a>
            <span>&nbsp;&gt;</span>
          </p>
        </dl>
        <!-- 影音创收 -->
        <dl>
          <dt>
            <img src="../../common/images/public/video.png" alt>
            <h6>影音创收新模式</h6>
          </dt>
          <dd>
            <ul>
              <li>
                <h1>在线音频收费</h1>
                <p>支持版权人设置收费单价，提供收费下载功能，让作品不再无价！</p>
              </li>
              <li>
                <h1>创作人音频打赏</h1>
                <p>支持创作人认领及设置创作人版权收益比例， 提供创作人打赏功能，让艺人轻松获得收益。</p>
              </li>
              <li>
                <h1>在线视频收费</h1>
                <p>支持版权人设置电影及剧集单价，提供在线收费播放功能，创造在线视频收费新思路。</p>
              </li>
            </ul>
          </dd>
          <p>
            <!-- <router-link to="/product">入驻建站</router-link> -->
            <a href="javascript:;" @touchend="toCreate($event)">入驻建站</a>
            <span>&nbsp;&gt;</span>
          </p>
        </dl>
        <!-- 社交工具 -->
        <dl>
          <dt>
            <img src="../../common/images/public/social.png" alt>
            <h6>强大的社交工具</h6>
          </dt>
          <dd>
            <ul>
              <li>
                <h1>族蚂在线客服服务</h1>
                <p>族蚂的在线客服工具支持电话+聊天+信息留言等多种沟通方式，为建站用户提供强大的技术支持保障。</p>
              </li>
              <li>
                <h1>商家APP聊天工具</h1>
                <p>为站点提供专用即时im聊天通讯工具，方便站点及时解答买家会员的购物咨询。</p>
              </li>
              <li>
                <h1>新闻博客评论功能</h1>
                <p>支持收集新闻评论和观点资讯。</p>
              </li>
              <li>
                <h1>视频弹幕功能</h1>
                <p>专业视频即时弹幕插件，实时调整弹幕显示效果，让您发布的视频更热闹。</p>
              </li>
              <li>
                <h1>SEO搜索引擎优化</h1>
                <p>专业SEO优化工具，快速提升自然排名，免费提升精准访问流量。</p>
              </li>
            </ul>
          </dd>
          <p>
            <!-- <router-link to="/product">入驻建站</router-link> -->
            <a href="javascript:;" @touchend="toCreate($event)">入驻建站</a>
            <span>&nbsp;&gt;</span>
          </p>
        </dl>
        <!-- 在线创收 -->
        <dl>
          <dt>
            <img src="../../common/images/public/makeM.png" alt>
            <h6>在线创收神器</h6>
          </dt>
          <dd>
            <ul>
              <li>
                <h1>产品在线销售</h1>
                <p>支持新品、二手、定制商品的在线，支持分阶段及分时段付款，支持议价撮合交易，千余种交易流程组合，满足各行各业的交易需求。</p>
              </li>
              <li>
                <h1>服务在线销售</h1>
                <p>支持上门服务、到店服务、线上服务、电话服务、代办服务SKU在线发布，提供预约时间工具，提供分时段付款流程。</p>
              </li>
              <li>
                <h1>UI美工赚钱神器</h1>
                <p>无需了解程序代码，支持多网站同时操作，支持多用户权限管理，支持网站归属转让，让美工轻松建站创收。</p>
              </li>
              <li>
                <h1>音乐创作人的营收工具</h1>
                <p>提供创作人认领流程并提供创作人打赏功能，让创作人拥有自己的粉丝并实现丰厚创收！</p>
              </li>
              <li>
                <h1>音频收费下载</h1>
                <p>提供音频上传功能，支持有著作权的音频作品收费下载，让优秀艺术作品获得丰厚回报。</p>
              </li>
              <li>
                <h1>视频在线票房</h1>
                <p>支持电影、电视剧作品发布，支持免费试看及收费播放。让您的视频作品不再闲置。</p>
              </li>
            </ul>
          </dd>
          <p>
            <!-- <router-link to="/product">入驻建站</router-link> -->
            <a href="javascript:;" @touchend="toCreate($event)">入驻建站</a>
            <span>&nbsp;&gt;</span>
          </p>
        </dl>
        <!-- 入驻建站 -->
        <div class="enterWeb">
          <div class="layout">
            <h6>建站也可以如此轻松！</h6>
            <p>族蚂网致力于打造全球最强大建站工具，为您提供更个性化、人性化、高度自由化的应用环境，更多样化的交易流程，为更多行业提供电子商务解决方案，同时为用户提供安全可靠的售后保障体系。</p>
          </div>
          <!-- <router-link to="/product">入驻建站</router-link> -->
          <a href="javascript:;" @touchend="toCreate($event)">入驻建站</a>
        </div>
        <div
          class="zuma_footer"
          v-if="$route.name !== 'templatePage' && $route.name !=='choosePage'"
        >
          <p>Copyright © 2017 -2018 上海族蚂信息科技有限公司&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;版权所有</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "webAdv",
  data(){
    return{
      HeightW:0
    }
  },
  props: ["message"],
  mounted(){
    this.$nextTick(() => {
      //根据不同手机设置不同高度
      let phoneHeight = window.innerHeight;
      this.HeightW= phoneHeight-46 +'px';
    })
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    toCreate(e) {
      var e = e || window.event;
      let myUrl = window.location.host;
      if (this.message == "登录") {
        e.target.href = "/wap/userLogin?url=" + myUrl + "/wap/mysite/index/";
      } else {
        e.target.href = "/wap/mysite/index/";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/*产品优势详情*/
h6,
h1 {
  font-weight: bolder;
}

.webAdv {
  width: 100%;
  overflow: scroll;
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
    overflow: auto;
    top: 46px;
    bottom: 0;
    background: white;
    dl {
      width: 280px;
      margin: 20px auto 0;
      text-align: left;
      dt {
        padding-bottom: 10px;
        img {
          width: 280px;
          height: 197px;
          display: block;
          margin: 0 auto;
        }
        h6 {
          margin-top: 20px;
          display: inline-block;
          color: #515151;
          font-size: 24px;
          height: 40px;
          line-height: 40px;
          border-bottom: 2px solid #515151;
        }
      }
      dd {
        h1 {
          height: 23px;
          margin-top: 20px;
          color: #515151;
          font-size: 16px;
        }
        p {
          height: 38px;
          line-height: 19px;
          margin-top: 10px;
          color: #949494;
          font-size: 14px;
        }
      }
      > p {
        display: block;
        font-size: 18px;
        margin-top: 30px;
        padding-bottom: 50px;
        width: 200px;
        a {
          float: left;
          display: block;
          color: #5e5e5e;
          font-weight: bolder;
          padding-bottom: 2px;
          border-bottom: 2px solid #5e5e5e;
        }
        span {
          float: left;
        }
      }
    }
    /*入驻建站*/
    .enterWeb {
      margin: 20px 0 40px;
      height: 430px;
      background: #3d9be9;
      .layout {
        padding-top: 50px;
        width: 240px;
        margin: 0 auto;
        h6 {
          width: 180px;
          height: 94px;
          line-height: 47px;
          font-size: 32px;
          color: #fff;
        }
        p {
        height: 120px;
          line-height: 20px;
          margin-top: 30px;
          text-align: left;
          font-size: 14px;
          text-indent: 28px;
          color: #fff;
        }
      }
      a {
        margin: 50px 0 50px 100px;
        display: inline-block;
        width: 180px;
        height: 40px;
        background: #8bc3f2;
        color: #fff;
        font-size: 20px;
        text-align: center;
        line-height: 40px;
      }
    }
    .zuma_footer {
      width: 280px;
      margin: 0 auto 10px;
      p {
          height: 36px;
        line-height: 18px;
          text-align: left;
        font-size: 10px;
        color: #a1a1a1;
      }
    }
  }
}
</style>


