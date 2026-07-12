import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ChatWazungu - Chat with Beautiful People',
  description: 'Unlock profiles, chat with AI companions, and earn money on ChatWazungu.'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#1A1715',
                color: '#fff',
                border: '1px solid #C9A84C',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}