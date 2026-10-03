export interface ApiResult<T = unknown> { success: boolean; message: string; data: T }
export interface User { id: number; name: string; email?: string; bio?: string | null; photo?: string | null }
export interface PostAuthor { name: string; photo: string | null }
export interface PostComment { id: number; comment: string; created_at: string; updated_at: string }
export interface Post { id: number; user_id: number; cover: string | null; description: string; created_at: string; updated_at: string; author: PostAuthor; likes: number[]; comments: PostComment[]; my_comment?: PostComment | null }
export interface AuthPayload { email: string; password: string }
export interface RegisterPayload { name: string; email: string; password: string }
