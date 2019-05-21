<template>
    <div class="choose-city-tab">
        <div class="already-choose">
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
        <p class="address">
            <span class="picked-province" v-if="Object.keys(picked_province).length" :provincedId="picked_province.provinceId" @click="goBack(picked_province,0,$event)">
                {{picked_province.provinceName}}
            </span>
            <span class="picked-city" v-if="Object.keys(picked_city).length" :cityId="picked_city.cityId" @click="goBack(picked_city,1,$event)">
                {{picked_city.cityName}}
            </span>
            <span class="picked-countyArea" v-if="Object.keys(picked_countyArea).length" :countyAreaId="picked_countyArea.countyAreaId" @click="goBack(picked_countyArea,2,$event)">
                {{picked_countyArea.countyAreaName}}
            </span>
            <span class="active" @click="goBack(null,3,$event)">请选择</span>
            <i ref="bottomLine"></i>
        </p>
        <div class="address-body-province body-content" v-show="provinceNow">
            <dl v-for="(item,index) in province">
                <dt class='primary-letter'>{{item[0]}}</dt>
                <dd v-for="(item2,index2) in item.slice(1,item.length-1)" :key="item2.i" :class="{selected:item2.i == provinceId}" @click.stop="selectedProvince(index,index2,item2.i,item2.n,$event)">{{item2.n}}</dd>
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
        <div class="cancel-choose" @click="cancelChoose">取消</div>
    </div>
</template>

<script>
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
            }
        },
        methods:{
            selectedProvince:function (index,index2,provinceId,provinceName,eve) {
                let spanArr = document.querySelectorAll(".address>span");
                this.provinceId = provinceId;
                this.moveIndex = 1;     //下边线移动的距离
                if(this.alreadyChooseAddress.fProvince) {        //判断是重选还是第一次选
                    this.picked_city = {};
                    this.picked_countyArea = {};
                    this.picked_street = {};
                    spanArr = document.querySelectorAll(".address>span");
                    spanArr[0].className = "";
                    spanArr[spanArr.length-1].className = "active";
                }
                this.$refs.bottomLine.style.left = 55*this.moveIndex+"px";
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
                let spanArr = document.querySelectorAll(".address>span");
                this.cityId = cityId;
                this.moveIndex = 2;
                if(this.alreadyChooseAddress.fCity) {        //判断是重选还是第一次选
                    this.picked_countyArea = {};
                    this.picked_street = {};
                    spanArr[1].className = "";
                    spanArr[spanArr.length-1].className = "active";
                }
                this.$refs.bottomLine.style.left = 55* this.moveIndex+"px";
                let cityData = JSON.parse(sessionStorage.getItem("city"));
                this.cityNow = false;
                this.countyAreaNow = true;
                this.countyArea = cityData[cityId];
                if(this.countyArea == undefined){       //若最低到市，则关闭选择框
                    this.$emit("isShowCity",false);
                    return;
                }
                this.picked_city.cityId = cityId;
                this.picked_city.cityName = cityName;
                this.alreadyChooseAddress.fCity = cityName;         //存储选中的市
                this.alreadyChooseAddress.fCityId = cityId;
            },
            selectedCountyArea(index,countyAreaId,countyAreaName,fPostcode){
                let spanArr = document.querySelectorAll(".address>span");
                this.moveIndex = 3
                if(this.alreadyChooseAddress.fCountyArea) {        //判断是重选还是第一次选
                    this.picked_countyArea = {};
                    this.picked_street = {};
                    spanArr[2].className = "";
                    spanArr[spanArr.length-1].className = "active";
                }
                this.$refs.bottomLine.style.left = 55* this.moveIndex+"px";
                this.countyAreaId = countyAreaId;
                this.countyAreaNow = false;
                this.streetNow = true;
                this.picked_countyArea.countyAreaId = countyAreaId;
                this.picked_countyArea.countyAreaName = countyAreaName;
                this.alreadyChooseAddress.fDistrict = countyAreaId;         //存储选中的县区
                this.alreadyChooseAddress.fDistrictId = countyAreaName;
                this.alreadyChooseAddress.fPostcode = fPostcode;
                this.HttpCli.get(
                    '/products/city/getTownData',
                    {fParentId:countyAreaId}
                ).then((res)=>{
                    console.log(res.data);
                    if(res.data.length == 0){       //若最低到市，则关闭选择框
                        this.$emit("isShowCity",false);
                        return;
                    }
                    this.street = res.data;

                })
            },
            selectedStreet:function(index,streetId,streetName){
                this.picked_street.streetId = streetId;
                this.picked_street.streetName = streetName;
                this.alreadyChooseAddress.fStreet = streetId;         //存储选中的县区
                this.alreadyChooseAddress.fStreetId = streetName;
                setTimeout(()=>{
                    this.HttpCli.get(
                        "/products/member_web/userLocation/save",
                        this.alreadyChooseAddress
                    );
                    this.$emit("isShowCity",false);     //选择完街道后，自动关闭弹窗
                },500);


            },
            goBack:function(addressObj,nowIndex,eve){
                let spanArr =  eve.srcElement.parentNode.children;
                for(let i=0; i<spanArr.length; i++){
                    if(i==nowIndex){
                        spanArr[i].className = "active";
                    }else{
                        spanArr[i].className = ""
                    }
                }
                this.$refs.bottomLine.style.left = nowIndex*55+"px";
                console.log(nowIndex);
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
                    case 3:
                        this.streetNow = true;
                        this.countyAreaNow = false;
                        this.cityNow = false;
                        this.provinceNow = false;

                }
            },
            cancelChoose:function(){
                console.log(this.alreadyChooseAddress);
               switch (this.alreadyChooseAddress.length) {
                   case 1:
                       this.provinceNow = true;
                       this.cityNow = false;
                       break;
                   case 2:
                       this.countyAreaNow = false;
                       this.cityNow = true;
               }
            }
        },
        mounted(){
            document.body.style.overflow='hidden';//禁止页面滑动
            this.HttpCli.get(
                "/products/city/getAllData",
                {}
            ).then((res)=>{
                sessionStorage.setItem("city",JSON.stringify(res.data.data));
                let proviceData = res.data.data[0];
                console.log(res.data)
                proviceData.sort(function (m, j) {
                    return m.s.charCodeAt() - j.s.charCodeAt()
                });
                proviceData.map((item,index)=>{
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
    width: 280px;
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
    .address{
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
        height: 435px;
        overflow: auto;
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
            /*background: url("../../common/images/dui.png") no-repeat 250px center;*/
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
        height: 40px;
        width: 280px;
        line-height: 40px;
        border-top:solid 1px #f7f7f7;
        text-align: center;
        position: fixed;
        bottom: 0;
        right: 0;
    }
}
</style>