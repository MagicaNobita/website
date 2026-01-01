import { Github, Twitter, Disc } from 'lucide-react'
import NextImage from 'next/image'
import Link from 'next/link'
import type { FC } from 'react'

export const Footer: FC = () => {
  return (
    <footer className="w-full relative overflow-hidden bg-background">
      {/* Electric Line Separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_20px_2px_var(--color-primary)] opacity-50"></div>

      <div className="container px-4 md:px-6 py-20 flex flex-col max-w-7xl mx-auto relative z-10">

        {/* Top Section: Big Brand & CTA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <NextImage src="/icon.svg" alt="Bamboo Logo" width={32} height={32} className="w-8 h-8 rounded-full" />
              <span className="font-bold text-4xl tracking-tighter text-black font-[family-name:var(--font-space)]">Bamboo</span>
            </Link>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md font-light">
              The high-performance, <span className="text-black font-medium">Spring Boot native</span> indexer built for the next generation of EVM applications.
            </p>
          </div>
        </div>

        {/* Middle Section: Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 border-t border-white/5 pt-16">
          <div className="space-y-4">
            <h4 className="font-bold text-sm tracking-widest uppercase text-black/40">Product</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><Link href="/features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/integrations" className="hover:text-primary transition-colors">Integrations</Link></li>
              <li><Link href="/enterprise" className="hover:text-primary transition-colors">Enterprise</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm tracking-widest uppercase text-black/40">Developers</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><Link href="/docs" className="hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link href="/docs/api" className="hover:text-primary transition-colors">API Reference</Link></li>
              <li><a href="https://github.com/lastrealm-io/bamboo" className="hover:text-primary transition-colors">GitHub</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm tracking-widest uppercase text-black/40">Resources</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/community" className="hover:text-primary transition-colors">Community</Link></li>
              <li><Link href="/changelog" className="hover:text-primary transition-colors">Changelog</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm tracking-widest uppercase text-black/40">Socials</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"><Github size={20} /></a>
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"><Twitter size={20} /></a>
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"><Disc size={20} /></a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Bamboo.</p>
          <div className="flex items-center gap-8">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}