import * as React from 'react'

import {Transition} from 'react-transition-group'

import Link from './Components/Link'
import './Container.css'

import Events from './Views/Events'
import Place from './Views/Place'
import Prize from './Views/Prize'
import Schedule from './Views/Schedule'
import Stall from './Views/Stall'
import Ticket from './Views/Ticket'


export type ContentType = 'schedule' | 'place' | 'prize' | 'ticket' | 'events' | 'stall'

interface ContainerProps {
  onExit?: () => void
}

interface ContainerState {
  onLeft: boolean
  in: boolean
  contentType: ContentType | null
  title: string
}

const TransitionDuration = 800

const TransitionStyle = {
  transition: `all ${TransitionDuration}ms ease-in-out`
}

export default class Container extends React.Component<ContainerProps, ContainerState> {
  private waitForSwitch = false

  public state: ContainerState = {
    onLeft: true,
    in: false,
    contentType: null,
    title: ''
  }

  constructor(props: Readonly<ContainerProps>) {
    super(props)
  }

  private static getTitle(contentType: ContentType): string {
    switch (contentType) {
      case 'schedule':
        return '当日行程'
      case 'place':
        return '场地信息'
      case 'prize':
        return '奖品一览'
      case 'ticket':
        return '票务信息'
      case 'events':
        return '现场活动'
      case 'stall':
        return '现场摊位'
      default:
        return ''
    }
  }

  public load(contentType: ContentType) {
    const onLeft = contentType === 'ticket' || contentType === 'events' || contentType === 'stall'
    this.waitForSwitch = true
    const title = Container.getTitle(contentType)
    this.setState({
      onLeft,
      contentType,
      title
    })
  }

  public doLoad() {
    this.setState({
      in: true
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
    if (this.waitForSwitch) {
      this.waitForSwitch = false
      setTimeout(() => {
        this.doLoad()
      }, 200)
    }
  }

  public render() {
    const className = `container-${this.state.onLeft ? 'left' : 'right'}`
    const title = this.state.title.split('')
    if (title.length !== 4) {
      return []
    }
    return (<Transition timeout={TransitionDuration} in={this.state.in} onExited={this.exited()}>
      {state => (<div
        className={`app-container ${className} ${className}-${state}`}
        style={TransitionStyle}>
        <div className="container-border">
          <div className="container-close"><Link to="/">×</Link></div>
          {title.map((c, i) => (<div key={i} className="container-title">{c}</div>))}
        </div>
        <div className="container-content">
        {((t: ContentType | null) => {
          switch (t) {
            case 'schedule':
              return <Schedule/>
            case 'place':
              return <Place/>
            case 'prize':
              return <Prize/>
            case 'ticket':
              return <Ticket/>
            case 'events':
              return <Events/>
            case 'stall':
              return <Stall/>
          }
          return []
        })(this.state.contentType)}
        </div>
      </div>)}
    </Transition>)
  }
}
