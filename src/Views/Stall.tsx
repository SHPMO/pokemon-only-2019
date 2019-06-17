import * as React from 'react'

import {Route, Switch} from 'react-router'
import {HashRouter, Link} from 'react-router-dom'

import Utils from '../Utils'
import './Stall.css'
import Items from './Stall/Items'
import ItemView from './Stall/ItemView'
import Sellers from './Stall/Sellers'
import SellerView from './Stall/SellerView'


export default class Stall extends React.Component {

  public componentDidMount(): void {
    Utils.setPageTitle('现场摊位')
  }

  public render() {
    return (<div className="view-stall">
      <HashRouter>
      <div className="stall-navs">
        <Link to="/stall">摊位一览</Link>
        <Link to="/stall/items">商品一览</Link>
        <a href="https://www.getdaze.org/dashboard/register/signupin/">摊位申请</a>
      </div>
      <Switch>
        <Route exact={true} path="/stall" name="Sellers" component={Sellers}/>
        <Route exact={true} path="/stall/items" name="Items" component={Items}/>
        <Route exact={true} path="/stall/items/:itemId" name="Item" component={ItemView}/>
        <Route exact={true} path="/stall/:sellerId" name="Seller" component={SellerView}/>
      </Switch>
      </HashRouter>
    </div>)
  }
}
