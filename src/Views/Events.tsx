import * as React from 'react'

import Utils from '../Utils'
import './Place.css'


export default class Events extends React.Component {
  public componentDidMount(): void {
    Utils.setPageTitle("现场活动")
  }

  public render() {
    return (<div className="view-events">
      <div>现在还是秘密</div>
    </div>)
  }
}
