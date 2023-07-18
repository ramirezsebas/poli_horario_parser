'use client'
import './globals.css'
import type { Metadata } from 'next'
import { Providers } from "./providers";
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Poli Horario Parser',
    description: 'Applicación para parsear horarios',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}><Providers>
                {children}
            </Providers></body>
        </html>
    )
}
