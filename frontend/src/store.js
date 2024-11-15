import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import { appPasswordAuthenticationReducer, sendMailsReducer } from "./Redux/reducers";

const reducers = combineReducers({
    mailStatus:sendMailsReducer,
    authenticateUser:appPasswordAuthenticationReducer
});
const middleware = (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(thunk);

const store = configureStore({
  reducer: reducers,
  middleware: middleware,
});

export default store;
