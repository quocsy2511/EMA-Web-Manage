import { redirect } from "react-router-dom";
import jwt from "jwt-decode";
import moment from "moment";
import { HOST } from "../constants/api";

function calcExpirationTime(expTime) {
  const currentTime = moment().unix();
  return expTime - currentTime;
}

export function getAuthToken() {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const decodedToken = jwt(token);
  const expTime = decodedToken.exp;
  const remainedTime = calcExpirationTime(expTime);
  console.log("remainedTime: ", remainedTime);

  if (remainedTime < 0) return "EXPIRED";

  return decodedToken;
}

export function loginLoader() {
  const token = getAuthToken();
  console.log("loginLoader token: ", token);

  if (!token || token === "EXPIRED") return;
  if (token.role === "MANAGER") return redirect("/manager");
  if (token.role === "STAFF") return redirect("/staff");
}

export function checkAuthLoader(params) {
  const token = getAuthToken();
  // console.log("checkAuthLoader token: ", token);
  const authRole = params.request.url.split(HOST)[1].split("/")[1];

  if (!token || token === "EXPIRED") return redirect("/");
  if (token.role.toLowerCase() !== authRole)
    redirect(`/${token.role.toLowerCase()}`);

  return token;
}
