import React from 'react'
import { Sparkles, Key, CheckCircle2 } from 'lucide-react'

interface HeaderProps {
  hasApiKey: boolean
  onOpenApiKeyModal: () => void
}

export const Header: React.FC<HeaderProps> = ({ hasApiKey, onOpenApiKeyModal }) => {
  return (
    <header className="header">
      <div className="brandGroup">
        <div className="logoWrap">
          <Sparkles className="logoIcon" size={22} />
        </div>
        <div>
          <h1 className="brandTitle">FeatureCraft</h1>
          <p className="brandTagline">자율 에이전트 기반 원샷 풀스택 기능 빌더</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenApiKeyModal}
        className={`apiKeyButton ${hasApiKey ? 'apiKeyActive' : 'apiKeyInactive'}`}
      >
        {hasApiKey ? (
          <>
            <CheckCircle2 size={15} className="text-emerald-500" />
            <span>Gemini API 연동됨</span>
          </>
        ) : (
          <>
            <Key size={15} />
            <span>무료 API 키 연결 (시뮬레이션 모드)</span>
          </>
        )}
      </button>
    </header>
  )
}
