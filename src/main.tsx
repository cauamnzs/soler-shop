import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import heroImage from "@/assets/hero-perfume.jpg";
import "./index.css";

const preloadHero = document.createElement("link");
preloadHero.rel = "preload";
preloadHero.as = "image";
preloadHero.href = heroImage;
preloadHero.setAttribute("fetchpriority", "high");
document.head.appendChild(preloadHero);

createRoot(document.getElementById("root")!).render(<App />);
