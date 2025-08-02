// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases de Tailwind CSS sin conflictos y con soporte para condiciones
 * @param inputs Clases a combinar
 * @returns Cadena de clases optimizada
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formatea un monto como moneda chilena (CLP)
 * @param amount Monto a formatear
 * @param options Opciones de formato personalizado
 * @returns Cadena formateada (ej: $1.234.567)
 */
export function formatCLP(
  amount: number,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
    ...options,
  }).format(amount);
}

/**
 * Formatea una fecha en formato corto (dd/mm/yyyy)
 * @param date Fecha a formatear
 * @param options Opciones de formato personalizado
 * @returns Cadena formateada (ej: 01/01/2023)
 */
export function formatShortDate(
  date: Date,
  options?: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...options,
  }).format(date);
}

/**
 * Formatea una fecha en formato largo en español
 * @param date Fecha a formatear
 * @param options Opciones de formato personalizado
 * @returns Cadena formateada (ej: 1 de enero de 2023)
 */
export function formatLongDate(
  date: Date,
  options?: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  }).format(date);
}

/**
 * Genera un ID único basado en timestamp y random
 * @returns ID alfanumérico único
 */
export function generateId(): string {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 9)
  ).padEnd(15, "0");
}

/**
 * Valida si un valor es una fecha válida
 * @param date Valor a validar
 * @returns true si es una fecha válida
 */
export function isValidDate(date: unknown): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Extrae el mes y año en formato YYYY-MM
 * @param date Fecha a formatear
 * @returns Cadena en formato YYYY-MM
 */
export function getMonthYear(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${year}-${month}`;
}