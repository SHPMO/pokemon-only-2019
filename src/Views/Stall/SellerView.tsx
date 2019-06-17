import * as React from 'react'
import {RouteComponentProps} from 'react-router'
import API from '../../API/API'

import './SellerView.css'

import {Seller} from '../../API/Types'
import Utils from '../../Utils'
import Items from './Items'

export default class SellerView extends React.Component<RouteComponentProps<{ sellerId: string }>,
  { seller: Seller | null }> {

  public state: { seller: Seller | null } = {
    seller: null
  }

  public async componentDidMount() {
    Utils.setPageTitle('摊位一览 - 现场摊位')
    try {
      const seller = await API.getSeller(this.props.match.params.sellerId, false)
      Utils.setPageTitle(`${seller.circle_name} - 摊位一览 - 现场摊位`)
      this.setState({
        seller
      })
    } catch (_) {
      this.setState({
        seller: null
      })
    }
  }

  public render() {
    const seller = this.state.seller
    return seller !== null ? (<div className="seller-content">
      <div className="seller-detail">
        <div className="seller-detail-left">
          <div className="seller-cover"
               style={{backgroundImage: API.getBackgroundImage(seller.circle_image)}}/>
          <div className="seller-number">摊位号：{seller.seller_id ? seller.seller_id : '未定'}</div>
        </div>
        <div className="seller-detail-right">
          <div className="seller-detail-title">{seller.circle_name}</div>
          <div className="seller-description">{seller.circle_description}</div>
        </div>
      </div>
      <Items sellerId={seller.id.toString()}/>
    </div>) : <h1>暂无摊位信息</h1>
  }
}
