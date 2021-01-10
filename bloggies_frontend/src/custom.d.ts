export interface Comment {
  id: number,
  body: string,
  author_id: number,
  author_name: string,
  created_at: Date,
  is_reply: Boolean,
  reply_count: number,
  post_id: number
}

export interface Post {
  id: number,
  title: string,
  description: string,
  body: string,
  author_id: number,
  author_name: string,
  created_at: Date,
  last_updated_at: Date,
  favorite_count: string
}

export interface PostFormData {
  title: string,
  description: string,
  body: string
}

export interface CustomReduxState {
  user: any,
  posts: Array<Post>,
  favorites: Array<Post>
}