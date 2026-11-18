export interface WpRendered {
  rendered: string
  protected?: boolean
}

export interface WpMediaSize {
  source_url: string
  width: number
  height: number
}

export interface WpMedia {
  source_url: string
  media_details?: {
    sizes?: Record<string, WpMediaSize>
  }
}

export interface WpPost {
  id: number
  slug: string
  date: string
  type: string
  title: WpRendered
  content: WpRendered
  excerpt: WpRendered
  featured_media: number
  _embedded?: {
    'wp:featuredmedia'?: WpMedia[]
  }
}

export type Cap = WpPost

export interface WpCategory {
  id: number
  slug: string
  name: string
  count: number
}

export interface WpPage {
  id: number
  slug: string
  title: WpRendered
  content: WpRendered
}

export interface MenuItem {
  id: number
  title: string
  url: string
  parent: number
}

export interface SiteData {
  site_name: string
  home_url: string
  front_page_id: number
  logo_url: string
  menus: {
    primary: MenuItem[]
    footer: MenuItem[]
  }
  footer: {
    name_1: string
    name_2: string
    street: string
    city: string
    post_code: string
    phone_1: string
    phone_2: string
    phone_1_tel: string
    phone_2_tel: string
    e_mail: string
  }
  covers: Record<string, { image: string; title: string }>
}
