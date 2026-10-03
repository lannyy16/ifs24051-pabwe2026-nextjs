"use client"
import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';import {loginApi,registerApi} from '../api/authApi';import {putAccessToken} from '@/helpers/apiHelper'
export const login=createAsyncThunk('auth/login',async(data:{email:string;password:string})=>{const r:any=await loginApi(data);putAccessToken(r.data.token);return r.data.user})
export const register=createAsyncThunk('auth/register',async(data:{name:string;email:string;password:string})=>registerApi(data))
const slice=createSlice({name:'auth',initialState:{user:null,isAuthLogin:false,isAuthRegister:false,error:null as string|null},reducers:{logout:(s)=>{putAccessToken(null);s.user=null}},extraReducers:b=>{b.addCase(login.pending,s=>{s.isAuthLogin=true}).addCase(login.fulfilled,(s,a)=>{s.isAuthLogin=false;s.user=a.payload}).addCase(login.rejected,(s,a)=>{s.isAuthLogin=false;s.error=a.error.message||'Login gagal'}).addCase(register.pending,s=>{s.isAuthRegister=true}).addCase(register.fulfilled,s=>{s.isAuthRegister=false}).addCase(register.rejected,s=>{s.isAuthRegister=false})}})
export const {logout}=slice.actions;export default slice.reducer
