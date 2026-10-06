import React from 'react'
import { Key } from 'lucide-react'
import { GengarileoLogo, Badge, Button } from 'gengarileo-design-system'

interface HeaderProps {
  hasApiKey: boolean
  onOpenApiKeyModal: () => void
}

export const Header: React.FC<HeaderProps> = ({ hasApiKey, onOpenApiKeyModal }) => {
  return (
    <header className="header">
      <div className="brandGroup">
        <div className="logoWrap">
          <GengarileoLogo size={36} variant="gradient" showWordmark={false} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="brandTitle">FeatureCraft</h1>
            <Badge variant="lavender" size="sm">GDS Edition</Badge>
          </div>
          <p className="brandTagline">자율 에이전트 기반 원샷 풀스택 기능 빌더</p>
        </div>
      </div>

      <Button
        variant={hasApiKey ? 'soft-sky' : 'outline'}
        size="sm"
        onClick={onOpenApiKeyModal}
        leftIcon={!hasApiKey ? <Key size={14} /> : undefined}
      >
        {hasApiKey ? (
          <Badge variant="sky" size="sm" dot={true}>
            Gemini API 연동됨
          </Badge>
        ) : (
          <span>무료 API 키 연결 (시뮬레이션 모드)</span>
        )}
      </Button>
    </header>
  )
}
