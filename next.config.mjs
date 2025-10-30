/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://192.168.168.2:3000",
    "http://192.168.168.2",
    "http://192.168.168.2:8000",
  ],
  // Opciones extra que ayudan con Turbopack y dev
  reactStrictMode: true,
};

export default nextConfig;
