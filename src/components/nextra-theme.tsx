import type { FC, ReactNode } from 'react'
import { Footer } from './footer'
import { Navbar } from './navbar'

export const NextraTheme: FC<{
  children: ReactNode
}> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="w-full">
        {children}
      </main>
      <Footer />
    </>
  )
}
