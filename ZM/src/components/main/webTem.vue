<template>
    <div class="webTem">
        <div id="Whead" ref="Whead">
        <img src="../../common/images/gobackpng.png" @click="goBack" >
            建站模板
        </div>
        <div id="contentBox" :style="{height:HeightW}">
            <div v-if="webK" class="title">
                <p>您想创建哪种类型网站？</p>
                <div class="sortC">
                    <cube-button class="picker" @click="showPicker1"><input disabled type="text" v-model="webKV" placeholder="请选择网站类型"> </cube-button><img src="../../common/images/public/nextR.png" @click="next1"> 
                </div>               
            </div>
            <div v-else class="title">
                <p>选择行业分类</p>
                <div class="sortC">
                    <cube-button class="picker" @click="showPicker2"><input disabled type="text" v-model="tradeKV" placeholder="选择行业分类"></cube-button><img src="../../common/images/public/nextR.png" @click="next2">                
                </div>
            </div>
            <div class="Tem">
                <p>模板推荐:</p>
                <ul>
                    <li :key="index" v-for="(item,index) in TemR" @click="next2(item.fid)">{{item.text}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'webTem',
    data(){
        return{
            HeightW:0,
            // 判断显示种类
            webK:true,
            // 双向绑定的值
            webKV:'',
            tradeKV:'',
            // 选择列表值
            webKData :[{ text: '暂无选项', value: '暂无选项'},],
            tradeKData :[{ text: '暂无选项', value: '暂无选项'},],
            // 模板推荐
            TemR:[{ text: '暂无选项', fid: undefined}],
            // 请求小类的参数值，默认null
            categoryId:null,
            // 请求小类下的模板列表
            fCategoryId:undefined,

        }
    },
    mounted(){
        // 接口推荐（10）
        let that = this;
        let urlwebR = '/passportapi' +this.ConstStr.webR;
        let webRP = {iDisplayStart: 0,iDisplayLength: 10,}
        this.HttpCli.post(urlwebR,webRP).then(res =>{
            let DataB = res.data.data;
            console.log(DataB)
            let arr = [];
            for(let i = 0; i<DataB.length; i++){
                let obj = {text:'',fid:''};
                obj.text = DataB[i].fName;
                obj.fid = DataB[i].fId
                arr[i] = obj;
            }
            that.TemR = [...arr]
        })        
        // 模板大类接口
        let urlwebB = '/passportapi' +this.ConstStr.webB
        this.HttpCli.post(urlwebB).then(res =>{
            let DataB = res.data.data;
            let arr = [];
            for(let i = 0; i<DataB.length; i++){
                let obj = {};
                obj['text'] = DataB[i].fCategoryName;
                obj['value'] = DataB[i].fId;
                arr.push(obj);
            }            
            that.webKData = [...arr];           
        })  
        //是否有模板小类
            if(that.$route.query.sId){
                console.log(111111)
                that.categoryId = that.$route.query.sId;
                that.webK = false;
                that.$route.query.sId = undefined;
                let urlwebS = '/passportapi' + this.ConstStr.webS;
                let parmasS = {categoryId:this.categoryId}
                this.HttpCli.post(urlwebS,parmasS).then(res =>{
                    console.log(res.data.data)
                    let DataB = res.data.data;
                    for(let i = 0; i<DataB.length; i++){
                        let obj = {text:'',value:''};
                        obj.text = DataB[i].fCategoryName;
                        obj.value = DataB[i].fId
                        that.tradeKData[i] = obj;
                    }
                })
            }

        this.$nextTick(() => {
            //根据不同手机设置不同高度
            let phoneHeight = window.innerHeight;
            this.HeightW= phoneHeight-46 +'px';
        })       
        this.webK = true;
        this.webKV = '';
        this.tradeKV = '';
        this.categoryId = null;
    },

    methods: {
        goBack() {
            this.$router.go(-1);
        },
        // 选项
        showPicker1() {
            if (!this.picker1) {
                this.picker1 = this.$createPicker({
                title: '请选择模板类型',
                data: [this.webKData],
                onSelect: this.selectHandle1,
                })
            }
            this.picker1.show()
        },
        selectHandle1(selectedVal, selectedIndex, selectedText) {
            this.webKV = selectedText[0];
            this.categoryId = selectedVal[0];
        },  
        showPicker2() {
            if (!this.picker2) {
                this.picker2 = this.$createPicker({
                title: '选择行业分类',
                data: [this.tradeKData],
                onSelect: this.selectHandle2,
                })
            }
            this.picker2.show()
        },
        selectHandle2(selectedVal, selectedIndex, selectedText) {
           this.tradeKV = selectedText[0];
           this.fCategoryId = selectedVal[0];
        }, 

        next1(){
            if(!this.categoryId){
                return
            }else{
                this.webK = false;
                // 模板小类接口
                let urlwebS = '/passportapi' + this.ConstStr.webS;
                let parmasS = {categoryId:this.categoryId}
                this.HttpCli.post(urlwebS,parmasS).then(res =>{
                    console.log(res.data.data)
                    let DataB = res.data.data;
                    for(let i = 0; i<DataB.length; i++){
                        let obj = {text:'',value:''};
                        obj.text = DataB[i].fCategoryName;
                        obj.value = DataB[i].fId
                        this.tradeKData[i] = obj;
                    }
                })  
            }          
        },
        next2(fid){
            if(this.tradeKV == ''){
                return 
            }           
            // 跳转到模板列表页
            this.$router.push({ path: '/showTem', query:{fCategoryId:this.fCategoryId,smlT:this.tradeKV,categoryId:this.categoryId}});
        },             
    }
}
</script>

<style lang="scss" scoped>
.webTem {
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
    height: 500px;
    top: 46px;
    bottom:0;
    overflow: auto;
    background-color: white;
    .title{
        width: 100%; 
        height: 100px;
        margin-top: 20px;
        p{
            width: 100%; 
            height: 30px;
            text-align: center;
            line-height: 30px;
            font-size: 20px;
            font-weight: bolder;
            color: #797979;
        }
        .sortC{
            display: flex;
            width: 80%; 
            margin: 20px auto;
            height: 30px;           
            justify-content: space-between;
            align-items: center;
            font-size: 16px;
            color: black;            
            border-bottom: 2px solid #3D9BE9;
            img{height: 30px;width: auto; }
            .picker{padding: 0; background-color: white;
                input{border: 0px;outline:none;cursor: pointer; background: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}
            }
            
        }       
    }
    .Tem{
        p{width: 40%; height: 30px; font-size: 14px; font-weight: bold; text-align: center; line-height: 30px; color: #797979;}
        ul{width: 100%; height: 100px; padding: 10px;
            li{
                border: 1px solid #797979; border-radius: 10px; float: left; padding: 4px; margin: 4px;
            }
        }
    }
  }
}
</style>