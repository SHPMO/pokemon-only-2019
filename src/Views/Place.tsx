import * as React from 'react'

import './Place.css'


export default class Place extends React.Component {
  public render() {
    return (<div className="view-place">
      <div>闵行区星中路 1688 号——诺宝中心酒店一楼兰晶剧场</div>
      <a className="place-map" href="http://f.amap.com/ZePN_0DA4VY1" target="_blank"/>
    </div>)
  }
}
