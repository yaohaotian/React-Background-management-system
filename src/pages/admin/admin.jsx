/*
    后台管理主路由组件
*/
import React, {Component} from 'react'
import {Redirect, Route , Switch} from 'react-router-dom'
import {Layout} from 'antd'

import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../components/left-nav'
import Head from '../../components/head'
import Home from '../home/home'
import Product from '../product/product'
import Category from '../category/category'
import User from '../user/user'
import Role from '../role/role'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Bie from '../charts/bie'
const { Header, Footer, Sider, Content } = Layout;

export default class Admin extends Component {
    render () {
        const user = memoryUtils.user
        if(!user||!user._id){
            return <Redirect to = '/login'/>
        }
        return (
                <Layout style={{minHeight:'100%'}}>
                    <Sider>
                        <LeftNav/>
                    </Sider>
                    <Layout style={{}}>
                        <Header  style={{padding:0,height:80}}>
                            <Head/>
                        </Header>
                        <Content style={{margin:20,backgroundColor:'#fff'}}>
                            <Switch>    
                                <Route path = '/home' component = {Home}/>
                                <Route path = '/category' component = {Category}/>
                                <Route path = '/product' component = {Product}/>
                                <Route path = '/user' component = {User}/>
                                <Route path = '/role' component = {Role}/>
                                <Route path = '/charts/bar' component = {Bar}/>
                                <Route path = '/charts/line' component = {Line}/>
                                <Route path = '/charts/pie' component = {Bie}/>
                                <Redirect to = '/home'/>
                            </Switch> 
                        </Content>
                        <Footer  style={{textAlign: 'center', color: '#aaaaaa'}}>
                            推荐使用谷歌浏览器，可以获得更佳页面操作体验
                        </Footer>
                    </Layout>
                </Layout>
        )
    }
}