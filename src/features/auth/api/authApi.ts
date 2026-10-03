import { api } from "@/helpers/apiHelper";
export const login = (email: string, password: string) => api<{ token: string }>("/auth/login", { method: "POST", body: { email, password }, auth: false });
export const register = (name: string, email: string, password: string) => api("/auth/register", { method: "POST", body: { name, email, password }, auth: false });
