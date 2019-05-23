import * as React from 'react'
import './App.css'
import Container, {ContentType} from './Container'


interface AppState {
  showContainer: boolean
}

class App extends React.Component<{}, AppState> {
  private container: Container | null = null

  public state = {
    showContainer: false
  }

  public navClick(name: ContentType) {
    return () => {
      if (this.container !== null) {
        this.setState({
          showContainer: true
        })
        this.container.load(name)
      }
    }
  }

  private containerClick() {
    return () => {
      if (this.state.showContainer && this.container !== null) {
        this.container.hide()
      }
    }
  }

  private containerExit() {
    return () => {
      this.setState({
        showContainer: false
      })
    }
  }

  public render() {
    return (
      <div className="app">
        <div className="app-background">
          <div className="fireworks"/>
          <div className="title"/>
          <div className="kanban-erika"/>
          <div className="kanban-misty"/>
        </div>
        <div className="app-navs">
          <div className="nav-splitters"/>
          <div className="nav-links">
            <div className="nav-link">
              <a onClick={this.navClick('schedule')} className="nav-schedule"/></div>
            <div className="nav-link">
              <a onClick={this.navClick('place')} className="nav-place"/>
            </div>
            <div className="nav-link">
              <a onClick={this.navClick('prize')} className="nav-prize"/>
            </div>
            <div className="nav-link">
              <a onClick={this.navClick('ticket')} className="nav-ticket"/>
            </div>
            <div className="nav-link">
              <a onClick={this.navClick('events')} className="nav-events"/>
            </div>
            <div className="nav-link">
              <a onClick={this.navClick('stall')} className="nav-stall"/>
            </div>
          </div>
        </div>
        <div className={`container-container ${this.state.showContainer ? '' : 'hidden-object'}`}
             onClick={this.containerClick()}/>
        <Container ref={x => this.container = x} onExit={this.containerExit()}/>
        <footer className="app-footer">Pokemon Only in Shanghai 2019</footer>
      </div>
    )
  }
}

export default App
