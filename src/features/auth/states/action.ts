import { createAsyncThunk } from '@reduxjs/toolkit'
import { loginApi,logoutApi,registerApi } from '../api/authApi'
import { putAccessToken } from '@/helpers/apiHelper'
import type { AuthPayload,RegisterPayload } from '@/types'
export const isAuthLogin=createAsyncThunk('auth/login',async(payload:AuthPayload)=>{const r=await loginApi(payload);putAccessToken(r.data.token);return r.data.user})
export const isAuthRegister=createAsyncThunk('auth/register',async(payload:RegisterPayload)=>{const r=await registerApi(payload);return r.message})
export const isAuthLogout=createAsyncThunk('auth/logout',async()=>{try{await logoutApi()}finally{putAccessToken(null)}})
