import * as React from 'react'

import PosterImage from '../images/rotom-loves-you.jpg'

import './Rotom.css'

const WIDTH = 720
const HEIGHT = 400
const ASSET_SCALE = 0.3715
const EQUIV_ROTATE = -0.1385
const WAVING_PERIOD = 1.0
const WAVING_PAUSE = 0.2
const WAVING_MAGNITUDE = 0.2
const SAYING_SPEED = 8
const SAYING_PAUSE = 3
const AVOIDING_PERIOD = 0.7
const AVOIDING_DISTANCES = [-200, -150]
const AVOIDING_ROTATING_CENTER = [380, 150]
const AVOIDING_ANGLE = 0.5
const EYE_CLOSING_TIME = 2.5

type Vector2 = [number, number]
type Rect = [Vector2, Vector2]

const EYE_AREAS: Rect[] = [[
  [466, 247],
  [486, 276]
], [
  [528, 239],
  [546, 265]
]]
const SCREEN_AREA: Rect = [
  [459, 274],
  [561, 340]
]
const TOP_AREA: Rect = [
  [476, 131],
  [514, 207]
]
const ROTOM_AREA: Rect = [
  [335, 124],
  [659, 368]
]


const RandomSentences = [
  '我最喜欢魔都PMO了洛托，大家也喜欢吗？',
  '我可是本届PMO的金主洛托！',
  '皮卡丘有什么好看的洛托，要看就看《大侦探洛托姆》！',
  '玉虹商场夏季大促进行中！有洛托姆冰箱，洛托姆彩电，洛托姆空调，洛托姆洗衣机……为什么要让我念这个洛托？！',
  '玉虹市是个美丽的城市洛托！'
]

interface RotomProps {
  className: string
}

interface RotomState {
  sayingProgress: number
  poster: boolean
}

type RotomPartName = 'body' | 'bodyEyetouched' | 'footLeft' | 'footRight' | 'handLeft' | 'handRight'

const RotomPartOrder: RotomPartName[] = ['handLeft', 'handRight', 'footLeft', 'footRight', 'body']

interface RotomPart {
  img: HTMLImageElement
  left: number
  top: number
  width: number
  height: number
  rotate: number
  translate: Vector2
}

function clamp(x: number, min: number, max: number) {
  return x < min ? min : x > max ? max : x
}

function checkArea([x, y]: Vector2, [leftTop, rightBottom]: Rect) {
  return x >= leftTop[0] && x <= rightBottom[0] && y >= leftTop[1] && y <= rightBottom[1]
}

function drawPart(ctx: CanvasRenderingContext2D, part: RotomPart, rotated: number = 0, translated: Vector2 = [0, 0], moreRotated: number = 0) {
  ctx.save()
  ctx.translate(AVOIDING_ROTATING_CENTER[0], AVOIDING_ROTATING_CENTER[1])
  ctx.rotate(rotated)
  ctx.translate(-AVOIDING_ROTATING_CENTER[0], -AVOIDING_ROTATING_CENTER[1])
  ctx.translate(part.left + translated[0], part.top + translated[1])
  ctx.translate(part.translate[0], part.translate[1])
  ctx.rotate(part.rotate + moreRotated)
  ctx.translate(-part.translate[0], -part.translate[1])
  const w = part.width
  const h = part.height
  ctx.drawImage(part.img, 0, 0, w, h)
  ctx.restore()
}

export default class Rotom extends React.Component<RotomProps, RotomState> {
  private canvas = React.createRef<HTMLCanvasElement>()
  private ctx: CanvasRenderingContext2D
  private loaded: number = 0
  private rotom = new Map<RotomPartName, RotomPart>()
  private drawCallback = this.draw.bind(this)
  private updateSayingCallback = this.updateSaying.bind(this)
  private touchCallback = this.touch.bind(this)
  private touchStartCallback = this.touchStart.bind(this)
  private hidePosterCallback = this.hidePoster.bind(this)
  private startTime = 0
  private sayingStartTime = 0
  private toSay = ''
  private sayingSpeed = -1
  private sayingPause = -1
  private eyeTouched = 0
  private eyeClosing = -1
  private avoiding = -1
  private showingPoster = false

