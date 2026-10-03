import {configureStore,createSlice,PayloadAction} from '@reduxjs/toolkit'
type State={user:any;posts:any[]}
const initial:State={user:null,posts:[]}
const appSlice=createSlice({name:'app',initialState:initial,reducers:{setUser:(s,a:PayloadAction<any>)=>{s.user=a.payload},setPosts:(s,a:PayloadAction<any[]>)=>{s.posts=a.payload}}})
export const {setUser,setPosts}=appSlice.actions
export const store=configureStore({reducer:{app:appSlice.reducer}})
export type RootState=ReturnType<typeof store.getState>;export type AppDispatch=typeof store.dispatch
