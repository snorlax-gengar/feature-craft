import React from 'react'
import { Heart } from 'lucide-react'
import { GengarileoLogo } from 'gengarileo-design-system'

export const Footer: React.FC = () => {
  return (
    <footer className="footerSection">
      <div className="footerDivider" />
      <div className="footerContent">
        <div>
          <div className="flex items-center gap-2 mb-1 text-slate-800 font-bold text-sm">
            <GengarileoLogo size={20} variant="dark" showWordmark={false} />
            <span className="font-heading font-extrabold">FeatureCraft</span>
            <span className="footerTechBadge">
              Studio Edition
            </span>
          </div>
          <p className="text-xs text-slate-500">
            © 2026 FeatureCraft. Designed with <Heart size={11} className="inline text-rose-500 fill-rose-500" /> by <strong>snorlax-gengar</strong> using GDS.
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
