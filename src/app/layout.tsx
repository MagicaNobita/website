import type { Metadata } from 'next'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import type { FC, ReactNode } from 'react'
import { NextraTheme } from '@/components/nextra-theme'
import './globals.css'
import { Space_Grotesk, Manrope } from 'next/font/google'
import { SmoothScroll } from '@/components/smooth-scroll'
import { GlobalSpotlight } from '@/components/ui/global-spotlight'
import { LayoutWrapper } from '@/components/preloader/layout-wrapper'

export const metadata: Metadata = {
  title: {
    absolute: '',
    template: '%s - Nextra'
  }
}

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })

const RootLayout: FC<{ children: ReactNode }> = async ({ children }) => {
  const pageMap = await getPageMap()
  return (
    <html lang="en" dir="ltr" className={`${spaceGrotesk.variable} ${manrope.variable}`}>
      <Head faviconGlyph="✦" />
      <body style={{ margin: 0 }} className="bg-background overflow-x-hidden selection:bg-primary/30 font-sans text-foreground">
        {/* Global Noise Overlay */}
        <div className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply"></div>

        <SmoothScroll />
        <GlobalSpotlight />
        <LayoutWrapper>
          <NextraTheme pageMap={pageMap}>{children}</NextraTheme>
        </LayoutWrapper>
      </body>
    </html>
  )
}

export default RootLayout