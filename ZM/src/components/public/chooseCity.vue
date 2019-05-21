<template>
    <div class="choose-city-tab" :style="{width:width}">
        <!--首页调用-->
        <div class="main-page" v-if="comeFromMain">
           <div class="main-title">
               <img src="../../common/images/gobackpng.png" alt="" @click="$emit('isShowCity',false)">
               选择地址
           </div>
            <div class="location-now">
                <p>•&nbsp;定位当前城市</p>
                <p>{{alreadyCity}}</p>
            </div>
            <div class="choose-new-address">•&nbsp;选择新地址</div>
        </div>
        <div class="already-choose" v-show="!comeFromMain">
            <span>已选分类：</span>
            <span v-show="Object.keys(picked_province).length" :provincedId="picked_province.provinceId">
                {{picked_province.provinceName}}
            </span>
            <span v-show="Object.keys(picked_city).length" :cityId="picked_city.cityId">
                -{{picked_city.cityName}}
            </span>
            <span v-show="Object.keys(picked_countyArea).length" :countyAreaId="picked_countyArea.countyAreaId">
                -{{picked_countyArea.countyAreaName}}
            </span>
            <span v-show="Object.keys(picked_street).length" :streetId="picked_street.streetId">
                -{{picked_street.streetName}}
            </span>
        </div>
        <p class="address1">
            <span class="picked-province" v-if="Object.keys(picked_province).length" :provincedId="picked_province.provinceId" @click="goBack(picked_province,0,null,$event)">
                {{picked_province.provinceName}}
            </span>
            <span class="picked-city" v-if="Object.keys(picked_city).length" :cityId="picked_city.cityId" @click="goBack(picked_city,1,null,$event)">
                {{picked_city.cityName}}
            </span>
            <span class="picked-countyArea" v-if="Object.keys(picked_countyArea).length" :countyAreaId="picked_countyArea.countyAreaId" @click="goBack(picked_countyArea,2,null,$event)">
                {{picked_countyArea.countyAreaName}}
            </span>
            <span class="active" @click="goBack(null,-1,null,$event)">请选择</span>
            <i ref="bottomLine"></i>
        </p>
        <div class="address-body-province body-content" v-show="provinceNow">
            <dl v-for="(item,index) in province">
                <dt class='primary-letter'>{{item[0]}}</dt>
                <dd v-for="(item2,index2) in item.slice(1,item.length)" :key="item2.i" :class="{selected:item2.i == provinceId}" @click.stop="selectedProvince(index,index2,item2.i,item2.n,$event)">{{item2.n}}</dd>
            </dl>
        </div>
        <div class="address-body-city body-content" v-show="cityNow">
            <ul>
                <li v-for="(item,index) in city" :key="item.i" v-text="item.n" class="city-choose" :class="{selected:item.i == cityId}" @click.stop="selectedCity(index,item.i,item.n)"></li>
            </ul>
        </div>
        <div class="address-body-countyArea body-content" v-show="countyAreaNow">
            <ul>
                <li v-for="(item,index) in countyArea" :key="item.i" v-text="item.n" class="city-choose" :class="{selected:item.i == countyAreaId}" @click.stop="selectedCountyArea(index,item.i,item.n,item.f_post_code)"></li>
            </ul>
        </div>
        <div class="address-body-street body-content" v-show="streetNow">
            <ul>
                <li v-for="(item,index) in street" :key="item.i" v-text="item.n" class="city-choose" @click.stop="selectedStreet(index,item.i,item.n)"></li>
            </ul>
        </div>
        <div class="cancel-choose" @click="cancelChoose" v-show="!comeFromMain">取消</div>
    </div>
</template>

