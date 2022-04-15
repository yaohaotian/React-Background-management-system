import React, { Component } from 'react'
import {
    Table,
    Card,
    Icon,
    Button,
    message,
    Modal
} from 'antd'


import { reqCategorys, reqUpdateCategory ,reqAddCategory} from '../../api'
import './category.less'
import LinkButton from '../../components/link-button'
import AddForm from './add-form'
import UpdateForm from './update-form'
export default class Category extends Component {
    state = {
        categorys: [],
        subCategorys: [],
        parentId: '0',
        parentName: '',
        loading: false,
        showStatus: 0
    }

    getCategorys = async (parentId) => {
        this.setState({
            loading: true
        })
        parentId = parentId || this.state.parentId
        const result = await reqCategorys(parentId)
        this.setState({
            loading: false
        })
        if (result.status === 0) {
            const categorys = result.data
            if (parentId === '0') {
                this.setState({
                    categorys
                })
            } else {
                this.setState({
                    subCategorys: categorys
                })
            }

        } else {
            message.error('请求列表失败')
        }
    }

    showSubCates = (category) => {
        this.setState({
            parentId: category._id,
            parentName: category.name,
        }, () => { // 在状态更新之后执行, 在回调函数中能得到最新的状态数据
            this.getCategorys()
        })
    }

    showCategorys = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: [],
            showStatus: 0,
        })
    }

    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }

    showUpdate = (category) => {

        this.category = category

        this.setState({
            showStatus: 2
        })
    }

    addCategory = () => {
        
        this.form.validateFields(async(err,value) => {
            if(!err){
                this.setState({
                    showStatus:0,
                })
        
                const {parentId,categoryName} = value
        
                 this.form.resetFields()
                 const result= await reqAddCategory(parentId,categoryName)
        
                if(result.status === 0){
        
                    if(parentId===this.state.parentId){
                        this.getCategorys()
                    }else if(parentId==='0'){
                        this.getCategorys('0')
                    }
                }
            }
        })

    }

    updateCategory = () => {
        this.form.validateFields(async(err,value) => {
            if(!err){
                this.setState({
                    showStatus: 0,
                })
        
                const categoryId = this.category._id
                const {categoryName} = value
                const result = await reqUpdateCategory({ categoryId, categoryName })
        
                this.form.resetFields()
                if (result.status === 0) {
                    this.getCategorys()
                }
            }
        })
    }

    handleCancel = () => {

        this.form.resetFields()

        this.setState({
            showStatus: 0,
        })
    }

    UNSAFE_componentWillMount() {
        this.columns = [
            {
                title: '分类的名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                width: 300,
                render: (category) =>
                    <span>
                        <LinkButton onClick={() => { this.showUpdate(category) }}>修改分类</LinkButton>
                        {
                            this.state.parentId === '0' ?
                                <LinkButton onClick={() => { this.showSubCates(category) }}>查看子分类</LinkButton> : null
                        }
                    </span>,
            },
        ]
        this.getCategorys()
    }

    render() {
        const extra = (
            <Button
                type='primary'
                onClick={this.showAdd}
            >
                <Icon type='plus' />
                添加
            </Button>
        )

        const { categorys, subCategorys, parentId, parentName, loading, showStatus } = this.state

        const category = this.category || {}

        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton> &nbsp;&nbsp;
                <Icon type='arrow-right' />&nbsp;&nbsp;
                <span>{parentName}</span>
            </span>
        )
        return (
            <div>
                <Card
                    title={title}
                    extra={extra}
                >
                    <Table
                        rowKey='_id'
                        dataSource={parentId === '0' ? categorys : subCategorys}
                        columns={this.columns}
                        loading={loading}
                        pagination={{
                            defaultPageSize: 5,
                            showQuickJumper:true,
                        }}
                        bordered

                    />
                </Card>

                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm parentId={parentId} categorys={categorys} setForm={form => this.form = form} />
                </Modal>

                <Modal
                    title="修改分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm categoryName={category.name} setForm={form => this.form = form} />
                </Modal>
            </div>
        )
    }
}
