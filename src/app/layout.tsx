import './globals.css'
import Providers from '@/components/Providers'
export const metadata={title:'Delcom Posts',description:'Aplikasi postingan NextJS'}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="id"><body><Providers>{children}</Providers></body></html>}