<script>
    import Interface from "../../common/js/ConstStr"
    export default {
        name: "chooseCity",
        data(){
            return {
                province:[["A-G"],["H-K"],["L-S"],["T-Z"]],
                provinceNow:true,       //省
                city:[],
                cityNow:false,          //市
                countyArea:[],
                countyAreaNow:false,       //县区
                street:[],
                streetNow:false,        //街道
                selected:false,
                provinceId:'',
                cityId:'',
                countyAreaId:'',
                picked_province:{},
                picked_city:{},
                picked_countyArea:{},
                picked_street:{},
                alreadyChooseAddress:{},
                active:false,
                moveIndex:0,
                comeFromMain:false
            }
        },
        props:{
            alreadyCity:{
                type:String,
                default:"上海",
                required: false,
            },
            width:{
                type:String,
                default: "100%",
                required: false
            }
        },
        methods:{
            selectedProvince:function (index,index2,provinceId,provinceName,eve) {
                let spanArr = document.querySelectorAll(".address1>span");
                this.provinceId = provinceId;
                this.moveIndex = 1;     //下边线移动的距离
                if(this.alreadyChooseAddress.fProvince) {        //判断是重选还是第一次选
                    this.picked_city = {};
                    this.picked_countyArea = {};
                    this.picked_street = {};
                    spanArr = document.querySelectorAll(".address1>span");
                    console.log(spanArr)
                    spanArr[0].className = "";
                    spanArr[spanArr.length-1].className = "active";
                }
                this.$refs.bottomLine.style.left = this.$refs.bottomLine.offsetWidth*this.moveIndex+"px";
                let cityData = JSON.parse(sessionStorage.getItem("city"));
                this.provinceNow = false;
                this.cityNow = true;
                this.city = cityData[provinceId];
                this.picked_province.provinceId = provinceId;
                this.picked_province.provinceName = provinceName;
                this.alreadyChooseAddress.fProvince = provinceName;         //存储选中的省
                this.alreadyChooseAddress.fProvinceId = provinceId;

            },
            selectedCity(index,cityId,cityName){
                let spanArr = document.querySelectorAll(".address1>span");
                this.cityId = cityId;
                this.moveIndex = 2;
                if(this.alreadyChooseAddress.fCity) {        //判断是重选还是第一次选
                    this.picked_countyArea = {};
                    this.picked_street = {};
                    spanArr[1].className = "";
                    spanArr[spanArr.length-1].className = "active";
                }
                this.$refs.bottomLine.style.left = this.$refs.bottomLine.offsetWidth* this.moveIndex+"px";
                let cityData = JSON.parse(sessionStorage.getItem("city"));
                this.cityNow = false;
                this.countyAreaNow = true;
                this.countyArea = cityData[cityId];
                this.picked_city.cityId = cityId;
                this.picked_city.cityName = cityName;
                this.alreadyChooseAddress.fCity = cityName;         //存储选中的市
                this.alreadyChooseAddress.fCityId = cityId;
                if(this.countyArea == undefined){       //若最低到市，则关闭选择框
                    this.$emit("isShowCity",false,this.alreadyChooseAddress,2);
                    return;
                }
            },
            selectedCountyArea(index,countyAreaId,countyAreaName,fPostcode){
                let spanArr = document.querySelectorAll(".address1>span");
                this.moveIndex = 3
                if(this.alreadyChooseAddress.fCountyArea) {        //判断是重选还是第一次选
                    this.picked_countyArea = {};
                    this.picked_street = {};
                    spanArr[2].className = "";
                    spanArr[spanArr.length-1].className = "active";
                }
                this.$refs.bottomLine.style.left = this.$refs.bottomLine.offsetWidth* this.moveIndex+"px";
                this.countyAreaId = countyAreaId;
                this.countyAreaNow = false;
                this.streetNow = true;
                this.picked_countyArea.countyAreaId = countyAreaId;
                this.picked_countyArea.countyAreaName = countyAreaName;
                this.alreadyChooseAddress.fDistrictId = countyAreaId;         //存储选中的县区
                this.alreadyChooseAddress.fDistrict = countyAreaName;
                this.alreadyChooseAddress.fPostcode = fPostcode;
                this.HttpCli.post(
                    Interface.getStreetByParent,
                    {fParentId:countyAreaId}
                ).then((res)=>{
                    console.log(res.data);
                    if(res.data.length == 0){       //若最低到市，则关闭选择框
                        this.$emit("isShowCity",false,this.alreadyChooseAddress,3);
                        return;
                    }
                    this.street = res.data;
                })
            },
            selectedStreet:function(index,streetId,streetName){
                this.picked_street.streetId = streetId;
                this.picked_street.streetName = streetName;
                this.alreadyChooseAddress.fStreetId = streetId;         //存储选中的县区
                this.alreadyChooseAddress.fStreet = streetName;
                this.$emit("isShowCity",false,this.alreadyChooseAddress,4);//选择完街道后，自动关闭弹窗
            },
            goBack:function(addressObj,nowIndex,spanArr,eve){
                let spanArr2 = spanArr ? spanArr : eve.srcElement.parentNode.children;  //若有spanArr则点击的是取消，若没有则点击的是地址直接回退
                console.log(spanArr2,nowIndex)
                for(let i=0; i<spanArr2.length; i++){
                    if(i==nowIndex){
                        spanArr2[i].className = "active";
                    }else{
                        spanArr2[i].className = "";
                    }
                    nowIndex==-1 && (spanArr2[i].className = "",spanArr2[spanArr2.length-2].className = "active")
                }
                if(nowIndex==-1){
                    this.$refs.bottomLine.style.left = (spanArr2.length-2)*this.$refs.bottomLine.offsetWidth+"px";
                }else{
                    this.$refs.bottomLine.style.left = nowIndex*this.$refs.bottomLine.offsetWidth+"px";
                }
                switch(nowIndex){
                    case 0:
                        this.provinceNow = true;
                        this.cityNow = false;
                        this.countyAreaNow = false;
                        this.streetNow = false;
                        break;
                    case 1:
                        this.cityNow = true;
                        this.provinceNow = false;
                        this.countyAreaNow = false;
                        this.streetNow = false;
                        break;
                    case 2:
                        this.countyAreaNow = true;
                        this.cityNow = false;
                        this.provinceNow = false;
                        this.streetNow = false;
                        break;
                    case -1:
                        switch(spanArr2.length){
                            case 3:
                                this.provinceNow = false;
                                this.cityNow = true;
                                break;
                            case 4:
                                this.countyAreaNow = true;
                                this.provinceNow = false;
                                this.cityNow = false;
                                break;
                            case 5:
                                this.streetNow = true;
                                this.countyAreaNow = false;
                                this.provinceNow = false;
                                this.cityNow = false;
                        }
                }
            },
            cancelChoose:function(){        //根据当前展示的返回上一级，返回到省直接关闭
                let spanArr = document.querySelectorAll(".address1 span");
                if(this.provinceNow){                   //当前展示的是省
                    this.$emit("isShowCity",false);     //直接关闭
                }else if(this.cityNow){                 //当前展示的是市
                    this.goBack(this.picked_countyArea,0, spanArr);
                }else if(this.countyAreaNow){           //当前展示的是县区
                    this.goBack(this.picked_countyArea,1, spanArr);
                }else if(this.streetNow){               //当前展示的是街道
                    this.goBack(this.picked_countyArea, 2, spanArr);
                }
            }
        },
        watch:{
            $route:{
                handler:function(){
                    let path = this.$route.path;
                    if(path == "/"){
                        this.comeFromMain = true;
                    }
                },
                immediate:true
            }
        },
        mounted(){

            document.body.style.overflow='hidden';//禁止页面滑动
            let h1 = document.querySelector(".already-choose").offsetHeight;
            let h2 = document.querySelector("p.address1").offsetHeight;
            let h3 = document.querySelector(".cancel-choose").offsetHeight;
            let WinH = document.documentElement.clientHeight;
            document.querySelector(".body-content").style.height = WinH-h1-h2-h3+"px";
            if(this.comeFromMain){
                let h4 = document.querySelector(".main-page").offsetHeight;
                document.querySelector(".body-content").style.height = WinH-h2-h4+"px";
            }
            this.HttpCli.post(
                Interface.chooseCity,
                {}
            ).then((res)=>{
                sessionStorage.setItem("city",JSON.stringify(res.data.data));
                console.log()
                let provinceData = res.data.data[0];
                provinceData.sort(function (m, j) {
                    return m.s.charCodeAt() - j.s.charCodeAt()
                });
                provinceData.map((item,index)=>{
                    if(item.s.charCodeAt()>=97 && item.s.charCodeAt()<=103){
                        this.province[0].push(item)
                    }else if(item.s.charCodeAt()>=104 && item.s.charCodeAt()<=107){
                        this.province[1].push(item)
                    }else if(item.s.charCodeAt()>=108 && item.s.charCodeAt()<=115){
                        this.province[2].push(item)
                    }else if(item.s.charCodeAt()>=116 && item.s.charCodeAt()<=122){
                        this.province[3].push(item)
                    }
                });
            })
        },
        destroyed(){
            document.body.style.overflow='';        //出现滚动条
        }
    }
