import {
    SEND_CERTIFICATE_MAIL_FAIL,
    SEND_CERTIFICATE_MAIL_REQUEST,
    SEND_CERTIFICATE_MAIL_SUCCESS,
    CLEAR_ERRORS
  } from "./constants";
  
  export const sendCertificateReducer = (state = {responseTable:null}, action) => {
      switch (action.type) {
  
        case SEND_CERTIFICATE_MAIL_REQUEST:
          return {
            loading: true,
          };
          case SEND_CERTIFICATE_MAIL_SUCCESS:
          return {
            ...state,
            loading: false,
            responseTable: action.payload,
          };
        
        case SEND_CERTIFICATE_MAIL_FAIL:
          return {
            ...state,
            loading: false,
            responseTable: null,
            error: action.payload,
          };
        case CLEAR_ERRORS:
          return {
            ...state,
            error: null,
          };
        default:
          return state;
      }
    };