import { Post, CustomReduxState } from "../custom";
import { incrementBookmarkCount } from "../helpers";
import * as t from "./actionTypes";

const INITIAL_STATE: CustomReduxState = { user: {}, posts: [], favorites: [], searchResults: { posts: [], users: [] }, serverErr: "" };

interface Action {
  type: string,
  payload: any;
}

function rootReducer(state = INITIAL_STATE, action: Action) {
  switch (action.type) {
    case t.UPDATE_CUSTOMER_ID:
      return { ...state, user: { ...state.user, customer_id: action.payload.customer.id } };
    case t.UPDATE_SUBSCRIPTION_ID:
      return { ...state, user: { ...state.user, subscription_id: action.payload.subscription_id } };
    case t.UPDATE_MEMBERSHIP_STATUS:
      return { ...state, user: { ...state.user, membership_status: action.payload.membership_status } };
    case t.LOAD_USER:
      return { ...state, user: action.payload.user };
    case t.LOAD_POSTS:
      return { ...state, posts: [...action.payload.posts] };
    case t.CLEAR_POSTS:
      return { ...state, posts: [] };
    case t.LOAD_FAVORITES:
      return { ...state, favorites: [...action.payload.favorites] };
    case t.LOAD_SEARCH_RESULTS:
      return { ...state, searchResults: action.payload }
    case t.ADD_FAVORITE:
      let updatedPostBookmark = action.payload.post;
      const updateAddFavPosts = state.posts.map((p: Post) => {
        // Increment the favorite count of the post in posts state
        if (p.id === action.payload.post.id) {
          const updatedP = incrementBookmarkCount(p);
          return updatedP;
        }
        return p;
      });
      if (state.posts.length !== 0) {
        updatedPostBookmark = incrementBookmarkCount(action.payload.post);
      }
      return { ...state, posts: updateAddFavPosts, favorites: [...state.favorites, updatedPostBookmark] };
    case t.DELETE_FAVORITE:
      // delete the post from the state's favorites
      let filteredFavorites = state.favorites.filter((f: Post) => {
        return f.id !== action.payload.postId;
      });
      // Decrement the favorite count of the posts
      const updateDelFavPosts = state.posts.map((p: Post) => {
        if (p.id === action.payload.postId) {
          const newFavCount = parseInt(p.bookmark_count) - 1;
          p.bookmark_count = newFavCount.toString();
        }
        return p;
      });
      return { ...state, posts: updateDelFavPosts, favorites: filteredFavorites };
    case t.DELETE_POST:
      let filteredPosts = state.posts.filter((p: Post) => {
        return p.id !== action.payload.postId;
      });
      let newFavorites = state.favorites.filter((f: Post) => {
        return f.id !== action.payload.postId;
      });
      return { ...state, posts: filteredPosts, favorites: newFavorites };
    case t.UPDATE_POST:
      const updatedPost = action.payload.post;
      const updatedPostList = state.posts.map((p: Post) => {
        if (p.id === updatedPost.id) {
          return { ...p, ...updatedPost };
        }
        return p;
      })
      return { ...state, posts: updatedPostList }
    case t.UPDATE_USER_STATUS:
      const updatedUser = action.payload.user;
      const stringifiedUser = JSON.stringify(state.user);
      const copyOfUpdatedUser = JSON.parse(stringifiedUser);
      const newUserInfo = {
        ...copyOfUpdatedUser, ...updatedUser
      }
      return { ...state, user: newUserInfo };
    case t.LOGOUT:
      // reset all states related to a current user.
      return { ...state, user: {}, favorites: [] };
    case t.DISPLAY_SERVER_ERR:
      return { ...state, serverErr: action.payload.err };
    case t.REMOVE_SERVER_ERR:
      return { ...state, serverErr: "" };
    default:
      return state;
  }
}




export default rootReducer;