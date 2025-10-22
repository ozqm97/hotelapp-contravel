import defaultApiClient from "../api"

export const validateRecaptchaV3 = async (token) => {
  return defaultApiClient.post("/recaptcha/validate-recaptcha", { token });
}

export const validateRecaptchaV2 = async (token) => {
  return defaultApiClient.post("/recaptcha/validate-recaptcha-v2", { token });
}