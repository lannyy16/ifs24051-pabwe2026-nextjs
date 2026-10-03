import { del,get,post,put } from '@/helpers/apiHelper'
import type { ApiResult,Post } from '@/types'
export const getPostsApi=(isMe?:boolean)=>get<ApiResult<{posts:Post[]}>>('/posts',{query:isMe?{is_me:1}:undefined})
export const getPostApi=(id:number|string)=>get<ApiResult<{post:Post}>>(`/posts/${id}`)
export const addPostApi=(description:string,cover?:File)=>{const f=new FormData();f.append('description',description);if(cover)f.append('cover',cover);return post<ApiResult<{post_id:number}>>('/posts',f)}
export const updatePostApi=(id:number|string,description:string)=>put<ApiResult>(`/posts/${id}`,new URLSearchParams({description}))
export const changeCoverApi=(id:number|string,cover:File)=>{const f=new FormData();f.append('cover',cover);return post<ApiResult>(`/posts/${id}/cover`,f)}
export const deletePostApi=(id:number|string)=>del<ApiResult>(`/posts/${id}`)
export const likePostApi=(id:number|string,like:0|1)=>post<ApiResult>(`/posts/${id}/likes`,new URLSearchParams({like:String(like)}))
export const addCommentApi=(id:number|string,comment:string)=>post<ApiResult>(`/posts/${id}/comments`,new URLSearchParams({comment}))
export const deleteCommentApi=(id:number|string)=>del<ApiResult>(`/posts/${id}/comments`)
export const deleteAllPostsApi=()=>del<ApiResult>('/posts')
