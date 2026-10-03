import { createSlice,PayloadAction } from '@reduxjs/toolkit'
import { isAuthLogin,isAuthLogout,isAuthRegister } from './action'
import type { User } from '@/types'
interface AuthState { user:User|null;isAuthLogin:boolean;isAuthRegister:boolean;isAuthLogout:boolean;error:string|null }
const initialState:AuthState={user:null,isAuthLogin:false,isAuthRegister:false,isAuthLogout:false,error:null}
const slice=createSlice({name:'auth',initialState,reducers:{setUser:(s,a:PayloadAction<User|null>)=>{s.user=a.payload}},extraReducers:b=>{b.addCase(isAuthLogin.pending,s=>{s.isAuthLogin=true;s.error=null}).addCase(isAuthLogin.fulfilled,(s,a)=>{s.isAuthLogin=false;s.user=a.payload}).addCase(isAuthLogin.rejected,(s,a)=>{s.isAuthLogin=false;s.error=a.error.message||'Login gagal'}).addCase(isAuthRegister.pending,s=>{s.isAuthRegister=true}).addCase(isAuthRegister.fulfilled,s=>{s.isAuthRegister=false}).addCase(isAuthRegister.rejected,s=>{s.isAuthRegister=false}).addCase(isAuthLogout.pending,s=>{s.isAuthLogout=true}).addCase(isAuthLogout.fulfilled,s=>{s.isAuthLogout=false;s.user=null})}})
export const {setUser}=slice.actions
export default slice.reducer
