// 用于存放公共方法
export default {
    // 时间戳转换（举例）
    formatDate(timeStamp){ 
        let now = new Date(timeStamp)
        let year=now.getFullYear(); 
        let month=now.getMonth()+1; 
        let date=now.getDate(); 
        let hour=now.getHours(); 
        let minute=now.getMinutes(); 
        let second=now.getSeconds(); 
        return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second; 
    },
    //图片自适应填充
    imgAutoAdapt(imgd, countflag) {     //imgd图片对象 contflag是否自适应填充
        var image = new Image()
        var iwidth = imgd.parentNode.offsetWidth;
        var iheight = imgd.parentNode.offsetHeight;

        //如果本地无效就删除.src,服务器上必须要
        image.src = imgd.src;
        if (image.width > 0 && image.height > 0) {
            if (image.width / image.height == iwidth / iheight) {
                // 方图
                imgd.width = iwidth;
                imgd.height = iheight;
                if (countflag) {
                    imgd.style.marginTop = 0;
                    imgd.style.marginLeft = 0;
                }
            } else {
                if (image.width / image.height > iwidth / iheight) {
                    // 横图
                    imgd.width = (image.width * iwidth) / image.height;
                    imgd.height = iheight;
                    if (countflag) {
                        imgd.style.marginTop = 0;
                        imgd.style.marginLeft = "-" + Math.ceil(imgd.width - iwidth) / 2 + "px";
                    }
                } else {
                    // 竖图

                    imgd.width = iwidth;
                    imgd.height = (image.height * iwidth) / image.width;
                    if (countflag) {
                        imgd.style.marginTop ="-" + Math.ceil(imgd.height - iheight) / 2 + "px";
                        imgd.style.marginLeft = 0;
                    }
                }
            }
        }
    },
    
}