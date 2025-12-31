import { Github, Twitter, Disc } from 'lucide-react'
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
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-black font-extrabold text-2xl group-hover:scale-110 transition-transform duration-300">
                B
              </div>
              <span className="font-bold text-4xl tracking-tighter text-white font-[family-name:var(--font-space)]">Bamboo</span>
            </Link>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md font-light">
              The high-performance, <span className="text-white font-medium">Spring Boot native</span> indexer built for the next generation of EVM applications.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end justify-center gap-4">
            <h3 className="text-2xl font-bold text-white tracking-tight">Ready to Index?</h3>
            <div className="flex flex-wrap gap-4">
              <Link href="/docs" className="px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-all hover:scale-105">
                Read Documentation
              </Link>
              <a href="https://github.com/lastrealm-io/bamboo" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full bg-primary text-black font-bold hover:shadow-[0_0_20px_-5px_var(--color-primary)] transition-all hover:scale-105">
                Start Building
              </a>
            </div>
          </div>
        </div>

        {/* Middle Section: Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 border-t border-white/5 pt-16">
          <div className="space-y-4">
            <h4 className="font-bold text-sm tracking-widest uppercase text-white/40">Product</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><Link href="/features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/integrations" className="hover:text-primary transition-colors">Integrations</Link></li>
              <li><Link href="/enterprise" className="hover:text-primary transition-colors">Enterprise</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm tracking-widest uppercase text-white/40">Developers</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><Link href="/docs" className="hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link href="/docs/api" className="hover:text-primary transition-colors">API Reference</Link></li>
              <li><a href="https://github.com/lastrealm-io/bamboo" className="hover:text-primary transition-colors">GitHub</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm tracking-widest uppercase text-white/40">Resources</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/community" className="hover:text-primary transition-colors">Community</Link></li>
              <li><Link href="/changelog" className="hover:text-primary transition-colors">Changelog</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm tracking-widest uppercase text-white/40">Socials</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"><Github size={20} /></a>
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"><Twitter size={20} /></a>
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"><Disc size={20} /></a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Bamboo Indexer. All rights reserved.</p>
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