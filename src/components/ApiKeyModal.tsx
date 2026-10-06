import React, { useState } from 'react'
import { X, ExternalLink, Key, Check } from 'lucide-react'
import { Button } from 'gengarileo-design-system'

interface ApiKeyModalProps {
  isOpen: boolean
  currentApiKey: string
  onClose: () => void
  onSave: (key: string) => void
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  currentApiKey,
  onClose,
  onSave,
}) => {
  const [keyInput, setKeyInput] = useState(currentApiKey)

  if (!isOpen) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave(keyInput.trim())
    onClose()
  }

  function handleClear() {
    setKeyInput('')
    onSave('')
    onClose()
  }

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalCard" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <div className="flex items-center gap-2">
            <Key size={18} className="modalKeyIcon" />
            <h3 className="modalTitle">Google Gemini API 키 설정</h3>
            <span className="modalFreeBadge">100% 무료</span>
          </div>
          <button type="button" onClick={onClose} className="modalCloseBtn">
            <X size={18} />
          </button>
        </div>

        <p className="modalDesc">
          Google AI Studio에서 무료로 제공하는 Gemini API 키를 등록하면, 사용자가 입력한 어떤 자연어 기능이든 실시간 4단계 자율 체이닝으로 생성할 수 있습니다.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Gemini API Key
            </label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="modalInput"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              * 키는 브라우저(localStorage)에만 안전하게 저장되며 외부 서버로 전송되지 않습니다.
            </p>
          </div>

          <div className="freeKeyGuide">
            <p className="text-xs font-semibold text-slate-800 mb-1">
              💡 아직 API 키가 없으신가요? (100% 무료)
            </p>
            <p className="text-xs text-slate-600 mb-2">
              Google 계정만 있으면 신용카드 등록 없이 3초 만에 무료 API 키를 발급받을 수 있습니다.
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="freeKeyLink"
            >
              <span>Google AI Studio에서 무료 키 발급받기</span>
              <ExternalLink size={13} />
            </a>
          </div>

          <div className="modalActions">
            {currentApiKey && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="modalSecondaryBtn"
              >
                키 삭제 (시뮬레이션 모드로 전환)
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              size="sm"
              leftIcon={<Check size={16} />}
              className="modalPrimaryBtn"
            >
              저장하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
