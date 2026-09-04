// lib/mockNegocios.ts
// SOLO para desarrollo del front mientras el backend (localhost:5000) no está
// levantado. BusinessesSection lo usa como fallback si el fetch falla.
// Borrar este archivo (y su uso) una vez que /api/negocios esté disponible.
import type { Negocio } from "./types";

export const MOCK_NEGOCIOS: Negocio[] = [
  {
    id: "carniceria-don-jose",
    nombre: "Carnicería Don José",
    categoria: "Carnicería",
    imagen: "/assets/negocios/carniceria.jpg",
    rating: 4.8,
    reviews: 120,
    distanciaKm: 1.2,
    badge: "10% OFF en asados",
    auspiciado: true,
  },
  {
    id: "distribuidora-el-sol",
    nombre: "Distribuidora El Sol",
    categoria: "Bebidas",
    imagen: "/assets/negocios/bebidas.jpg",
    rating: 4.6,
    reviews: 98,
    distanciaKm: 1.5,
    badge: "Envíos gratis desde $15.000",
    auspiciado: true,
  },
  {
    id: "panaderia-la-abuela",
    nombre: "Panadería La Abuela",
    categoria: "Panadería",
    imagen: "/assets/negocios/panaderia.jpg",
    rating: 4.7,
    reviews: 75,
    distanciaKm: 0.9,
    badge: "Pan para eventos",
    auspiciado: true,
  },
  {
    id: "hielo-polar",
    nombre: "Hielo Polar",
    categoria: "Hielo",
    imagen: "/assets/negocios/hielo.jpg",
    rating: 4.9,
    reviews: 60,
    distanciaKm: 1.1,
    badge: "Bolsón 10kg $1.200",
    auspiciado: true,
  },
];
