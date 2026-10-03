export type User={id:number;name:string;email?:string;photo?:string;bio?:string}
export type Post={id:number;description:string;cover?:string;created_at?:string;user?:User;likes?:any[];comments?:any[]}
