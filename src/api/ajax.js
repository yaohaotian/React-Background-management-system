import { message } from 'antd'
import axios from 'axios'
export default function ajax(url , data = {} , type = 'GET') {

    return new Promise((resolve,reject) => {

        // 1.执行异步ajax请求
        let promise
        if(type === 'GET'){
            promise = axios.get(url,{
                params: data // params 配置指定的是 query 参数
            })
        } else {
            promise = axios.post(url,data)
        }
        // 2.如果成功了，调用resolve
        promise.then((respose) => {
            resolve(respose.data)
        // 3.如果失败了，不调用reject（reason），而是提示异常信息
        }).catch((error) => {
            message.error('请求出错了' + error.message)
        })
    })
}