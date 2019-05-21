<template>
    <div>
        <div>
            <div class='classifyBtn' @click="onClassify"  v-bind:class="{on:classifyState.largeName!=''}">
                <span>分类</span>
                <p>
                    <span class="classifyName" v-show="classifyState.largeName!=''">{{classifyState.largeName}}-{{classifyState.smallName}}</span>
                    <i class="icon-click"></i>
                </p>
            </div>
        </div>
    </div>
</template>
<script>
    import communication from './communication';
    import {mapState, mapGetters, mapMutations} from 'vuex'
    export default {
        data(){
            return{
                
            }
        },
        methods:{
            onClassify:function(){
                this.$store.commit('SHOW_CLASSIFY',{
                    isClassify:true,
                    isLoadClassify:this.classifyState.isLoadClassify
                })
            },
            clearAll(){ //清空
                this.$store.commit('SHOW_CLASSIFY',{
                    isClassify:false,
                    isLoadClassify:true,
                    largeName:'',//模板大类
                    smallName:'' //模板小类
                })
            },
            defineSearch(){
                communication.$emit('returnClassify',this.classifyState);
            },
        },
        computed:{
            ...mapGetters([
                "classifyState"
            ]),
        }
    }
</script>

<style leng='scss'>
.classifyName{
    font-size: 12px;
    color: #3992DB;
    margin-right: 12px;;
}
.classifyBtn.on{
    color: #3992DB;
    font-size: 12px;
}
.content{
    width: 100%;
}
</style>