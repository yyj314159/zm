// 对axios的二次封装，目前get和post两种请求方式
import axios from 'axios';

export default {
    get(url,params){
        return axios({
            url:url,
            method:'get',
            params:params                        
        })
    },
    post(url,params){
        return axios({
            url:url,
            method:'post',
            params:params                        
        })
    }
}

