import { redirect } from "react-router-dom";
import jwt from "jwt-decode";
import moment from "moment";
import { HOST } from "../constants/api";
import TEXT from "../constants/string";

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

  if (remainedTime < 0) {
    localStorage.removeItem("token");
    return "EXPIRED";
  }

  return decodedToken;
}

export function loginLoader() {
  const token = getAuthToken();

  if (!token || token === "EXPIRED") return null;
  else if (token.role === TEXT.MANAGER) return redirect("/manager");
  else if (token.role === TEXT.STAFF) return redirect("/staff");
  else if (token.role === TEXT.ADMINISTRATOR) return redirect("/administrator");

  return null;
}

export function checkAuthLoader(params) {
  const token = getAuthToken();

  const pathRole = params.request.url.split(HOST)[1].split("/")[1];
  const role =
    token.role === TEXT.MANAGER
      ? "manager"
      : token.role === TEXT.STAFF
      ? "staff"
      : "administrator";

  if (!token || token === "EXPIRED") return redirect("/");
  if (role !== pathRole) return redirect(`/${token.role.toLowerCase()}`);

  return token;
}
