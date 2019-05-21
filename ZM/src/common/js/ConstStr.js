// 本js用来存储全局静态常量包括后台接口的二次命名
export default{
// 后台地址
        InterfaceAds:'http://www.dev-zuma.com',
        // InterfaceAds:'/',
        picSrc:'http://www.dev-zuma.com/',

// 首页接口(14)
        // 首页一级类目数据
        Home:'/product_gateway/product-api/productCategory/queryAllFirstCategory',
        // 首页登录状态
        Logon:'/wap/member/getUserLoginStatus',
        // 首页提示消息数量
        mesNum:'/wap/customService/queryMessageCount',
        // 首页购物车数量
        sCartNum:'/cart/getCartSum',              
        // 首页定位查询接口
        LocQuery:'/wap/member/queryByUserId',
        // 首页定位上传接口
        LocUpload:'/wap/member/save',
        // 建站演示视频
        website:'/admin/c_m/sysSiteDemoVideo/demonStration',
        // 建站模板大类接口
        webB:'/manage-api/template/webCategory/queryCategoryDropList',
        // 建站模板小类接口
        webS:'/manage-api/template/webCategory/queryCategoryDropListExp',
        // 建站模板小类下生效的模板接口
        webT:'/manage-api/template/webTemplate/queryByPageExp',
        // 推荐10个模板接口
        webR:'/manage-api/template/webTemplate/queryByPageToMobile?fIsTrash=0&fStatus=5',
        // 预览模板详情页
        webCTP:'mobview.zuma.com/pre/模板ID?type=template&version=',

        // Footer跳转网址
        Login:'/wap/userLogin',
        mes:'/wap/customService/message_list',
        scart:'/product_wap/cart/toGetShopCart',
        mine:'/wap/member/memberCenterIndex',

// 购物模块接口
        //产品搜索接口
        productSearchKeyWord:'/product_gateway/productSearch/searchProductList',
        //选择城市接口1
        chooseCity:'/city/getAllData',
        //选择城市接口2
        getStreetByParent:'/city/getTownData'

// 服务模块接口

// 视频模块接口

// 声音模块接口

// 资讯模块接口

// 网站模块接口




}