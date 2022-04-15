import store from 'store'
// 将数据保存进本地
const USER_KEY = 'user_key'

export default {
    // 保存用户数据
    
    saveUser(user){
        // localStorage.setItem(USER_KEY,JSON.stringify(user))  
        store.set(USER_KEY,user)
    },
    // 得到用户数据
    getUser(){
        // return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
        return store.get(USER_KEY) || {}
    },
    // 移除用户数据
    removeUser(){
        //localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY)
    }
}