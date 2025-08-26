"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import axios from "axios";

export default function LoginForm() {
  const [showRecaptchaV2, setShowRecaptchaV2] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const { executeRecaptcha } = useGoogleReCaptcha();
  // Mensaje desaparece automáticamente
  useEffect(() => {
    if (!mensaje) return;
    const timer = setTimeout(() => setMensaje(""), 5000);
    return () => clearTimeout(timer);
  }, [mensaje]);

  useEffect(() => {
    setMounted(true);

    // Inject recaptcha v2 once
    if (typeof window !== "undefined") {
      window.onRecaptchaV2Success = handleLoginWithV2;
      const script = document.createElement("script");
      script.src = "https://www.google.com/recaptcha/api.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      return () => document.body.removeChild(script);
    }
  }, []);

  const handleLoginWithV2 = async (v2Token) => {
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/recaptcha/validate-recaptcha-v2",
        { token: v2Token }
      );
      if (!data.success) {
        setMensaje("No se pudo validar reCAPTCHA v2 ❌");
        return;
      }
      setShowRecaptchaV2(false);
      setMensaje("reCAPTCHA v2 validado ✅");
      validateInputs();
    } catch (err) {
      console.error(err);
      setMensaje("Error de conexión con el backend ❌");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!executeRecaptcha) {
      setMensaje("reCAPTCHA aún no cargado ❌");
      return;
    }

    try {
      const token = await executeRecaptcha("login_form_submit");
      const { data } = await axios.post(
        "http://localhost:8000/api/recaptcha/validate-recaptcha",
        { token }
      );

      if (!data.success) {
        if (data.status === "recaptcha_v2_required") {
          setShowRecaptchaV2(true);
          return;
        } else {
          setMensaje("No se pudo validar reCAPTCHA v3 ❌");
          return;
        }
      }

      validateInputs();
    } catch (err) {
      console.error(err);
      setMensaje("Error de conexión con el backend ❌");
    }
  };

  const validateInputs = () => {
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
            height={100}
            priority
          />
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="login-title">Iniciar Sesión</h2>

          <label className="login-label">Nombre de Usuario</label>
          <input
            name="email"
            type="email"
            placeholder="Ingresa Usuario"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="new-username"
            required
            className="login-input"
          />

          <label className="login-label">Contraseña</label>
          <input
            name="password"
            type="password"
            placeholder="Ingresa Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            className="login-input"
          />

          {mounted && showRecaptchaV2 && (
            <div
              className="g-recaptcha"
              data-sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_V2_KEY}
              data-callback="onRecaptchaV2Success"
            ></div>
          )}

          <button type="submit" className="login-button">
            Entrar
          </button>

          {mensaje && <p className="login-message">{mensaje}</p>}
        </form>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100dvh; /* asegura que siempre ocupe al menos toda la pantalla */
          display: flex;
          flex-direction: column;
          justify-content: center; /* centra verticalmente si hay espacio */
          align-items: center;
          background: linear-gradient(to bottom right, #0170ab 30%, #fff);
          padding: 20px;
          overflow-y: auto; /* scroll solo si el contenido es mayor a la pantalla */
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
