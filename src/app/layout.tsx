import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
const font=Plus_Jakarta_Sans({subsets:['latin'],variable:'--font-jakarta'})
export const metadata:Metadata={title:'Delcom Posts',description:'Aplikasi postingan PABWE 2026'}
export default function RootLayout({children}:{children:ReactNode}){return <html lang="id"><body className={font.variable}><Providers>{children}</Providers></body></html>}
