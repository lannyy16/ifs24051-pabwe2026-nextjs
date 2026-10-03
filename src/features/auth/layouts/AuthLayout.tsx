'use client'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/hooks/redux'
export default function AuthLayout({children}:{children:ReactNode}){const router=useRouter();const user=useAppSelector(s=>s.auth.user);useEffect(()=>{if(user)router.replace('/')},[user,router]);return <main className="min-h-screen grid lg:grid-cols-2"><section className="hidden lg:flex bg-indigo-600 text-white p-14 flex-col justify-between"><div className="text-2xl font-black">Delcom Posts</div><div><p className="text-5xl font-black leading-tight">Bagikan cerita.<br/>Temukan inspirasi.</p><p className="mt-5 text-indigo-100 max-w-md">Aplikasi postingan sederhana berbasis Next.js, TypeScript, Redux Toolkit dan Delcom Open API.</p></div><p className="text-sm text-indigo-200">PABWE 2026 • NextJS</p></section><section className="flex items-center justify-center p-6">{children}</section></main>}
