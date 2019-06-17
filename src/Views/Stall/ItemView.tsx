import * as React from 'react'
import {Link, RouteComponentProps} from 'react-router-dom'

import './ItemView.css'

import API from '../../API/API'
import {Item, Seller} from '../../API/Types'
import Utils from '../../Utils'

export default class ItemView extends React.Component<RouteComponentProps<{
  itemId: string
}>, {
  item: Item | null, seller: Seller | null, preview: string | null
}> {
  public state: {
    item: Item | null, seller: Seller | null, preview: string | null
  } = {
    item: null,
    seller: null,
    preview: null
  }

  public async componentDidMount() {
    try {
      const item = await API.getItem(this.props.match.params.itemId, false)
      const seller = await API.getSeller(item.seller_id.toString(), false)
      Utils.setPageTitle(`${item.name} - 商品一览 - 现场摊位`)
      this.setState({
        item,
        seller
      })
    } catch (_) {
      this.setState({
        item: null,
        seller: null
      })
    }
  }

  private togglePreview(preview: string | null) {
    return () => {
      this.setState({
        preview
      })
    }
  }

  public render() {
    const item = this.state.item
    const seller = this.state.seller
    return item !== null && seller !== null ? (<div className="item-content">
        <div id="item-metas">
          <div id="item-meta-left" className="item-meta">
            <div id="item-cover" style={{backgroundImage: API.getBackgroundImage(item.cover_image)}}
                 onClick={this.togglePreview(item.cover_image)}/>
          </div>
          <div id="item-meta-right" className="item-meta">
            <div id="item-name">{item.name}</div>
            <div id="item-type" className="item-meta-value">种类：{item.item_type}</div>
            <div id="item-content" className="item-meta-value">内容：{item.content}</div>
            <div id="item-price"
                 className="item-meta-value">价格：{item.price === -1 ? '未定' : (item.price.toFixed(2) + ' 元')}</div>
            <div id="item-url" className="item-meta-value">链接：{
              item.url ? <a href={item.url} className="maintext-href"
                            target="_blank">{item.url}</a> : <span>无</span>
            }</div>
            <div id="item-from" className="item-meta-value">来自：<Link
              to={'/stall/' + item.seller_id}>{seller.circle_name}</Link>
            </div>
          </div>
        </div>
        <ul id="item-others">
          <li id="item-circle" className="item-others-value">
            <span>出品社团：</span>
            <span>{item.circle}</span>
          </li>
          <li id="item-introduction" className="item-others-multiline">
            <span>简介：</span>
            <div>{item.introduction}</div>
          </li>
          <li id="item-authors" className="item-others-multiline">
            <span>作者名单：</span>
            <div>{item.authors}</div>
          </li>
          <li id="item-forto" className="item-others-value">
            <span>面向人群：</span>
            <span>{item.forto}</span>
          </li>
          <li id="item-is_restricted" className="item-others-value">
            <span>限制级是否：</span>
            <span>{item.is_restricted}</span>
          </li>
          <li id="item-is_started_with" className="item-others-value">
            <span>是否首发：</span>
            <span>{item.is_started_with ? '是' : '否'}</span>
          </li>
        </ul>
        <div id="item-images" className="item-others-multiline clear-group">
          <span>相关图像：</span>
          <div>
            {item.item_pictures.map((x, i) =>
              <div key={i} className="item-image-thumb" onClick={this.togglePreview(x)}>
                <div style={{backgroundImage: API.getBackgroundImage(x)}}/>
              </div>
            )}
          </div>
        </div>
        {this.state.preview !== null ?
          <div className="image-preview" onClick={this.togglePreview(null)}>
            <img src={API.getImageUrl(this.state.preview)}/>
          </div> : []}
      </div>
    ) : <h2>暂无商品信息</h2>
  }
}
