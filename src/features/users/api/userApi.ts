import { api } from "@/helpers/apiHelper";
import type { User } from "@/types";
export const getUsers = (search?: string) => api<{ users: User[] }>("/users", { query: { search } });
export const updateMe = (name: string, email: string) => api("/users/me", { method: "PUT", body: { name, email } });
export const uploadPhoto = (file: File) => { const f = new FormData(); f.append("photo", file); return api("/users/me/photo", { method: "POST", body: f }); };
export const changePassword = (password: string, new_password: string) => api("/users/me/password", { method: "PUT", body: { password, new_password } });
