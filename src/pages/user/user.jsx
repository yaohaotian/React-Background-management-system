import React, { Component } from 'react'
import {
    Card,
    Button,
    Table,
    Modal,
    message
} from 'antd'

import { PAGE_SIZE } from '../../utils/constant'
import  LinkButton from '../../components/link-button/index'
import { reqAddOrUpdateUser, reqRemoveUser, reqUsers } from '../../api'
import { formatDate } from '../../utils/dateUtils'
import UserForm from './user-form'

const { confirm } = Modal

export default class User extends Component {
    state = {
        users:[],
        roles:[],
        showForm:false
    }


    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
                width:200
            },
            {
                title: '邮箱',
                dataIndex: 'email',
                width:300
            },
            {
                title: '电话',
                dataIndex: 'phone',
                width:200
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                width:200,
                render: (create_time) =>(
                    formatDate(create_time)
                )
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                width:200,
                render: role_id => this.rolesNames[role_id]
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
                        <LinkButton onClick = {() => {this.UpdateUser(user)}}>修改</LinkButton>
                        <LinkButton onClick = {() => {this.removeUser(user)}}>删除</LinkButton>
                    </span>
                )
            }
        ]
    }

    initRolesNames = (roles) => {
        this.rolesNames = roles.reduce((pre,role) => {
            pre[role._id] = role.name
            return pre
        },{})
    }

    getUsers = async() => {
        const result = await reqUsers()
        if(result.status === 0){
            const {users,roles} = result.data
            this.initRolesNames(roles)
            this.setState({
                users,
                roles
            })
        }
    }

    removeUser(user){
        confirm({
            title: `确认删除${user.username}吗`,
            onOk:async()=>{
              const result = await reqRemoveUser(user._id)
              if(result.status === 0){
                message.success('删除用户成功')
                this.getUsers()
              }
            },
          })
    }

    createUser(){
        this.user = null
        this.setState({showForm:true})
    }
    
    UpdateUser(user){
        this.user = user
        console.log(user);
        this.setState({
            showForm:true
        })
    }

    onOk = () => {
        this.form.validateFields(async(error,values) => {
            if(!error){
                this.form.resetFields()
                const user = values
                if(this.user){
                    user._id = this.user._id
                }
                const result = await reqAddOrUpdateUser(user)
                if(result.status === 0){
                    message.success(`${this.user?'修改':'创建'}用户成功`)
                    this.setState({
                        showForm:false
                    })
                    this.getUsers()
                }else{
                    message.error(`${this.user?'修改':'创建'}用户失败`)
                }    
            }
        })
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount(){
        this.getUsers()
    }

    render() {
        const title = (
            <Button type='primary' onClick={()=>this.createUser()}>创建用户</Button>
        )
        const {columns,user} = this
        const {users,showForm,roles} = this.state
        return (

            <div>
                <Card title={title}>
                    <Table
                        rowKey='_id'
                        columns={columns}
                        pagination={{ defaultPageSize: PAGE_SIZE, }}
                        bordered
                        dataSource={users}
                    />
                    <Modal
                        title={`${this.user?'修改':'创建'}用户`}
                        visible={showForm}
                        onOk={this.onOk}
                        onCancel={()=>{
                            this.setState({showForm:false})
                            this.form.resetFields()
                        }}
                    >
                        <UserForm user={user} roles={roles} setForm={form => this.form = form}/>
                    </Modal>
                </Card>
            </div>
        )
    }
}
