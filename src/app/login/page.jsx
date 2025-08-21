"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import LoginForm from "./loginPage";
import Script from "next/script";

export default function LoginPage() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_V3_KEY}>
      <LoginForm />
              {/* Script oficial de reCAPTCHA v2 */}
        <Script
          src={`https://www.google.com/recaptcha/api.js`}
          strategy="afterInteractive"
        />
    </GoogleReCaptchaProvider>
  );
}