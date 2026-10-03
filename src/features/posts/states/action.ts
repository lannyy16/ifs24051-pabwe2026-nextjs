import { createAsyncThunk } from '@reduxjs/toolkit'
import { addCommentApi,addPostApi,changeCoverApi,deleteAllPostsApi,deleteCommentApi,deletePostApi,getPostApi,getPostsApi,likePostApi,updatePostApi } from '../api/postApi'
export const fetchPosts=createAsyncThunk('posts/fetchPosts',async(isMe?:boolean)=>(await getPostsApi(isMe)).data.posts)
export const fetchPost=createAsyncThunk('posts/fetchPost',async(id:number)=>(await getPostApi(id)).data.post)
export const isPostAdd=createAsyncThunk('posts/add',async(p:{description:string;cover?:File})=>{await addPostApi(p.description,p.cover);return true})
export const isPostChange=createAsyncThunk('posts/change',async(p:{id:number;description:string})=>{await updatePostApi(p.id,p.description);return p.id})
export const isPostChangeCover=createAsyncThunk('posts/changeCover',async(p:{id:number;cover:File})=>{await changeCoverApi(p.id,p.cover);return p.id})
export const isPostDelete=createAsyncThunk('posts/delete',async(id:number)=>{await deletePostApi(id);return id})
export const isPostLike=createAsyncThunk('posts/like',async(p:{id:number;like:0|1})=>{await likePostApi(p.id,p.like);return p})
export const isPostAddComment=createAsyncThunk('posts/comment',async(p:{id:number;comment:string})=>{await addCommentApi(p.id,p.comment);return p.id})
export const isPostDeleteComment=createAsyncThunk('posts/deleteComment',async(id:number)=>{await deleteCommentApi(id);return id})
export const isPostDeleteAll=createAsyncThunk('posts/deleteAll',async()=>{await deleteAllPostsApi();return true})
