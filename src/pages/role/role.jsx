import React, { Component } from 'react'
import {
    Card,
    Button,
    Table,
    Modal,
    message,
} from 'antd'
import { reqAddRole, reqAuth, reqRoles } from '../../api'
import { PAGE_SIZE } from '../../utils/constant'
import AddRole from './addRole'
import AuthRole from './authRole'
import { formatDate } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

export default class Role extends Component {

    state = {
        roles: [],
        role: {},
        showAdd: false,
        showAuth: false,
    }

    constructor(props) {
        super(props)
        this.auth = React.createRef()
    }

    initColumns = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render:formatDate
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render:formatDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
            },
        ]
    }
    getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            const roles = result.data
            this.setState({
                roles
            })
        }
    }
    onRow = role => {
        return {
            onClick: event => {
                console.log(role)
                this.setState({
                    role
                })
            }, // 点击行
        }
    }

    addOk = () => {
        this.form.validateFields(async (error, values) => {
            if (!error) {
                const { roleName } = values
                this.form.resetFields()
                const result = await reqAddRole(roleName)
                if (result.status === 0) {
                    const role = result.data
                    this.setState((state) => ({
                        roles: [...state.roles, role],
                        showAdd: false
                    }))
                    message.success('添加角色成功')
                } else {
                    message.error('添加角色失败')
                }
            }
        })
        this.setState({
            visible: false,
        });

    };

    authOK = async () => {
        const menus = this.auth.current.getAuth()
        const role = this.state.role
        const auth_name = memoryUtils.user.username
        const auth_time = Date.now()
        role.menus = menus
        role.auth_name = auth_name
        role.auth_time = auth_time
        console.log(role);
        console.log('-----');
        console.log(memoryUtils.user);
        const result = await reqAuth(role)
        if (result.status === 0) {
            if(role.name === memoryUtils.user.role.name){
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                message.warn('修改自身角色权限成功，返回登录页面')
            }else{
                message.success('修改权限成功')
                this.setState({
                    showAuth: false,
                    auth_name,
                    auth_time
                })
            }
        } else {
            message.error('修改权限失败')
        }
    }

    UNSAFE_componentWillMount = () => {
        this.initColumns()
    }
    componentDidMount = () => {
        this.getRoles()
    }
    render() {
        const columns = this.columns
        const { roles, role, showAdd, showAuth } = this.state
        const title = (
            <div>
                <Button type='primary' onClick={() => {
                    this.setState({ showAdd: true })
                }}>
                    创建角色
                </Button>
                &nbsp;&nbsp;
                <Button type='primary' disabled={!role._id} onClick={() => {
                    this.setState({ showAuth: true })
                }}>
                    设置角色权限
                </Button>
            </div>
        )

        return (
            <div>
                <Card title={title}>
                    <Table
                        rowKey='_id'
                        dataSource={roles}
                        columns={columns}
                        rowSelection={{ type: 'radio', selectedRowKeys: [role._id],onSelect:(role) => {
                            this.setState({
                                role
                            })
                        } }}
                        pagination={{ defaultPageSize: PAGE_SIZE, }}
                        onRow={this.onRow}
                    />
                </Card>
                <Modal
                    title="添加角色"
                    visible={showAdd}
                    onOk={this.addOk}
                    onCancel={() => {
                        this.setState({ showAdd: false, })
                        this.form.resetFields()
                    }}
                >
                    <AddRole setForm={form => this.form = form} />
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={showAuth}
                    onOk={this.authOK}
                    onCancel={() => {
                        this.setState({ showAuth: false })
                    }}
                >
                    <AuthRole ref={this.auth} role={role} />
                </Modal>
            </div>
        )
    }
}
