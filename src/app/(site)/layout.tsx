import type { ReactNode } from 'react'
import { NextraTheme } from '@/components/nextra-theme'

const SiteLayout = ({ children }: { children: ReactNode }) => {
  return <NextraTheme>{children}</NextraTheme>
}

export default SiteLayout