</script>

<style lang="scss" scoped>
.choose-city-tab{
    height: 100%;
    background:#F7F7F7;
    position: absolute;
    z-index: 9999;
    right: 0;
    bottom:0;
    text-align:left;
    font-family: 'Microsoft YaHei';
    .already-choose{
        height: 50px;
        background: #fff;
        line-height: 50px;
        padding-left: 10px;
        margin-bottom: 6px;
    }
    .address1{
        height: 35px;
        line-height: 35px;
        background: #fff;
        border-bottom:solid 1px #f7f7f7;
        display: flex;
        position: relative;
        span{
            width: 55px;
            text-align: center;
        }
        .active{
            color:#3D9BE9;
        }
        i{
            height: 2px;
            width: 55px;
            background: #3D9BE9;
            position: absolute;
            bottom: 0;
            left: 0;
            transition: all 0.4s ease;
        }
    }
    .body-content{
        background:#fff;
        overflow-y: auto;
    }
    .primary-letter{
            height: 30px;
            background:#F7F7F7;
            line-height: 30px;
            padding-left: 10px;
        font-size: 14px;
        }
        dd{
            height:41px;
            line-height: 41px;
            padding-left: 10px;
        }
        .selected{
            color:#3D9BE9;
            background: url("../../common/images/dui.png") no-repeat 250px center;
            background-size: 14px 14px;
        }

    .city-choose{
        height: 41px;
        line-height: 41px;
    }
    .address-body-city,.address-body-countyArea,.address-body-street{
        padding-left: 10px;
    }
    .cancel-choose{
        height: 41px;
        width: 100%;
        background: #fff;
        line-height: 41px;
        border-top:solid 1px #f7f7f7;
        text-align: center;
        position: absolute;
        bottom: 0;
        right: 0;
    }
}
    /*首页调用*/
    .main-page {
        font-size: 14px;
        .main-title{
            height:46px;
            text-align: center;
            line-height: 46px;
            background: #fff;
            font-weight: bold;
            position: relative;
            img{
                display: block;
                position: absolute;
                width: 9px;
                height: 14px;
                top:16px;
                left: 10px;
            }
        }
        .location-now{
            p:nth-of-type(1){
                height: 30px;
                line-height: 30px;
                padding-left: 10px;
            }
            p:nth-of-type(2){
                height: 40px;
                line-height: 40px;
                font-size: 12px;
                background: #fff;
                padding-left: 10px;
            }
        }
        .choose-new-address{
            padding-left: 10px;
            height: 30px;
            line-height: 30px;
        }
    }
</style>