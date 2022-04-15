import React, { Component } from 'react'
import { Menu, Icon,} from 'antd';
import {Link, withRouter} from 'react-router-dom'
import menuconfig from '../../config/menuConfig'
import logo from '../../assets/images/logo.png'
import './index.less'
import memoryUtils from '../../utils/memoryUtils';
const { SubMenu } = Menu;

class LeftNav extends Component {
    UNSAFE_componentWillMount(){
        this.menuNodes= this.getMenuNodes2(menuconfig)
    }

    hasAuth = (item)=>{
        const username = memoryUtils.user.username
        const menus = memoryUtils.user.role.menus
        const {key,isPublic} = item
        if(username === 'admin'||menus.indexOf(key)!==-1||isPublic){
            return true
        }else if(item.children && item.children.find(c=>menus.indexOf(c.key)!==-1)){
            return true
        }
    }

    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname
        return menuList.map((item) => {
            if(!item.children){
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            }else{
                // 如果当前请求路由与当前菜单的某个子菜单的 key 匹配, 将菜单的 key 保存为 openKey
                    if(item.children.find(cItem => path.indexOf(cItem.key)===0)) {
                    this.openKey = item.key
                }
                return (
                    <SubMenu
                        key={item.key}
                        title={
                        <span>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </span>
                        }
                    >
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }
        })
    }
    
    getMenuNodes2 = (menuList) => {
        return menuList.reduce((pre,item) => {
            if(this.hasAuth(item)){
                if(!item.children){
                    pre.push(
                        <Menu.Item key={item.key}>
                            <Link to={item.key}>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    )
                }else{
                    const path = this.props.location.pathname
                    if(item.children.find(cItem => path.indexOf(cItem.key)===0)){
                        this.openKey = item.key
                    }
                    pre.push(
                        <SubMenu
                            key={item.key}
                            title={
                            <span>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </span>
                            }
                        >
                            {this.getMenuNodes2(item.children)}
                        </SubMenu>
                    )
                }
            }
            return pre
        },[])
    }
    
    render() {
        let selectKey = this.props.history.location.pathname
        if(selectKey.indexOf('/product') === 0){
            selectKey = '/product'
        }
        let openKey = this.openKey
        return (
            <div className='left-nav'>
                <Link to='/'>
                    <div className='left-nav-head'>
                        <img src={logo} alt="logo" />
                        <h1>硅谷后台</h1>
                    </div>
                </Link>
                
                <Menu
                selectedKeys={[selectKey]}
                defaultOpenKeys={[openKey]}
                mode="inline"
                theme="dark"
                >
                {
                    this.menuNodes
                }
                </Menu>
            </div>
        )
    }
}

export default withRouter(LeftNav)