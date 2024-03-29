import * as React from 'react'

import Link from '../Components/Link'
import Utils from '../Utils'
import './Schedule.css'


export default class Schedule extends React.Component {
  public componentDidMount(): void {
    Utils.setPageTitle('当日行程')
  }

  public render() {
    return (<div className="view-schedule">
      <h2>基本信息</h2>
      <table className="schedule-table">
        <tbody>
        <tr>
          <td>主题</td>
          <td>/</td>
          <td>2019 玉虹夏日祭</td>
        </tr>
        <tr>
          <td>主办方</td>
          <td>/</td>
          <td>玉虹夏日祭委员会</td>
        </tr>
        <tr>
          <td>时间</td>
          <td>/</td>
          <td>2019 年 8 月 17 日（周六）</td>
        </tr>
        <tr>
          <td/>
          <td/>
          <td>09:31 ~ 16:30</td>
        </tr>
        <tr>
          <td>地点</td>
          <td>/</td>
          <td><Link to="/place">
            闵行区星中路 1688 号
          </Link></td>
        </tr>
        <tr>
          <td/>
          <td/>
          <td><Link to="/place">
            诺宝中心酒店一楼兰晶剧场
          </Link></td>
        </tr>
        </tbody>
      </table>
      <h2>主要内容</h2>
      <ul className="schedule-list">
        <li>精灵宝可梦系列相关同人物贩售</li>
        <li>舞台区表演 & 互动游戏</li>
        <li>联机对战</li>
        <li>场地活动</li>
      </ul>
      <h2>行程安排</h2>
      <table className="schedule-table">
        <tbody>
        <tr>
          <td>09:31</td>
          <td>开场（10:30 前不可出场）</td>
        </tr>
        <tr>
          <td>10:00</td>
          <td>战斗区活动开始</td>
        </tr>
        <tr>
          <td>11:30</td>
          <td>舞台表演活动开始</td>
        </tr>
        <tr>
          <td>15:30</td>
          <td>抽奖环节</td>
        </tr>
        <tr>
          <td>16:30</td>
          <td>闭场</td>
        </tr>
        </tbody>
      </table>
    </div>)
  }
}
