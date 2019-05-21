
//处理主演
export function formatterStar (data){
    if(data){
        var name ="";
        JSON.parse(data).forEach(function(ele,index){
            if(ele.fToStarName){

                name +=ele.fToStarName+'、';
            }
        })
        name = name.substring(0, name.length-1);
        return name;
    }

}
//视频创建时间
export function formatterTime (data){
    if(data){
           var time = data.split(" ")[0]
        return time;
    }
}
//视频别名
export function formatteraliasName(data) {
    if(data){
        var aliasName = data.substring(0, data.length-1);
        return aliasName;
    }
}

