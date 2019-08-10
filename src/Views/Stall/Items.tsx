import * as React from 'react'
import {Link} from 'react-router-dom'
import API, {ModelArray} from '../../API/API'
import {Item} from '../../API/Types'
import Utils from '../../Utils'

import './Items.css'

export default class Items extends React.Component<{ sellerId?: string }, { items: ModelArray<Item> }> {
  public state = {
    items: {}
  }

  public async componentDidMount() {
    if (this.props.sellerId === undefined) {
      Utils.setPageTitle('商品一览 - 现场摊位')
    }
    try {
      const items = await API.getItems(this.props.sellerId ? this.props.sellerId : null, false)
      this.setState({
        items
      })
    } catch (_) {
      this.setState({
        items: {}
      })
    }
  }

  public render() {
    const itemIds = Object.keys(this.state.items)
    if (itemIds.length % 2 === 1) {
      itemIds.push('')
    }
    return (<div>
      <div className="item-list">
        {itemIds.length > 0 ? itemIds.map((itemId, i: number) => {
          if (itemId === '') {
            return <div key={i} className="item-display"/>
          }
          const item = this.state.items[itemId] as Item
          const url = '/stall/items/' + itemId
          return (<div key={i} className="item-display">
            <div className="item-left">
              <Link to={url} className="item-cover"
                    style={{backgroundImage: API.getBackgroundImage(item.cover_image)}}/>
            </div>
            <div className="item-right">
              <Link to={url} className="item-name">{item.name}</Link>
              <div className="item-price">价格：{item.price === -1 ? '未定' : (item.price.toFixed(2) + ' 元')}</div>
              <div className="item-circle">出品社团：{item.circle}</div>
              <div className="item-intro">简介：{item.introduction}</div>
            </div>
          </div>)
        }) : <h2>暂无商品信息</h2>}
      </div>
    </div>)
  }
}
