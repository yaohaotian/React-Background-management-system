import React, { Component } from 'react'
import {
  Card,
  Form,
  Button,
  Input,
  Icon,
  Cascader,
  message,
} from 'antd'

import LinkButton from '../../components/link-button'
import { reqCategorys, reqAddOrUpdateProduct } from '../../api'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'

const { Item } = Form
const { TextArea } = Input

class productAddUpdate extends Component {

  state = {
    options: [],
  }

  constructor(props) {
    super(props)
    this.pw = React.createRef()
    this.editor = React.createRef()
  }

  submit = () => {
    this.props.form.validateFields(async (error, values) => {
      if (!error) {
        const { name, desc, price, categoryIds } = values

        let pCategoryId // eslint-disable-line no-unused-vars
        let categoryId
        if (categoryIds.length === 1) {
          pCategoryId = '0'
          categoryId = categoryIds[0]
        } else {
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        }

        const imgs = this.pw.current.getImgs()
        const detail = this.editor.current.getDetail()

        const product = { name, desc, categoryId, price, imgs, detail }
        console.log(product);
        if (this.isUpdate) {
          product._id = this.product._id
        }

        const result = await reqAddOrUpdateProduct(product)

        if (result.status === 0) {
          message.success(`${this.isUpdate ? '更新' : '添加'}商品成功`)
          this.props.history.goBack()
        } else {
          message.error(`${this.isUpdate ? '更新' : '添加'}商品失败`)
        }
      }
    })
  }

  validatePrice = (rule, value, callback) => {
    if (value * 1 > 0) {
      callback()
    } else {
      callback('价格必须大于0')
    }
  }

  loadData = async selectedOptions => {
    const targetOption = selectedOptions[0]
    targetOption.loading = true
    const subCategorys = await this.getCategorys(targetOption.value)
    targetOption.loading = false
    if (subCategorys && subCategorys.length > 0) {
      const cCategorys = subCategorys.map(c => ({
        label: c.name,
        value: c._id,
        isLeaf: true
      }))
      targetOption.children = cCategorys

    } else {
      targetOption.isLeaf = true
    }
    this.setState({
      options: [...this.state.options],
    })
  }

  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId)
    if (result.status === 0) {
      const categorys = result.data
      if (parentId === 0) {
        this.initOptions(categorys)
      } else {
        return categorys
      }
    }
  }

  initOptions = async (categorys) => {
    const options = categorys.map(c => ({
      value: c._id,
      label: c.name,
      isLeaf: false,
    }))

    const { product, isUpdate } = this

    const { pCategoryId } = product

    if (isUpdate && pCategoryId !== '0') {
      const subCategorys = await this.getCategorys(pCategoryId)

      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }))

      const targetOption = options.find(option => option.value === pCategoryId)

      targetOption.children = childOptions
    }

    this.setState({
      options
    })
  }

  componentWillMount() {
    const product = this.props.location.state
    this.isUpdate = !!product
    this.product = product || {}
  }

  componentDidMount() {
    this.getCategorys(0)
  }

  render() {

    const { isUpdate, product } = this

    const { name, desc, price, categoryId, pCategoryId, imgs, detail } = product

    const categoryIds = []

    if (isUpdate) {
      if (pCategoryId === '0') {
        categoryIds.push(categoryId)
      } else {
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }

    const title = (
      <span>
        <LinkButton>
          <Icon type='arrow-left' onClick={() => this.props.history.goBack()} />
        </LinkButton>
        {isUpdate ? '修改' : '添加'}商品
      </span>
    )

    const formItemLayout = {
      labelCol: {
        span: 2
      },
      wrapperCol: {
        span: 8
      },
    }

    const { getFieldDecorator } = this.props.form

    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label='商品名称'>
            {
              getFieldDecorator('name', {
                initialValue: name,
                rules: [
                  {
                    required: true,
                    message: '请输入商品名称'
                  }
                ]
              }
              )(
                <Input placeholder='请输入商品名称' />
              )}
          </Item>
          <Item label='商品描述'>
            {getFieldDecorator('desc', {
              initialValue: desc,
              rules: [
                {
                  required: true,
                  message: '请输入商品描述',
                },
              ]
            })(
              <TextArea
                placeholder="请输入商品描述"
                autosize={{ minRows: 2, maxRows: 6 }}
              />
            )}

          </Item>
          <Item label='商品价格'>
            {
              getFieldDecorator('price', {
                initialValue: price,
                rules: [
                  {
                    required: true,
                    message: '请输入商品价格',
                  },
                  {
                    validator: this.validatePrice,
                  }
                ]
              })(
                <Input prefix="￥" suffix="RMB" />
              )
            }
          </Item>
          <Item label='商品分类'>
            {
              getFieldDecorator('categoryIds', {
                initialValue: categoryIds,
                rules: [
                  {
                    required: true,
                    message: '请选择商品分类',
                  },
                ]
              })(
                <Cascader
                  placeholder='请选择商品分类'
                  options={this.state.options}
                  loadData={this.loadData}
                />
              )
            }
          </Item>
          <Item label='商品图片'>
            <PicturesWall ref={this.pw} imgs={imgs} />
          </Item>
          <Item label='商品详情' labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
            <RichTextEditor ref={this.editor} detail={detail} />
          </Item>
          <Item>
            <Button type='primary' onClick={this.submit}>提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(productAddUpdate)