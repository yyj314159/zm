<template>
   <div id="music" class="scroll-list-wrap">
        <cube-scroll ref="scroll" :data="items">
            <ul class="music-wrapper">
                <li  v-for="music in items" :key="music.audioId" class="music-item border-1px">
                        <div class="icon">
                            <img :src="imgUrl+music.fCoverUrl" alt="音乐封面" @load="imgAutoAdapt">
                        </div>
                        <div class="music-content">
                            <h2 class="item-name">{{ music.audioName }}</h2>
                            <div class="item-extra">
                                <span class="item-category">{{ music.categoryName }}</span>
                                 <span> · {{ music.creatorStr!='null' ? music.creatorStr:music.fCreateTime}}</span>   
                            </div>
                        </div>
                </li>
            </ul>
        </cube-scroll>
   </div>
</template>

<script>
    import MethodsUtil from "../../common/js/MethodsUtil";  
    import axios from 'axios';
    export default {
        data(){
            return{
                items:"",
                imgUrl:"http://www.dev-zuma.com"
            }
        },
        created: function () {
           axios.get("/music/audio_web/search-api/searchAudio").then(res=>{
               this.getMusicInfoSucc=res.data.data.content;
               console.log(this.getMusicInfoSucc);
               this.items=this.getMusicInfoSucc;
            });
        },
         methods: {
            imgAutoAdapt:function(e){
                 MethodsUtil.imgAutoAdapt(e.target,true)
            }
         }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .music-wrapper{
      background:#fff;
      padding: 0 12px;
      .music-item{
            display:flex
            padding:10px 0
            border-bottom: 1px solid #f2f2f2
            &:last-child{
                border-none()
            }
            
            .icon{
                flex:0 0 40px
                height 40px
                overflow:hidden
                margin-right:12px
                img{
                    width:100%
                }
            }
                
            .music-content{
                display:flex
                flex:1
                justify-content:space-between
                align-items:flex-start
                flex-direction:column
                .item-name{
                    height:18px
                    line-height:18px
                    font-size:14px
                    color:rgba(40,40,40,.7)
                }
                .item-extra{
                    font-size:12px;
                     .item-category{
                         color:#3D9BE9
                    }
                }
               
            }    
            
        } 
       
  }
    
    
       
</style>