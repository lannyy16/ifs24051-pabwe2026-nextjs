import {post} from '@/helpers/apiHelper'
export const loginApi=(data:{email:string;password:string})=>post('/auth/login',data,{auth:false})
export const registerApi=(data:{name:string;email:string;password:string})=>post('/auth/register',data,{auth:false})
