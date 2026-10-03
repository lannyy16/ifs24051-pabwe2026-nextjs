import { del,post,put,get } from '@/helpers/apiHelper'
import type { ApiResult,User } from '@/types'
export const getUsersApi=()=>get<ApiResult<{users:User[]}>>('/users')
export const getMeApi=()=>get<ApiResult<{user:User}>>('/users/me')
export const updateProfileApi=(payload:Partial<User>)=>put<ApiResult>('/users/me',payload)
export const uploadPhotoApi=(cover:File)=>{const f=new FormData();f.append('photo',cover);return post<ApiResult>('/users/me/photo',f)}
export const changePasswordApi=(payload:{password:string;password_confirmation:string})=>put<ApiResult>('/users/me/password',payload)
