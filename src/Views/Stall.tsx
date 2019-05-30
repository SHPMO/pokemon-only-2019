import * as React from 'react'

import Utils from '../Utils'
import './Place.css'


export default class Stall extends React.Component {
  public componentDidMount(): void {
    Utils.setPageTitle('现场摊位')
  }

  public render() {
    return (<div className="view-stall">
      <div>即将开始</div>
    </div>)
  }
}
