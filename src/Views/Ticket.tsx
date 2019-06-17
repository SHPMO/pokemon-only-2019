import * as React from 'react'

import Utils from '../Utils'


export default class Ticket extends React.Component {
  public componentDidMount(): void {
    Utils.setPageTitle('票务信息')
  }

  public render() {
    return (<div className="view-ticket">
      <div>即将开始（请期待后续宣传）</div>
    </div>)
  }
}
