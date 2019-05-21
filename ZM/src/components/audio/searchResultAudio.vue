<template>
  <div>音频结果页.......
     一级类目id:{{filterValue.id1}}
     二级类目id：{{filterValue.id2}}
  </div>
</template>
<script>
import bus from "./bus.js";
export default {
  data() {
    return {
      filterValue: {
        id1: null,//一级类目的id
        id2: null//二级类目
      }
    };
  },
  mounted() {
    bus.$on("audio-confirm", (id1, id2) => {
      this.filterValue.id1 = id1;
      this.filterValue.id2 = id2;
    });
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus"></style>