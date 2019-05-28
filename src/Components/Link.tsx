import * as React from 'react'
import Utils from '../Utils'

interface LinkProps {
  className?: string
  to: string
  children: any
}

export default class Link extends React.Component<LinkProps, {}> {
  private onClickCallback = this.onClick.bind(this)

  private onClick() {
    Utils.switchUrl(this.props.to)
  }

  public render() {
    const className = this.props.className ? this.props.className : ''
    return (<span className={className} style={{
      cursor: 'pointer'
    }} onClick={this.onClickCallback}>{this.props.children}</span>)
  }
}
