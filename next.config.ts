import nextra from 'nextra'

const withNextra = nextra({
  // theme: 'nextra-theme-docs', // Removed for Nextra 4 compatibility
  // themeConfig: './theme.config.tsx' // Removed for Nextra 4 compatibility
})

export default withNextra({
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
})
