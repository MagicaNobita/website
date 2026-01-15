import type { ReactNode } from 'react'
import { Layout } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'

const DocsLayout = async ({ children }: { children: ReactNode }) => {
  const pageMap = await getPageMap()
  return <Layout pageMap={pageMap}>{children}</Layout>
}

export default DocsLayout
