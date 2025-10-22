
import { redirect } from "next/navigation";

export default function Home() {
  return (
    redirect("/login"),
    <div className="home-container">
      <h1>Bienvenido a la aplicación de hotel</h1>
      <p>Explora nuestras habitaciones y servicios.</p>
    </div>
  );
}
