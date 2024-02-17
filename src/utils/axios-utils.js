import axios from "axios";
import { URL } from "../constants/api";

const http = axios.create({ baseURL: URL });

// Do something before request is sent
http.interceptors.request.use(
  function (request) {
    // Authorization if token existed
    if (localStorage.getItem("token"))
      request.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;

    // Set request timeout
    request.timeout = 8000;

    return request;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Custom response
http.interceptors.response.use(
  function (response) {
    let expectedResponse;

    if (!localStorage.getItem("token"))
      expectedResponse = response.data; // Perform a normal request
    else expectedResponse = response.data.result; // Perform a request with authentication

    return expectedResponse;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default http;
