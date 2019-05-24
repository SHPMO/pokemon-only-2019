import * as React from 'react'
import './App.css'
import Container, {ContentType} from './Container'


const NavNames: ContentType[] = ['schedule', 'place', 'prize', 'ticket', 'events', 'stall']

interface AppState {
  selectedContentType: ContentType | null
}

class App extends React.Component<{}, AppState> {
  private container: Container | null = null

  public state = {
    selectedContentType: null
  }

  public navClick(name: ContentType) {
    return () => {
      if (this.container !== null) {
        this.setState({
          selectedContentType: name
        })
        this.container.prepareLoad(name)
      }
    }
  }

  private containerClick() {
    return () => {
      if (this.state.selectedContentType !== null && this.container !== null) {
        this.container.hide()
      }
    }
  }

  private containerExit() {
    return () => {
      this.setState({
        selectedContentType: null
      })
    }
  }

  private gameClick() {
    return () => {
      window.open('/', '_blank')
    }
  }

  public render() {
    const selected = this.state.selectedContentType
    return (
      <div className="app">
        <div className="app-background">
          <div className="fireworks"/>
          <div className="title"/>
          <div className="kanban-erika"/>
          <div className="kanban-misty"/>
        </div>
        <div className="app-navs">
          <div onClick={this.gameClick()} className="nav-game">
            <div className="nav-game-start" />
          </div>
          <div className="nav-splitters"/>
          <div className="nav-links">
            {NavNames.map((navName, i) => (
              <div className={`nav-link ${selected === navName ? 'nav-link-selected' : ''}`} key={i}>
                <a onClick={this.navClick(navName)} className={`nav-${navName}`}/>
              </div>
            ))}
          </div>
        </div>
        <div className={`container-container ${selected !== null ? '' : 'hidden-object'}`}
             onClick={this.containerClick()}/>
        <Container ref={x => this.container = x} onExit={this.containerExit()}/>
        <footer className="app-footer">Pokemon Only in Shanghai 2019</footer>
      </div>
    )
  }
}

export default App
