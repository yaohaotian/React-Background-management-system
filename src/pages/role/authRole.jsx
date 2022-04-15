import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input,
  Tree
} from 'antd'

import menuList from '../../config/menuConfig'

const Item = Form.Item
const { TreeNode } = Tree

export default class AuthForm extends PureComponent {
  static propTypes = {
    role: PropTypes.object
  }

  state = {
    checkedKeys: []
  }

  constructor(props) {
    super(props)
    this.state = {
      checkedKeys: this.props.role.menus,
    }
  }

  getTreeNodes = (menuList) => {
    return menuList.reduce((pre, item) => {
      pre.push(
        <TreeNode title={item.title} key={item.key} >
          {item.children ? this.getTreeNodes(item.children) : null}
        </TreeNode>
      )
      return pre
    }, [])
  }

  getAuth = () => this.state.checkedKeys

  onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  };

  componentWillMount() {
    this.treeNodes = this.getTreeNodes(menuList)
  }

  componentWillReceiveProps(nextProps){
    const menus = nextProps.role.menus
    this.setState({
      checkedKeys:menus
    })
  }
  render() {
    const {checkedKeys} = this.state
    const { role } = this.props

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 }
    }

    return (
      <Form {...formItemLayout}>
        <Item label='角色名称'>
          <Input value={role.name} disabled />
          {this.TreeNodes}
        </Item>
        <Item>
          <Tree
            checkable
            defaultExpandAll
            checkedKeys={checkedKeys}
            onCheck={this.onCheck}
          >
            {this.treeNodes}
          </Tree>
        </Item>
      </Form>
    )
  }
}
