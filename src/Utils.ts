import App from './App'
import {ContentType} from './Container'

class UtilsClass {
  constructor() {
    window.onhashchange = this.onHashChange.bind(this)
  }

  public onHashChange() {
    if (this.app && this.currentUrl !== window.location.hash) {
      Utils.switchUrl(window.location.hash)
    }
  }

  private app?: App

  public setApp(app: App) {
    this.app = app
  }

  private currentUrl: string = ''
  private toSwitch: string = ''
  public contentType: ContentType | null = null
  public subUrl: string = ''

  public switchUrl(url: string) {
    const m = url.match(/^#?\/(.*?)(\/.*)?$/)
    if (m === null || m[1].length === 0) {
      this.contentType = null
      this.subUrl = ''
    } else {
      this.contentType = m[1] as ContentType
      this.subUrl = m[2]
    }
    this.toSwitch = url
    const currentType = this.app!.state.selectedContentType
    if (currentType !== null && currentType !== this.contentType) {
      this.app!.hideContent()
    } else {
      this.doSwitch()
    }
  }

  private doSwitch() {
    this.currentUrl = this.toSwitch
    if (!this.currentUrl.startsWith('#')) {
      this.currentUrl = '#' + this.currentUrl
    }
    window.location.hash = this.currentUrl
    this.toSwitch = ''
    if (this.contentType !== null) {
      this.app!.load(this.contentType)
    }
  }

  public finishHiding() {
    this.doSwitch()
  }

  public setPageTitle(name: string) {
    document.title = `${name} - 玉虹夏日祭`
  }
}

const Utils = new UtilsClass()

export default Utils
