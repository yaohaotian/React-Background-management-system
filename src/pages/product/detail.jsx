import React, { Component } from 'react'
import {
  Card,
  List,
  Icon,
} from 'antd'

import LinkButton from '../../components/link-button'
import { BASE_IMG_URL } from '../../utils/constant'
import { reqCategory } from '../../api'

const Item = List.Item
export default class Detail extends Component {

  state = {
    cname1: '',
    cname2: ''
  }

  async componentDidMount() {
    const { pCategoryId, categoryId } = this.props.location.state.product
    if (pCategoryId === '0') {
      const result = await reqCategory(categoryId)
      const cname1 = result.data.name
      this.setState({
        cname1
      })
    } else {
      // const result1 = await reqCategory(pCategoryId)
      // const result2 = await reqCategory(categoryId)
      // const cname1 = result1.data.name
      // const cname2 = result2.data.name
      const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
      const cname1 = results[0].data.name
      const cname2 = results[1].data.name
      this.setState({
        cname1,
        cname2
      })
    }

  }

  render() {

    const title = (
      <span>
        <LinkButton>
          <Icon
            type='arrow-left'
            style={
              {
                fontSize: 20,
                marginRight: 10,
              }
            }
            onClick={() => this.props.history.goBack()}
          />
        </LinkButton>
        <span>商品详情</span>
      </span>
    )

    const { name, desc, price, detail, imgs } = this.props.location.state.product

    const { cname1, cname2 } = this.state

    return (
      <Card title={title} className='product-detail'>
        <List>
          <Item>
            <span className='left'>
              商品名称:
            </span>
            <span>{name}</span>
          </Item>
          <Item>
            <span className='left'>商品描述:</span>
            <span>{desc}</span>
          </Item>
          <Item>
            <span className='left'>商品价格:</span>
            <span>{price}元</span>
          </Item>
          <Item>
            <span className='left'>所属分类:</span>
            <span>
              {cname1}{cname2 ? '-->' + cname2 : ''}
            </span>
          </Item>
          <Item>
            <span className='left'>商品图片:</span>
            {
              imgs.map(img =>
                <img
                  key={img}
                  src={BASE_IMG_URL + img}
                  className='product-img'
                  alt="img"
                />
              )
            }
          </Item>
          <Item>
            <span className='left'>商品详情:</span>
            <div dangerouslySetInnerHTML={{ __html: detail }}></div>
          </Item>
        </List>
      </Card>
    )
  }
}
