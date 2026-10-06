import React from 'react'
import { Key, Sparkles } from 'lucide-react'
import { GengarileoLogo } from 'gengarileo-design-system'

interface HeaderProps {
  hasApiKey: boolean
  onOpenApiKeyModal: () => void
  theme?: 'green' | 'blue'
  onToggleTheme?: () => void
}

export const Header: React.FC<HeaderProps> = ({
  hasApiKey,
  onOpenApiKeyModal,
  theme = 'green',
  onToggleTheme,
}) => {
  return (
    <header className="header">
      <div className="brandGroup">
        <div className="logoWrap">
          <GengarileoLogo size={34} variant="dark" showWordmark={false} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="brandTitle">FeatureCraft</h1>
            <span className="brandEditionBadge">
              {theme === 'green' ? 'Ivory & Green #009651' : 'Ivory & Blue #005dac'}
            </span>
          </div>
          <p className="brandTagline">자율 에이전트 기반 원샷 풀스택 기능 빌더</p>
        </div>
      </div>

      <div className="headerActions">
        {onToggleTheme && (
          <button
            type="button"
            onClick={onToggleTheme}
            className="themeToggleBtn"
            title={theme === 'green' ? '코발트 블루(#005dac) 테마로 전환' : '포레스트 그린(#009651) 테마로 전환'}
          >
            <span
              className={`themeColorDot ${theme === 'green' ? 'dotGreenTheme' : 'dotBlueTheme'}`}
            />
            <span className="themeToggleText">
              {theme === 'green' ? '그린 (#009651)' : '블루 (#005dac)'}
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={onOpenApiKeyModal}
          className={`apiKeyButton ${hasApiKey ? 'apiKeyActive' : 'apiKeyInactive'}`}
        >
          {hasApiKey ? (
            <>
              <Sparkles size={13} className="text-primary" />
              <span>Gemini API 연동됨</span>
            </>
          ) : (
            <>
              <Key size={13} />
              <span>무료 API 키 연결</span>
            </>
          )}
        </button>
      </div>
    </header>
  )
}