  public state = {
    sayingProgress: -1,
    poster: false
  }

  private loadImage(
    rotom: Map<string, RotomPart>, name: string, assetName: string, left: number, top: number,
    width: number, height: number, rotate: number = 0, translate: Vector2 = [0, 0]
  ) {
    const img = new Image()
    img.src = require('../images/' + assetName + '.png')
    img.onload = () => {
      this.loaded += 1
      if (this.loaded === 5) {
        this.start()
      }
    }
    width *= ASSET_SCALE
    height *= ASSET_SCALE
    translate[0] *= ASSET_SCALE
    translate[1] *= ASSET_SCALE
    rotom.set(name, {
      img,
      left,
      top,
      width,
      height,
      rotate,
      translate
    })
  }

  private draw() {
    const time = Date.now()
    const handRotated = clamp((Math.abs(((time - this.startTime) / 1000 % (WAVING_PERIOD * 2)) - WAVING_PERIOD) -
      (WAVING_PERIOD / 2)) * WAVING_MAGNITUDE * 2 / (WAVING_PERIOD - WAVING_PAUSE), -WAVING_MAGNITUDE, WAVING_MAGNITUDE)
    this.ctx.clearRect(0, 0, WIDTH, HEIGHT)
    let translated: Vector2 = [0, 0]
    let bodyRotated = 0
    if (this.avoiding >= 0) {
      const elapsed = (time - this.avoiding) / 1000
      if (elapsed > AVOIDING_PERIOD) {
        this.say('哼，一样的招数不会成功两次洛托！')
        this.avoiding = -1
      } else {
        const s = Math.sin(Math.PI / AVOIDING_PERIOD * elapsed)
        translated = [AVOIDING_DISTANCES[0] * s, AVOIDING_DISTANCES[1] * s]
        bodyRotated = AVOIDING_ANGLE * s
      }
    }
    if (this.eyeClosing >= 0) {
      const elapsed = (time - this.eyeClosing) / 1000
      if (elapsed > EYE_CLOSING_TIME) {
        this.eyeClosing = -1
      }
    }
    for (const partName of RotomPartOrder) {
      const rotated = partName === 'handLeft' ? handRotated : partName === 'handRight' ? -handRotated : 0
      const drawPartName = partName === 'body' && this.eyeClosing >= 0 ? 'bodyEyetouched' : partName
      const part = this.rotom.get(drawPartName)
      if (part !== undefined) {
        drawPart(
          this.ctx, part,
          bodyRotated,
          translated,
          rotated
        )
      }
    }
    requestAnimationFrame(this.drawCallback)
  }

  private start() {
    if (this.canvas.current === null) {
      return
    }
    const ctx = this.canvas.current.getContext('2d')
    if (ctx === null) {
      return
    }
    this.ctx = ctx
    this.startTime = Date.now()
    this.draw()
    this.waitRandomlyTalk()
  }

  private updateSaying() {
    const time = (Date.now() - this.sayingStartTime) / 1000
    const progress = time * SAYING_SPEED
    const sayingProgress = Math.floor(progress)
    if (sayingProgress > this.toSay.length) {
      if (time - this.toSay.length / this.sayingSpeed >= this.sayingPause) {
        this.endSaying()
        this.waitRandomlyTalk()
        return
      }
    } else {
      this.setState({
        sayingProgress
      })
    }
    requestAnimationFrame(this.updateSayingCallback)
  }

  private say(toSay: string, speed: number = SAYING_SPEED, pause: number = SAYING_PAUSE) {
    if (this.showingPoster) {
      return
    }
    this.toSay = toSay
    this.sayingSpeed = speed
    this.sayingPause = pause
    this.sayingStartTime = Date.now()
    this.updateSaying()
  }

  private endSaying() {
    this.toSay = ''
    this.sayingSpeed = -1
    this.sayingPause = -1
    this.sayingStartTime = 0
    this.setState({
      sayingProgress: -1
    })
    if (this.showingPoster) {
      this.showingPoster = false
      this.setState({
        poster: true
      })
    }
  }

  private hidePoster() {
    this.setState({
      poster: false
    })
  }

  public randomlyTalk() {
    const toSay = RandomSentences[Math.floor(Math.random() * RandomSentences.length)]
    this.say(toSay)
  }

