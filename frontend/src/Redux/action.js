import axios from "axios";
import {
  SEND_CERTIFICATE_MAIL_FAIL,
  SEND_CERTIFICATE_MAIL_REQUEST,
  SEND_CERTIFICATE_MAIL_SUCCESS,
  CLEAR_ERRORS
} from "./constants";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_LINK,
});

export const sendCertificates = (certificateData) => async(dispatch) => {
  try {
    dispatch({ type: SEND_CERTIFICATE_MAIL_REQUEST });
    const { data } = await api.post("/send-mail-with-certificate", certificateData);
    dispatch({
      type: SEND_CERTIFICATE_MAIL_SUCCESS,
      payload: data.generatedData,
    });
  } catch (error) {
    dispatch({
      type: SEND_CERTIFICATE_MAIL_FAIL,
      payload: error.response.data.message,
    });
  }
};
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
