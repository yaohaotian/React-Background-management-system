import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Select,
  Input
} from 'antd'

const Item = Form.Item
const Option = Select.Option

class AddForm extends Component {
  static propTypes = {
    parentId:PropTypes.string.isRequired,
    categorys:PropTypes.array.isRequired,
    setForm:PropTypes.func.isRequired,
  }
  componentWillMount(){
    this.props.setForm(this.props.form)
  }
  render() {

    const {getFieldDecorator} = this.props.form
    const {parentId,categorys} = this.props

    return (
        <Form>
          <Item>
            {
              getFieldDecorator('parentId',{
                initialValue: parentId,
              })(
                <Select>
                  <Option value='0'>一级分类</Option>
                  {
                    categorys.map(c => <Option key={c._id} value={c._id}>{c.name}</Option>)
                  }
                </Select>
              )
            }
          </Item>
          
          <Item>
            {
              getFieldDecorator('categoryName',{
                rules:[{
                  required:true,
                  message:'分类名称不能为空'
                }]
              })(
                <Input placeholder='请输入商品名称' />
              )
            }
          </Item>

        </Form>
    )
  }
}

export default Form.create()(AddForm)