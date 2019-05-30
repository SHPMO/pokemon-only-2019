import * as React from 'react'

import Utils from '../Utils'
import './Place.css'


export default class Ticket extends React.Component {
  public componentDidMount(): void {
    Utils.setPageTitle('票务信息')
  }

  public render() {
    return (<div className="view-ticket">
      <div>即将开始</div>
    </div>)
  }
}
