import './globals.css'
import { Playfair_Display } from 'next/font/google'
import { DM_Sans } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from 'react-hot-toast'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-playfair',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm',
})

export const metadata = {
  title: 'The Sugar Life - Premium Adult Chat',
  description: 'Connect with verified, generous, and attractive people near you. Sugar Mummy and Sugar Daddy chat platform.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="bg-[#080508] text-white antialiased" style={{ fontFamily: `var(--font-dm), 'DM Sans', sans-serif` }}>
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
