import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Método no permitido" });

  const { token } = req.body;
  if (!token)
    return res.status(400).json({ success: false, message: "Token faltante" });

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
    );

    if (response.data.success) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ success: false, message: "Captcha inválido" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error en validación" });
  }
}