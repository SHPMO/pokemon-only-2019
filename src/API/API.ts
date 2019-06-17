import icon from '../images/icon.png'
import Cache from './Cache'

import {Item, Seller} from './Types'

const PMO = 'pmo2019'

export interface APIError {
  error: number
  message: string
}

export interface ModelArray<T> {
  [id: string]: T
}

class API {
  public static async getItem(itemId: string, force: boolean): Promise<Item> {
    if (!force && itemId in Cache.items) {
      return Cache.items[itemId]
    }
    const item = await API.requestStallAPI<Item>('get_item', {item_id: itemId})
    Cache.items[itemId] = item
    return item
  }

  public static async getItems(sellerId: string | null, force: boolean): Promise<ModelArray<Item>> {
    if (!force) {
      if (sellerId === null && Cache.itemsFetched) {
        return Cache.items
      } else if (sellerId !== null && sellerId in Cache.itemSellers) {
        const itemIds = Cache.itemSellers[sellerId]
        const t = {}
        itemIds.forEach((itemId: string) => t[itemId] = Cache.items[itemId])
        return t
      }
    }
    const data = sellerId === null ? null : {seller_id: sellerId}
    const items = await API.requestStallAPI<ModelArray<Item>>('get_item', data)
    for (const each in items) {
      if (isNaN(Number(each))) {
        continue
      }
      Cache.items[each] = items[each]
    }
    if (data === null) {
      Cache.itemsFetched = true
    } else {
      Cache.itemSellers[data.seller_id] = Object.keys(items)
    }
    return items
  }

  public static async getSeller(sellerId: string, force: boolean): Promise<Seller> {
    if (!force && sellerId in Cache.sellers) {
      return Cache.sellers[sellerId]
    }
    const seller = await API.requestStallAPI<Seller>('get_seller', {seller_id: sellerId})
    Cache.sellers[sellerId] = seller
    return seller
  }

  public static async getSellers(force: boolean): Promise<ModelArray<Seller>> {
    if (!force && Cache.sellersFetched) {
      return Cache.sellers
    }
    const sellers = await API.requestStallAPI<ModelArray<Seller>>('get_seller')
    Cache.sellers = sellers
    Cache.sellersFetched = true
    return sellers
  }

  public static async requestStallAPI<T>(apiName: string, data?: any): Promise<T> {
    let url = 'https://www.getdaze.org/stall/api/' + apiName + '/'
    if (!data) {
      data = {}
    }
    data.pmo = PMO
    url += '?' + Object.keys(data)
      .map(key => key + '=' + encodeURIComponent(data[key]))
      .join('&')
    return new Promise<T>((resolve, reject) => {
      const req = new XMLHttpRequest()
      req.onreadystatechange = () => {
        if (req.readyState === XMLHttpRequest.DONE) {
          if (req.status === 200) {
            const response = JSON.parse(req.responseText)
            if (response.error === 0) {
              resolve(response.data as T)
            } else {
              reject(response as APIError)
            }
          } else if (req.status === 404) {
            reject({error: 404, message: 'not found'})
          } else {
            reject({error: req.status, message: '未知错误'})
          }
        }
      }
      req.open('GET', url)
      req.send()
    })
  }

  public static getImageUrl(url: string) {
    return 'https://www.getdaze.org' + url
  }

  public static getBackgroundImage(url: string | null) {
    return `url(${url ? this.getImageUrl(url) : icon})`
  }
}

export default API