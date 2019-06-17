import {ModelArray} from './API'
import {Item, Seller} from './Types'

class Cache {
  public sellers: ModelArray<Seller> = {}
  public sellersFetched: boolean = false
  public items: ModelArray<Item> = {}
  public itemsFetched: boolean = false
  public itemSellers: ModelArray<string[]> = {}
}

export default new Cache()
