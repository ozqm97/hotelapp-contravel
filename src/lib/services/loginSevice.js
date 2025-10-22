import defaultApiClient from "../api";

export const loginAuth = async (userAgent, password) => {
  return defaultApiClient.post("/login/v1", { user :userAgent, password:password });
};

export const fetchUserData = async () => {
  return defaultApiClient.get("/login/getDataUser");
};
