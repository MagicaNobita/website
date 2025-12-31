import { useMDXComponents as getNextraComponents } from 'nextra/mdx-components'


const defaultComponents = getNextraComponents({})

export const useMDXComponents = components => ({
  ...defaultComponents,
  ...components
})