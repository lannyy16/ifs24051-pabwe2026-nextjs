export type Status="idle"|"loading"|"succeeded"|"failed";
export interface ApiError { message:string; status?:number; }
