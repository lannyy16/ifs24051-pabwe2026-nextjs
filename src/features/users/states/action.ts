import { createAsyncThunk } from '@reduxjs/toolkit'
import { changePasswordApi,getMeApi,getUsersApi,updateProfileApi,uploadPhotoApi } from '../api/userApi'
export const fetchUsers=createAsyncThunk('users/fetchUsers',async()=> (await getUsersApi()).data.users)
export const fetchProfile=createAsyncThunk('users/fetchProfile',async()=> (await getMeApi()).data.user)
export const isChangeProfile=createAsyncThunk('users/changeProfile',async(p:Partial<{name:string;bio:string}>)=>{await updateProfileApi(p);return (await getMeApi()).data.user})
export const isChangeProfilePhoto=createAsyncThunk('users/changePhoto',async(f:File)=>{await uploadPhotoApi(f);return (await getMeApi()).data.user})
export const isChangeProfilePassword=createAsyncThunk('users/changePassword',async(p:{password:string;password_confirmation:string})=>{await changePasswordApi(p);return true})
