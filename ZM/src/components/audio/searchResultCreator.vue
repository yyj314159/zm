<template>
  <div>
    <creator :Search="Search" :keyword="keyword" :filterValue="filterValue"></creator>
  </div>
</template>
<script>
import creator from "./creator"; //引入创作人组件
import bus from "./bus.js";
export default {
  props: {
    keyword: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      Search: true,
      filterValue: {
        typeValue: null,
        guojiValue: null
      }
    };
  },
  components: {
    creator
  },
  created() {},
  mounted() {
    this.getBrotherData();
  },
  methods: {
    getBrotherData() {
      bus.$on("creator-confirm", (typeValue, guojiValue) => {
        this.filterValue.typeValue = typeValue;
        this.filterValue.guojiValue = guojiValue;
      });
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus"></style>