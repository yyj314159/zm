<template>
  <div id="audioFilter">
    <ul>
      <li @click="showChooseAudio">
        <h4 v-html="musicClass"></h4>
        <img src="@/common/images/rightjiantou.png" alt="右箭头">
      </li>
    </ul>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import bus from "./bus.js"; //兄弟组件传值的地方
export default {
  data() {
    return {
    };
  },
  methods: {
    showChooseAudio() {
      this.$store.dispatch("SHOW_CHOOSE_AUDIO", { chooseAudio: true });
    },
    clearAll() {
      this.$store.dispatch("SHOW_CHOOSE_AUDIO", { musicClass: "音频分类" });
    },
    defineSearch() {
      if (document.getElementById("hide")) {
        let ids = document.getElementById("hide").value;
        console.log(ids, "idsssss");
        //需要传的搜索一级类目id
        let id1 = ids.split("-")[0];
        //二级类目的id
        let id2 = ids.split("-")[1];
        bus.$emit("audio-confirm", id1, id2);
      } else {
        bus.$emit("audio-confirm", null, null);
      }
    }
  },
  computed: {
    ...mapGetters(["musicClass"])
  }
};
</script>

<style lang="scss">
.content{
  width: 100%;
}
#audioFilter {
  ul {
    li {
      padding: 10px;
      display: flex;
      justify-content: space-between;
      img {
        height: 12px;
      }
    }
  }
}

</style>