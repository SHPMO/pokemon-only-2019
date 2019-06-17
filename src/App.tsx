import * as React from 'react'
import './App.css'
import Container, {ContentType} from './Components/Container'
import Rotom from './Components/Rotom'
import Utils from './Utils'


const NavNames: ContentType[] = ['schedule', 'place', 'prize', 'ticket', 'events', 'stall']

interface AppState {
  selectedContentType: ContentType | null
  gameReady: boolean
}

class App extends React.Component<{}, AppState> {
  private container: Container | null = null
  private kanbanNumber = Math.floor(Math.random() * 2)

  public state = {
    selectedContentType: null,
    gameReady: true
  }

  constructor(props: {}) {
    super(props)
    Utils.setApp(this)
  }


  public load(name: ContentType) {
    if (this.container !== null) {
      this.setState({
        selectedContentType: name
      })
      this.container.load(name)
    }
  }

  public navClick(name: ContentType) {
    return () => {
      Utils.switchUrl(`/${name}`)
    }
  }

  public hideContent() {
    if (this.state.selectedContentType !== null && this.container !== null) {
      this.container.hide()
    }
  }

  private containerClick() {
    return () => {
      Utils.switchUrl(`/`)
    }
  }

  private containerExit() {
    return () => {
      this.setState({
        selectedContentType: null
      })
      Utils.setPageTitle('首页')
      Utils.finishHiding()
    }
  }

  private gameClick() {
    return () => {
      window.open('https://www.weibo.com/3551441340/HzcZ7vvkK', '_blank')
      // window.open('https://www.getdaze.org/pmo2019/game', '_blank')
    }
  }

  public componentDidMount(): void {
    Utils.setPageTitle('首页')
    Utils.onHashChange()
  }

  public render() {
    const selected = this.state.selectedContentType
    return (
      <div className="app font-hei">
        <div className="app-background">
          <div className="fireworks"/>
          <div className="title"/>
          <div className={`kanban-erika ${this.kanbanNumber === 0 ? 'kanban-mobile' : ''}`}/>
          <div className={`kanban-misty ${this.kanbanNumber === 1 ? 'kanban-mobile' : ''}`}/>
          <div className="background-mobile"/>
          <div className={`cloud cloud-${this.kanbanNumber === 1 ? 'left' : 'right'}`}/>
        </div>
        <div className="app-navs">
          {this.state.gameReady ? <div onClick={this.gameClick()} className="nav-game">
            <div className="nav-game-start"/>
          </div> : []}
          <div className="nav-splitters"/>
          <div className="nav-links">
            {NavNames.map((navName, i) => (
              <div className={`nav-link ${selected === navName ? 'nav-link-selected' : ''}`} key={i}>
                <a onClick={this.navClick(navName)} className={`nav-${navName}`}/>
              </div>
            ))}
          </div>
        </div>
        <Rotom className="app-rotom"/>
        <div className={`container-container ${selected !== null ? '' : 'hidden-object'}`}
             onClick={this.containerClick()}/>
        <Container ref={x => this.container = x} onExit={this.containerExit()}/>
        <footer className="app-footer">Pokemon Only in Shanghai 2019</footer>
      </div>
    )
  }
}

export default App
