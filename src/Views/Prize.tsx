import * as React from 'react'

import Utils from '../Utils'
import './Place.css'


export default class Prize extends React.Component {
  public componentDidMount(): void {
    Utils.setPageTitle('奖品一览')
  }

  public render() {
    return (<div className="view-prize">
      <div>现在还是秘密</div>
    </div>)
  }
}
