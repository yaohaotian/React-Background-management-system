import React, { Component } from 'react'
import {
  Card,
  Input,
  Button,
  Icon,
  Select,
  Table,
  message
} from 'antd'
import { reqProducts,reqSearchProducts } from '../../api'
import LinkButton from '../../components/link-button'
import {PAGE_SIZE} from '../../utils/constant'
import { reqUpdate } from '../../api'

const Option = Select.Option
export default class ProductHome extends Component {

  state = {
    total:0,
    products:[],
    isloading:false,
    searchType:'productName',
    searchName:'',
  }

  
  initColumns = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        render:(price) => '￥' + price,
      },
      {
        width:100,
        title: '状态',
        //dataIndex:'status'
        render:(product) => {
          
          const {status,_id} = product 
          return (
            <span>
              <Button 
                type='primary'
                onClick={() => this.updateCategory(_id,status)}
              >
                {status === 1 ? '下架':'上架'}
              </Button>
              <span>
                {status === 1 ? '在售':'已下架'}
              </span>
            </span>
          )
        },
      },
      {
        width:100,
        title: '操作',
        render:(product) => (
          <span>
            <LinkButton onClick={() => this.props.history.push('/product/detail',{product})}>详情</LinkButton>
            <LinkButton onClick = {() => { this.props.history.push('/product/addUpdate',product) }}>修改</LinkButton>
          </span>
        )
      }
    ]
  }

  getProducts = async(pageNum) => {
    this.pageNum = pageNum
    const {searchType,searchName} = this.state
    this.setState({isloading:true})
    let result
    if(searchName){
      result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchType,searchName})
    }else{
      result = await reqProducts(pageNum,PAGE_SIZE)
    }
    this.setState({isloading:false})
    if(result.status===0){
      const {total,list,} = result.data
      this.setState({
        total,
        products:list,
      })
    }
  }
  
  async updateCategory(_id,status){
    const result = await reqUpdate(_id,status===1?2:1)
    if(result.status===0){
      message.success('更新物品信息成功')
      this.getProducts(this.pageNum)
    }
  }

  componentWillMount(){
    this.initColumns()
  }

  componentDidMount(){
    this.getProducts(1)
  }

  

  render() {

    const {products,total,isloading,searchType,searchName} = this.state

    const title = (
      <span>
        <Select 
          style={{width:150}} 
          value={searchType}
          onChange={(value) => {this.setState({
            searchType:value
          })}
        }
        >
          <Option value='productName'>按名称搜索</Option>
          <Option value='productDesc'>按描述搜索</Option>
        </Select>
        <Input 
          style={{ width: 150,margin:'0 15px'}} 
          placeholder='关键字' 
          value={searchName}
          onChange={
            (event) => {
              this.setState({
                  searchName:event.target.value
                }
              )
            }
          }
        />
        <Button 
          type='primary'
          onClick={
            () => {this.getProducts(1)}
          }
        >搜索</Button>
      </span>
    )

    const extra = (
      <span>
        <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
          <Icon type='plus' />
          添加商品
        </Button>
      </span>
    )

    return (


      <Card title={title} extra={extra}>
        <Table 
          bordered
          loading = {isloading}
          rowKey='_id'
          dataSource={products} 
          columns={this.columns}
          pagination={{
            current:this.pageNum,
            total,
            defaultPageSize:PAGE_SIZE,
            showQuickJumper:true,
            onChange:this.getProducts
          }}
          />
      </Card>
    )
  }
}
