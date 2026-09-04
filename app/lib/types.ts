// lib/types.ts
// Tipos compartidos entre componentes y la capa de acceso al backend.
// Mantener este archivo como fuente única de verdad del "contrato" con el backend.

export interface MenuOption {
  id: string;
  label: string;
  /** Ruta dentro de /public, ej: /assets/menu/asado.jpg */
  image: string;
}

export interface DrinkOption {
  id: string;
  label: string;
  image: string;
}

export interface PersonasInput {
  adultos: number;
  ninos: number;
}

export interface CalculoRequest {
  personas: number;
  adultos: number;
  ninos: number;
  /** IDs de MenuOption seleccionados. Puede ir vacío. */
  menu: string[];
  /** IDs de DrinkOption seleccionados. Obligatorio: mínimo 1. */
  bebidas: string[];
}

export interface CalculoResumenItem {
  label: string;
  cantidad: number;
  unidad: string;
}

export interface CalculoResponse {
  personas: number;
  resumen: CalculoResumenItem[];
  consejo?: string;
}

export interface Negocio {
  id: string;
  nombre: string;
  categoria: string;
  imagen: string;
  rating: number;
  reviews: number;
  distanciaKm: number;
  badge?: string;
  auspiciado: boolean;
  ciudad: string;
  /** El admin lo apaga para sacarlo de la búsqueda pública sin borrarlo. */
  habilitado: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
}

export type UserRole = "admin" | "user";

export interface AuthUser {
  id: string;
  nombre: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  nombre: string;
  email: string;
  password: string;
}

/** Payload para crear/editar un negocio desde el panel admin. */
export type NegocioInput = Omit<Negocio, "id"> & { id?: string };