import { redirect } from "react-router-dom";
import jwt from "jwt-decode";

// export function login(token) {
//   localStorage.setItem("token", token);
// }

// export function logout() {
//   localStorage.removeItem("token");
//   return redirect("/manager");
// }

function calcExpirationTime(decodedToken) {
  //   const expirationTime =
  const now = new Date();
  // const remainedTime =

  //   return remainedTime;
}

export function getAuthToken() {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const decodedToken = jwt(token);

  const remainedTime = calcExpirationTime(decodedToken);

  if (remainedTime < 0) return "EXPIRED";

  return decodedToken;
}

export function tokenLoader() {
  console.log("Loaderr");

  return null;
}

export function loginLoader() {
  const token = getAuthToken();

  if (token.role === "MANAGER") return redirect("/manager");
  if (token.role === "STAFF") return redirect("/staff");

  return null;
}

export function checkAuthLoader() {
  const token = getAuthToken();

  if (!token) return redirect("/");
  if (token === "EXPIRED") return redirect("/");

  // if (token.role === "MANAGER") redirect("manager-task");

  return token;
}
