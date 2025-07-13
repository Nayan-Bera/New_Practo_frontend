import { combineReducers } from "redux";
import loaderReducer from "./loader";
import userReducer from "./user";
import alertReducer from "./alert";
import examReducer from "./exam";
import { baseApi } from '../services/baseApi';

const rootReducer = combineReducers({
  loader: loaderReducer,
  user: userReducer,
  alert: alertReducer,
  exam: examReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer; 