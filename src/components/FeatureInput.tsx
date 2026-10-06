import React, { useState } from 'react'
import { Sparkles, ArrowRight, Wand2 } from 'lucide-react'
import { Card, Button, Badge } from 'gengarileo-design-system'

interface FeatureInputProps {
  onBuild: (userGoal: string) => void
  isBuilding: boolean
}

const PRESET_IDEAS = [
  {
    title: '👤 프로필 사진 & 닉네임 수정',
    prompt: '사용자가 구글 로그인 후 프로필 사진과 닉네임을 수정하는 기능',
  },
  {
    title: '💬 실시간 댓글 & 좋아요 토글',
    prompt: '게시물에 실시간 댓글을 작성하고 좋아요를 누를 수 있는 기능',
  },
  {
    title: '🛒 장바구니 담기 & 주문서 생성',
    prompt: '상품을 장바구니에 담고 수량을 조절하여 총 결제 금액을 계산하는 주문 기능',
  },
]

export const FeatureInput: React.FC<FeatureInputProps> = ({ onBuild, isBuilding }) => {
  const [prompt, setPrompt] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!prompt.trim() || isBuilding) return
    onBuild(prompt.trim())
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      if (prompt.trim() && !isBuilding) {
        onBuild(prompt.trim())
      }
    }
  }

  function applyPreset(text: string) {
    setPrompt(text)
  }

  return (
    <section className="inputSection">
      <div className="heroText">
        <div className="inline-flex items-center gap-2 mb-3">
          <Badge variant="sky" size="sm" dot={true}>
            Autonomous AI Pipeline
          </Badge>
          <Badge variant="butter" size="sm">
            Gengarileo Soft UI
          </Badge>
        </div>
        <h2 className="heroHeadline">
          만들고 싶은 기능을 <span className="text-gradient">자연어</span>로 편하게 적어보세요.
        </h2>
        <p className="heroSub">
          AI 비서가 내부에서 <strong>[데이터베이스 ➔ 백엔드 로직 ➔ 프론트엔드 UI]</strong>를 연속으로 알아서 조립해,
          변수명이 100% 일치하는 완성형 코드를 가져옵니다.
        </p>
      </div>

      <Card variant="default" padding="lg" className="inputCard">
        <form onSubmit={handleSubmit}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="예: 사용자가 이미지를 업로드하고 태그를 붙여서 갤러리 피드에 공유하는 기능 만들어줘"
            rows={3}
            disabled={isBuilding}
            className="featureTextarea"
          />

          <div className="inputFooter">
            <div className="presetWrapper">
              <span className="presetLabel">
                <Wand2 size={13} className="text-amber-500" />
                <span>추천 기능:</span>
              </span>
              <div className="presetButtons">
                {PRESET_IDEAS.map((preset) => (
                  <button
                    key={preset.title}
                    type="button"
                    onClick={() => applyPreset(preset.prompt)}
                    disabled={isBuilding}
                    className="presetBtn"
                  >
                    {preset.title}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="md"
              disabled={!prompt.trim() || isBuilding}
              isLoading={isBuilding}
              leftIcon={!isBuilding ? <Sparkles size={16} /> : undefined}
              rightIcon={!isBuilding ? <ArrowRight size={15} /> : undefined}
              className="buildSubmitBtn"
            >
              {isBuilding ? '자율 파이프라인 조립 중...' : '원샷 풀스택 빌드'}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  )
}
