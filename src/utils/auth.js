import { redirect } from "react-router-dom";
import jwt from "jwt-decode";

export function login(token) {
  localStorage.setItem("token", token);
}

export function logout() {
  localStorage.removeItem("token");
}

function calcExpirationTime(token) {
  const decode = jwt(token);
  //   const expirationTime =
  const now = new Date();
  // const remainedTime =

  //   return remainedTime;
}

export function getAuthToken() {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const remainedTime = calcExpirationTime(token);

  if (remainedTime < 0) return "EXPIRED";

  return token;
}

// export function tokenLoader() {
//   return getAuthToken();
// }

export function checkAuthLoader() {
  const token = getAuthToken();

  if (!token) return redirect("/login");
  if (token === "EXPIRED") return redirect("/login");

  return token;
}
