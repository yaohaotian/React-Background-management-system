import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal,} from 'antd';

import {  reqWeather , } from '../../api'
import { formatDate } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import menuList from '../../config/menuConfig'
import './index.less'
import LinkButton from '../link-button';

const { confirm } = Modal;

class Head extends Component {

    state = {
        sysTime:formatDate(Date.now()),
        weather:'',
        city:''
    }
    

    showConfirm =()=>{
        confirm({
          content: '确认退出吗',
          onOk:()=>{
            storageUtils.removeUser()
            memoryUtils.user = {}
            this.props.history.replace('/login')
          },
        })
    }

    getWeather = async (cityNo) => {
        const result = await reqWeather(cityNo)
        const {weather,city} = result.lives[0]
        this.setState({
            weather,
            city
        })
    }

    getTime = () => {
        this.setState({
            sysTime:formatDate(Date.now())
        })
    }

    getTitle = (path) => {
        let title
        menuList.forEach((item) => {
            if(item.key === path){
                title = item.title
            }else if(item.children){
                const citem = item.children.find(citem =>path.indexOf(citem.key)===0)
                if(citem){
                    title = citem.title
                }
            }
        })
        return title
    }

    componentDidMount(){
        this.getWeather(330100)
        this.intervalId = setInterval(() => {
            this.getTime()
        },1000)
    }
    componentWillUnmount(){
        clearInterval(this.intervalId)
    }
    render() {
        const {sysTime,city,weather} = this.state

        const username = memoryUtils.user.username

        const path = this.props.location.pathname

        const title = this.getTitle(path)

        return (
            <div className='head'>
                <div className='head-top'>
                    <span>欢迎,{username}</span>
                    <LinkButton onClick = {this.showConfirm}>退出</LinkButton>
                </div>
                <div className='head-bottom'>
                    <div className='head-bottom-left'>
                        <span>{title}</span>
                    </div>
                    <div className='head-bottom-right'>
                        <span>{sysTime}</span>
                        <span>{city}</span>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Head)
