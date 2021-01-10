import { Post, CustomReduxState } from "../custom";
import { ADD_FAVORITE, DELETE_FAVORITE, LOAD_FAVORITES, LOAD_POSTS, LOAD_USER, LOGOUT } from "./actionTypes";

const INITIAL_STATE: CustomReduxState = { user: {}, posts: [], favorites: [] };

interface Action {
  type: string,
  payload: any;
}

function rootReducer(state = INITIAL_STATE, action: Action) {
  switch (action.type) {
    case LOAD_USER:
      return { ...state, user: action.payload.user };
    case LOAD_POSTS:
      return { ...state, posts: action.payload.posts };
    case LOAD_FAVORITES:
      return { ...state, favorites: action.payload.favorites };
    case ADD_FAVORITE:
      // Increment the favorite count of the posts
      const updateAddFavPosts = state.posts.map((p: Post) => {
        if (p.id === action.payload.post.id) {
          const newFavCount = parseInt(p.favorite_count) + 1;
          p.favorite_count = newFavCount.toString();
        }
        return p;
      });
      return { ...state, posts: updateAddFavPosts, favorites: [...state.favorites, action.payload.post] };
    case DELETE_FAVORITE:
      // delete the post from the state's favorites
      let filteredFavorites = state.favorites.filter((f: any) => {
        return f.id !== action.payload.postId;
      });

      // Decrement the favorite count of the posts
      const updateDelFavPosts = state.posts.map((p: Post) => {
        if (p.id === action.payload.postId) {
          const newFavCount = parseInt(p.favorite_count) - 1;
          p.favorite_count = newFavCount.toString();
        }
        return p;
      });
      return { ...state, posts: updateDelFavPosts, favorites: filteredFavorites };
    case LOGOUT:
      return { ...state, user: {}, favorites: [] };
    default:
      return state;
  }
}


export default rootReducer;