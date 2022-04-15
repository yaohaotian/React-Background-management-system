import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input
} from 'antd'

const Item = Form.Item

class AddForm extends Component {
  static propTypes = {
    setForm: PropTypes.func.isRequired
  }
  componentWillMount() {
    this.props.setForm(this.props.form)
  }
  render() {

    const { getFieldDecorator } = this.props.form

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 }
    }

    return (
      <Form {...formItemLayout}>
        <Item label='角色名称'>
          {
            getFieldDecorator('roleName', {
              rules: [{
                required: true,
                message: '角色名称不能为空'
              }]
            })(
              <Input placeholder='请输入角色名称' />
            )
          }
        </Item>

      </Form>
    )
  }
}

export default Form.create()(AddForm)