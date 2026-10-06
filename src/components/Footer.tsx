import React from 'react'
import { Sparkles, Heart } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="footerSection">
      <div className="footerDivider" />
      <div className="footerContent">
        <div>
          <div className="flex items-center gap-1.5 mb-1 text-slate-800 font-bold text-sm">
            <Sparkles size={14} className="text-blue-600" />
            <span>FeatureCraft</span>
          </div>
          <p className="text-xs text-slate-500">
            © 2026 FeatureCraft. Designed & Built with <Heart size={11} className="inline text-rose-500" /> by <strong>snorlax-gengar</strong>.
          </p>
        </div>

        <div className="footerRight">
          <a
            href="mailto:gengarileo@gmail.com"
            className="footerLink"
          >
            ✉️ gengarileo@gmail.com
          </a>
          <span className="text-slate-300">·</span>
          <a
            href="https://github.com/snorlax-gengar"
            target="_blank"
            rel="noopener noreferrer"
            className="footerLink"
          >
            GitHub: snorlax-gengar
          </a>
        </div>
      </div>
    </footer>
  )
}
