"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function LoginForm() {
  const [showRecaptchaV2, setShowRecaptchaV2] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const { executeRecaptcha } = useGoogleReCaptcha();

useEffect(() => {
  if (typeof window !== "undefined") {
    // Define el callback global siempre, no sólo cuando showRecaptchaV2 cambia
    window.onRecaptchaV2Success = function (token) {
      console.log("Token reCAPTCHA v2:", token);
      handleLoginWithV2(token);
    };
  }

  if (showRecaptchaV2) {
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }
}, [showRecaptchaV2]);



  const handleLoginWithV2 = async (v2Token) => {
    // Enviar token v2 al backend
    console.log(v2Token)
    const res = await fetch("http://localhost:8000/api/validate-recaptcha-v2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: v2Token }),
    });
    const data = await res.json();
    console.log(data);
    if (!data.success) {
      setMensaje("No se pudo validar reCAPTCHA v2 ❌");
      return;
    }

    // Validación de usuario
    if (email === "admin@example.com" && password === "123456") {
      setMensaje("Inicio de sesión exitoso ✅");
    } else {
      setMensaje("Credenciales incorrectas ❌");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!executeRecaptcha) {
      setMensaje("reCAPTCHA aún no cargado ❌");
      return;
    }

    // Ejecutar reCAPTCHA v3
    const token = await executeRecaptcha("login_form_submit");

    // Enviar token al backend
    const res = await fetch("http://localhost:8000/api/validate-recaptcha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const data = await res.json();
    console.log("reCAPTCHA v3 response:", data);

    if (!data.success) {
      if (data.status === "recaptcha_v2_required") {
        setShowRecaptchaV2(true); // activar v2
        return;
      } else {
        setMensaje("No se pudo validar reCAPTCHA v3 ❌");
        return;
      }
    }

    // Validación de usuario
    if (email === "admin@example.com" && password === "123456") {
      setMensaje("Inicio de sesión exitoso ✅");
    } else {
      setMensaje("Credenciales incorrectas ❌");
    }
  };
  return (
    <>
      <div className="login-container">
        <div className="logo">
          <Image
            src="/images/logo_contravel_white.png"
            alt="Logo"
            width={250}
            height={0}
            priority
          />
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="login-title">Iniciar Sesión</h2>

          <label className="login-label">Nombre de Usuario</label>
          <input
            type="email"
            placeholder="Ingresa Usuario"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />

          <label className="login-label">Contraseña</label>
          <input
            type="password"
            placeholder="Ingresa Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          {showRecaptchaV2 && (
            <div>
              {/* reCAPTCHA v2 checkbox */}
              <div
                className="g-recaptcha"
                data-sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_V2_KEY}
                data-callback="onRecaptchaV2Success"
              ></div>
            </div>
          )}
          <button type="submit" className="login-button">
            Entrar
          </button>

          {mensaje && <p className="login-message">{mensaje}</p>}
        </form>
      </div>

      <style jsx>{`
        .login-container {
          height: 100dvh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: linear-gradient(to bottom right, #0170ab 30%, #fff);
          padding: 20px;
          overflow: hidden;
        }

        .logo {
          margin-bottom: 3em;
        }

        .login-form {
          width: 100%;
          max-width: 340px;
          background-color: #ffffff;
          border-radius: 12px;
          padding: 1rem 2.5rem 2.5rem 2.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .login-title {
          text-align: center;
          color: #0170ab;
          font-size: 1.4rem;
          font-weight: bolder;
          font-family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif;
          margin-bottom: 1.5rem;
        }

        .login-label {
          align-self: flex-start;
          margin: 0.5rem 0.5rem 0.5rem 0;
          color: #363636;
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          font-family: BlinkMacSystemFont, -apple-system, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            Helvetica, Arial, sans-serif;
        }

        .login-input {
          font-family: BlinkMacSystemFont, -apple-system, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            Helvetica, Arial, sans-serif;
          background-color: #f8f8f8 !important;
          color: #2e2e2e !important;
          font-size: 1rem;
          padding: 0.5rem;
          margin-bottom: 1rem;
          border: 1px solid #ccc;
          border-radius: 12px !important;
          box-shadow: 0 0 6px rgba(198, 48, 65, 0.05);
          transition: border 0.3s;
          width: 100%;
        }

        .login-input:focus {
          outline: none;
          border-color: #0070f3;
        }

        .login-button {
          font-family: BlinkMacSystemFont, -apple-system, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            Helvetica, Arial, sans-serif;
          padding: 0.5em 1em;
          margin-top: 10px;
          font-size: 1rem;
          font-weight: 700;
          background-color: #0170ab;
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
        }

        .login-button:hover {
          background-color: #025b8b;
          box-shadow: 0 6px 20px rgba(23, 85, 151, 0.4), inset 0 0 0 transparent;
          transform: translateY(-1px);
        }

        .login-message {
          margin-top: 1rem;
          font-size: 0.95rem;
          color: #555;
        }

        @media (max-width: 768px) {
          .login-form {
            padding: 1.5rem;
          }
          .login-title {
            font-size: 1.6rem;
          }
        }

        @media (max-width: 480px) {
          .logo {
            width: 200px;
          }
          .login-form {
            padding: 2.5rem;
          }
          .login-title {
            font-size: 1.5rem;
          }
        }

        @media (max-height: 600px) {
          .login-container {
            overflow-y: auto;
          }
        }
      `}</style>
    </>
  );
}
