import * as React from 'react'
import {Link} from 'react-router-dom'
import API, {ModelArray} from '../../API/API'
import {Seller} from '../../API/Types'
import Utils from '../../Utils'

import './Sellers.css'

export default class Sellers extends React.Component<{}, { sellers: ModelArray<Seller> }> {
  public state = {
    sellers: {}
  }

  public async componentDidMount() {
    Utils.setPageTitle('摊位一览 - 现场摊位')
    try {
      const sellers = await API.getSellers(false)
      this.setState({
        sellers
      })
    } catch (_) {
      this.setState({
        sellers: {}
      })
    }
  }

  public render() {
    const sellerIds = Object.keys(this.state.sellers)
    return (<div className="seller-list">
      {sellerIds.length > 0 ? sellerIds.map((sellerId, i: number) => {
        const seller = this.state.sellers[sellerId] as Seller
        return (<Link to={'/stall/' + sellerId} key={i} className="seller-display">
          <div className="seller-cover"
               style={{backgroundImage: API.getBackgroundImage(seller.circle_image)}}/>
          <div className="seller-title">{seller.circle_name}</div>
        </Link>)
      }) : <h2>暂无摊位信息</h2>}
    </div>)
  }
}