  private waitRandomlyTalk() {
    setTimeout(() => {
      if (this.state.sayingProgress < 0) {
        this.randomlyTalk()
      }
    }, Math.random() * 2500 + 3000)
  }

  private startAvoiding() {
    this.endSaying()
    this.avoiding = Date.now()
  }

  private closeEye() {
    this.eyeClosing = Date.now()
  }

  private touchStart(e: TouchEvent) {
    const {clientX, clientY} = e.touches[0]
    this.touch(new MouseEvent('mousedown', {
      clientX,
      clientY
    }))
  }

  private touch(e: MouseEvent) {
    if (this.canvas.current === null) {
      return
    }
    const canvas = this.canvas.current
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / canvas.clientWidth * canvas.width
    const y = (e.clientY - rect.top) / canvas.clientHeight * canvas.height
    // tslint:disable-next-line:no-console
    console.log([x, y])
    for (const eyeArea of EYE_AREAS) {
      if (checkArea([x, y], eyeArea)) {
        // touch eyes.
        switch (this.eyeTouched) {
          case 0: {
            this.closeEye()
            this.say('啊！！！！')
            break
          }
          case 1: {
            this.startAvoiding()
            break
          }
          default: {
            this.closeEye()
            this.say('太过分了，太过分了洛托！我要让魔都PMO的人抓住你洛托！')
          }
        }
        this.eyeTouched += 1
        return
      }
    }
    if (checkArea([x, y], SCREEN_AREA)) {
      this.say('欢迎加入洛托姆是宇宙的中心俱乐部！', SAYING_SPEED, 1)
      this.showingPoster = true
    } else if (checkArea([x, y], TOP_AREA)) {
      this.say('侦探的标志不是帽子而是金色长发洛托！')
    } else if (checkArea([x, y], ROTOM_AREA)) {
      this.randomlyTalk()
    }
  }

  private init() {
    this.loadImage(this.rotom, 'body', 'rotom-body', 380, 129, 584, 689, EQUIV_ROTATE)
    this.loadImage(this.rotom, 'bodyEyetouched', 'rotom-body-eyetouched', 380, 129, 584, 689, EQUIV_ROTATE)
    // loadImage(this.rotom, 'eyeLeft', 'rotom-eye-left', 262, 154, 49, 71, 24.5, 35.5)
    // loadImage(this.rotom, 'eyeLeftClose', 'rotom-eye-left-close', 262, 154, 49, 71, 24.5, 35.5)
    // loadImage(this.rotom, 'eyeRight', 'rotom-eye-right', 390, 154, 49, 71, 24.5, 35.5)
    // loadImage(this.rotom, 'eyeRightClose', 'rotom-eye-right-close', 390, 154, 49, 71, 24.5, 35.5)
    this.loadImage(this.rotom, 'footLeft', 'rotom-foot-left', 480, 352, 71, 121, EQUIV_ROTATE)
    this.loadImage(this.rotom, 'footRight', 'rotom-foot-right', 531, 346, 71, 121, EQUIV_ROTATE)
    this.loadImage(this.rotom, 'handLeft', 'rotom-hand-left', 312, 254, 412, 260, EQUIV_ROTATE, [408, 190])
    this.loadImage(this.rotom, 'handRight', 'rotom-hand-right', 566, 239, 412, 262, EQUIV_ROTATE, [4, 190])
  }

  public componentDidMount(): void {
    this.init()
  }

  public render() {
    const containerClass = this.props.className ? this.props.className : ''
    return (<div className={`${containerClass} rotom-container`}>
      {this.state.sayingProgress < 0 ? [] :
        <div className="rotom-dialog">
          {this.toSay.substr(0, this.state.sayingProgress)}
        </div>}
      <canvas className="rotom-canvas" width={WIDTH} height={HEIGHT} ref={this.canvas}
              onMouseDown={this.touchCallback} onTouchStart={this.touchStartCallback}>
        A Rotom here
      </canvas>
      {this.state.poster ?
        <div className="image-preview" onClick={this.hidePosterCallback}>
          <img src={PosterImage}/>
        </div> : []}
    </div>)
  }
}
