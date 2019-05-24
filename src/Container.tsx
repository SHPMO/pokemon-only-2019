import * as React from 'react'

import {Transition} from 'react-transition-group'

import './Container.css'


export type ContentType = 'schedule' | 'place' | 'prize' | 'ticket' | 'events' | 'stall'

interface ContainerProps {
  onExit?: () => void
}

interface ContainerState {
  onLeft: boolean
  in: boolean
  contentType: ContentType | null
}

const TransitionDuration = 800

const TransitionStyle = {
  transition: `all ${TransitionDuration}ms ease-in-out`
}

export default class Container extends React.Component<ContainerProps, ContainerState> {
  private waitForSwitch: ContentType | null = null

  constructor(props: Readonly<ContainerProps>) {
    super(props)
    this.state = {
      onLeft: true,
      in: false,
      contentType: null
    }
  }

  public prepareLoad(contentType: ContentType) {
    const onLeft = contentType === 'ticket' || contentType === 'events' || contentType === 'stall'
    this.waitForSwitch = contentType
    this.setState({
      onLeft
    })
  }

  public load(contentType: ContentType) {
    this.setState({
      in: true,
      contentType
    })
  }

  public hide() {
    this.setState({
      in: false
    })
  }

  public exited() {
    return () => {
      if (this.props.onExit) {
        this.props.onExit()
      }
    }
  }

  public componentDidUpdate(): void {
    // tslint:disable-next-line:no-console
    console.log(this.waitForSwitch)
    if (this.waitForSwitch !== null) {
      const t = this.waitForSwitch
      this.waitForSwitch = null
      setTimeout(() => {
        this.load(t)
      }, 200)
    }
  }

  public render() {
    return (
      <Transition timeout={TransitionDuration} in={this.state.in} onExited={this.exited()}>
        {state => (<div
          className={`app-container container-${this.state.onLeft ? 'left' : 'right'}-${state}`}
          style={TransitionStyle}>
          {this.state.contentType}
        </div>)}
      </Transition>
    )
  }
}
