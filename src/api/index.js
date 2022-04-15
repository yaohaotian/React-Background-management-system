import ajax from './ajax'
const BASE = ''

//登录
// export function reqLogin(usrname,password) {
//     return ajax('/login',{usrname,password},'POST')
// }

export const reqLogin = (username, password) => ajax(BASE + '/login', { username, password }, 'POST')

export const reqAdd = (user) => ajax(BASE + '/manage/user/add', user, 'POST')

export const reqWeather = (city) => {
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${city}&key=c8058202d0885bd56a90500fa77f40e7`
    return ajax(url, {})
}

export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', { parentId })

export const reqAddCategory = (parentId, categoryName) => ajax('/manage/category/add', { parentId, categoryName }, 'POST')

export const reqUpdateCategory = ({ categoryId, categoryName }) => ajax(BASE + '/manage/category/update', { categoryId, categoryName }, 'POST')

export const reqProducts = (pageNum, pageSize) => ajax(BASE + 'manage/product/list', { pageNum, pageSize })

export const reqSearchProducts = ({ pageNum, pageSize, searchType, searchName }) => ajax(BASE + '/manage/product/search', { pageNum, pageSize, [searchType]: searchName })

export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', { categoryId })

export const reqUpdate = (productId, status) => ajax(BASE + '/manage/product/updateStatus', { productId, status }, 'POST')

export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', { name }, 'POST')

export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')

export const reqRoles = () => ajax(BASE + '/manage/role/list')

export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add',{roleName},'POST')

export const reqAuth = role => ajax(BASE + '/manage/role/update',role,'POST')

export const reqUsers = () => ajax(BASE + '/manage/user/list')

export const reqRemoveUser = (userId) => ajax(BASE + '/manage/user/delete',{userId},'POST')

export const reqAddOrUpdateUser = (role) => ajax(BASE + '/manage/user/'+(role._id ? 'update' : 'add'),role,'POST')




