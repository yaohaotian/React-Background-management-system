import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input,
  Select
} from 'antd'

const Item = Form.Item
const Option = Select.Option
class AddUser extends PureComponent {
  static propTypes = {
    setForm: PropTypes.func.isRequired,
    roles:PropTypes.array.isRequired,
    user:PropTypes.object
  }
  componentWillMount() {
    this.props.setForm(this.props.form)
  }
  render() {

    const { getFieldDecorator } = this.props.form

    const {roles} = this.props

    const user = this.props.user || {}

    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 }
    }

    return (
      
      <Form {...formItemLayout}>
        <Item label='角色名称'>
          {
            getFieldDecorator('username', {
              initialValue:user.username,
              rules: [{
                required: true,
                message: '角色名称不能为空'
              }]
            })(
              <Input placeholder='请输入角色名称' />
            )
          }
        </Item>
        {user._id ? null:(<Item label='密码'>
          {
            getFieldDecorator('password', {
              rules: [{
                required: true,
                message: '密码不能为空'
              }]
            })(
              <Input type='password' placeholder='请输入密码' />
            )
          }
        </Item>)}
        <Item label='手机号'>
          {
            getFieldDecorator('phone', {
              initialValue:user.phone,
              rules: [{
                required: true,
                message: '手机号不能为空'
              }]
            })(
              <Input  placeholder='请输入手机号' />
            )
          }
        </Item>
        <Item label='邮箱'>
          {
            getFieldDecorator('email', {
              initialValue:user.email,
              rules: [{
                required: true,
                message: '邮箱不能为空'
              }]
            })(
              <Input placeholder='请输入邮箱' />
            )
          }
        </Item>
        <Item label='角色'>
          {
            getFieldDecorator('role_id', {
                initialValue: user.role_id,
            })(
              <Select>
                {roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)}
              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(AddUser)