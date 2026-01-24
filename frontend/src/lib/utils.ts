// // import { clsx, type ClassValue } from "clsx";
// // import { twMerge } from "tailwind-merge";
// //
// // export function cn(...inputs: ClassValue[]) {
// //   return twMerge(clsx(inputs));
// // }
// import { clsx, type ClassValue } from "clsx";
// import { twMerge } from "tailwind-merge";
//
// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }
//
// // ============================
// // 🔥 Backend API Configuration
// // ============================
//
// export const API_BASE_URL = "http://localhost:8080";
//
// // A universal function for GET/POST/PUT/DELETE requests
// export async function apiRequest(
//     endpoint: string,
//     method: string = "GET",
//     body?: any,
//     token?: string
// ) {
//   const headers: any = {
//     "Content-Type": "application/json",
//   };
//
//   if (token) {
//     headers["Authorization"] = `Bearer ${token}`;
//   }
//
//   const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//     method,
//     headers,
//     body: body ? JSON.stringify(body) : undefined,
//   });
//
//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(errorText || "API Error");
//   }
//
//   return response.json();
// }


import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
