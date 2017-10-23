import { combineReducers } from "redux";

import BookSearch from "../views/BookSearchRedux.js";
import UserCenter from "../components/Frame/UserCenterRedux.js";

export default combineReducers({
  BookSearch,
  UserCenter,
});