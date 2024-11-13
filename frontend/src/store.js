import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import { sendCertificateReducer } from "./Redux/reducers";

const reducers = combineReducers({
    sendCertificates:sendCertificateReducer
});
const middleware = (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(thunk);

const store = configureStore({
  reducer: reducers,
  middleware: middleware,
});

export default store;
