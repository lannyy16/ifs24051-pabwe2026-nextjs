import { post } from '@/helpers/apiHelper'
import type { ApiResult,AuthPayload,RegisterPayload,User } from '@/types'
export const loginApi=(payload:AuthPayload)=>post<ApiResult<{token:string;user:User}>>('/auth/login',payload,{auth:false})
export const registerApi=(payload:RegisterPayload)=>post<ApiResult>('/auth/register',payload,{auth:false})
export const logoutApi=()=>post<ApiResult>('/auth/logout')
