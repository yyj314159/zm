import Vue from 'vue'
import Router from 'vue-router'

import Main from '@/components/main/index.vue'
import sortPage from '@/components/main/sortPage.vue'
import webShow from '@/components/main/webShow.vue'
import webAdv from '@/components/main/webAdv.vue'
import webTem from '@/components/main/webTem.vue'
import showTem from '@/components/main/showTem.vue'

import Audio from '@/components/audio/audio.vue'
import information from '@/components/information/information.vue'
import Blog from '@/components/information/blog.vue'
import News from '@/components/information/news.vue'
import Product from '@/components/product/product.vue'
import Service from '@/components/service/service.vue'
// import Video from '@/components/video/video.vue'
import website from '@/components/website/website.vue'
import searchIndex from '@/components/public/searchIndex.vue'
import searchResult from '@/components/public/searchResult.vue'


Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/Main',
      name: 'Main',
      component: Main,
      alias:'/'
    },
    {
        path: '/sortPage',
        name: 'sortPage',
        component: sortPage,
    },
    {
        path: '/webShow',
        name: 'webShow',
        component: webShow
    },
    {
        path: '/webAdv',
        name: 'webAdv',
        component: webAdv
    },
    {
        path: '/webTem',
        name: 'webTem',
        component: webTem
    },
    {
        path: '/showTem',
        name: 'showTem',
        component: showTem
    },

      {
          path: '/product',
          name: 'Product',
          component: Product
      },
      {
          path: '/service',
          name: 'Service',
          component: Service
      },
    //   {
    //       path: '/video',
    //       name: 'Video',
    //       component: Video
    //   },
      {
          path: '/audio',
          name: 'Audio',
          component: Audio
      },
      {
          path: '/website',
          name: 'website',
          component: website
      },
      {
          path: '/searchIndex',
          name: 'searchIndex',
          component: searchIndex
      },
      {
          path: '/searchResult',
          name: 'searchResult',
          component: searchResult
      },
      {
          path: '/information',
          component: information,
          children:[
              {
                path:'blog',
                name:'Blog',
                component:Blog
              },
              {
                  path:'news',
                  name:'News',
                  component:News
              }
          ]
      },
      
        {
            path:'/',
            redirect:'Main'
        }
        

  ]
})
