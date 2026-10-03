export interface User { id: string; name: string; email: string; photo?: string | null }
export interface PostAuthor { id: string; name: string; photo?: string | null }
export interface PostComment { id: string; comment: string; user_id: string; author?: PostAuthor; created_at?: string }
export interface Post { id: string; user_id: string; cover?: string | null; description: string; created_at: string; author?: PostAuthor; likes?: { user_id: string }[]; comments?: PostComment[]; total_likes?: number; total_comments?: number }
export interface ApiResult<T> { success: boolean; message: string; data: T }
