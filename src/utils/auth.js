import { redirect } from "react-router-dom";
import jwt from "jwt-decode";
import moment from "moment";
import { HOST } from "../constants/api";

function calcExpirationTime(expTime) {
  const currentTime = Number(moment().format("YYYYMMDDHHMMss"));
  return currentTime - expTime;
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

  if (!token) return null;
  if (token.role === "MANAGER") return redirect("/manager");
  if (token.role === "STAFF") return redirect("/staff");
}

export function checkAuthLoader(params) {
  const token = getAuthToken();
  const authRole = params.request.url.split(HOST)[1].split("/")[1];

  if (!token || token === "EXPIRED") return redirect("/");
  if (token.role.toLowerCase() !== authRole)
    return redirect(`/${token.role.toLowerCase()}`);

  return token;
}
