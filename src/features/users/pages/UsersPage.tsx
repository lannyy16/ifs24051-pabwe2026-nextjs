"use client"
import {useEffect,useState} from 'react';import {get} from '@/helpers/apiHelper'
export default function UsersPage(){const [users,setUsers]=useState<any[]>([]);useEffect(()=>{get('/users').then((r:any)=>setUsers(r.data?.users||r.data||[])).catch(()=>{})},[]);return <><h1 className="text-3xl font-black mb-5">Daftar Pengguna</h1><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{users.map(u=><div className="card p-5" key={u.id}><b>{u.name}</b><p className="text-slate-500">{u.email}</p></div>)}</div></>}
