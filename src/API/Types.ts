export interface Seller {
  circle_description: string
  circle_image: string
  circle_name: string
  id: number
  items: number[]
  seller_id: string
}

export interface Item {
  authors: string
  circle: string
  content: string
  cover_image: string | null
  forto: string
  introduction: string
  is_restricted: string
  is_started_with: boolean
  item_id: number
  item_pictures: string[]
  item_type: string
  name: string
  price: number
  seller_id: number
  url: string
}
