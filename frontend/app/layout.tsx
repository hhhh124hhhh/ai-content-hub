import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Prompt Marketplace - Discover High-Quality AI Prompts',
  description: 'Discover high-quality AI prompts evaluated and ranked by our advanced AI algorithms. Find the best ChatGPT, Claude, and other AI model prompts.',
  keywords: ['AI Prompt', 'ChatGPT Prompt', 'Claude Prompt', 'AI Assistant', 'Prompt Marketplace', 'AI Tools'],
  authors: [{ name: 'AI Prompt Marketplace' }],
  creator: 'AI Prompt Marketplace',
  publisher: 'AI Prompt Marketplace',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ai-prompt-marketplace.com',
    siteName: 'AI Prompt Marketplace',
    title: 'AI Prompt Marketplace - Discover High-Quality AI Prompts',
    description: 'Discover high-quality AI prompts evaluated and ranked by our advanced AI algorithms.',
    images: [
      {
        url: 'https://ai-prompt-marketplace.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Prompt Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Prompt Marketplace - Discover High-Quality AI Prompts',
    description: 'Discover high-quality AI prompts evaluated and ranked by our advanced AI algorithms.',
    images: ['https://ai-prompt-marketplace.com/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
