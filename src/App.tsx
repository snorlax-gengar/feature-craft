import { useState, useEffect } from 'react'
import { Header } from './components/Header.tsx'
import { ApiKeyModal } from './components/ApiKeyModal.tsx'
import { FeatureInput } from './components/FeatureInput.tsx'
import { PipelineProgress } from './components/PipelineProgress.tsx'
import { ResultViewer } from './components/ResultViewer.tsx'
import { Footer } from './components/Footer.tsx'
import { runFeaturePipeline } from './services/generator.ts'
import type { FeatureResult, PipelineStep, TechStack } from './types/feature.ts'
import './index.css'

const INITIAL_STEPS: PipelineStep[] = [
  {
    id: 'schema',
    title: '데이터베이스 스키마 설계',
    description: 'PostgreSQL 테이블, 컬럼, 외래키 및 RLS 보안 정책',
    status: 'idle',
  },
  {
    id: 'backend',
    title: '타입 안전 백엔드 로직',
    description: '스마트 스키마 컬럼과 100% 일치하는 Server Actions',
    status: 'idle',
  },
  {
    id: 'frontend',
    title: '프론트엔드 UI 컴포넌트',
    description: '반응형 폼, 아바타 미리보기, 상태 관리 React 컴포넌트',
    status: 'idle',
  },
  {
    id: 'guide',
    title: '3분 통합 적용 가이드',
    description: '패키지 설치 및 복사 위치 안내서',
    status: 'idle',
  },
]

export default function App() {
  const [apiKey, setApiKey] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isBuilding, setIsBuilding] = useState<boolean>(false)
  const [steps, setSteps] = useState<PipelineStep[]>(INITIAL_STEPS)
  const [result, setResult] = useState<FeatureResult | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [currentTechStack] = useState<TechStack>('nextjs-supabase')

  const [theme, setTheme] = useState<'green' | 'blue'>(() => {
    const saved = localStorage.getItem('featurecraft_theme')
    return saved === 'blue' || saved === 'green' ? saved : 'green'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('featurecraft_theme', theme)
  }, [theme])

  useEffect(() => {
    const savedKey = localStorage.getItem('featurecraft_gemini_key')
    if (savedKey) {
      setApiKey(savedKey)
    }
  }, [])

  function handleToggleTheme() {
    setTheme((prev) => (prev === 'green' ? 'blue' : 'green'))
  }

  function handleSaveApiKey(newKey: string) {
    setApiKey(newKey)
    if (newKey) {
      localStorage.setItem('featurecraft_gemini_key', newKey)
    } else {
      localStorage.removeItem('featurecraft_gemini_key')
    }
  }

  async function handleBuild(userGoal: string) {
    setIsBuilding(true)
    setErrorMessage(null)
    setResult(null)
    setSteps(INITIAL_STEPS.map((s) => ({ ...s, status: 'idle', detail: undefined })))

    try {
      const generatedResult = await runFeaturePipeline({
        userGoal,
        techStack: currentTechStack,
        apiKey,
        onStepChange: (stepId, status, detail) => {
          setSteps((prev) =>
            prev.map((step) =>
              step.id === stepId ? { ...step, status, detail: detail ?? step.detail } : step,
            ),
          )
        },
      })
      setResult(generatedResult)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setErrorMessage(msg)
    } finally {
      setIsBuilding(false)
    }
  }

  function handleReset() {
    setResult(null)
    setErrorMessage(null)
    setSteps(INITIAL_STEPS)
  }

  return (
    <div className="appShell">
      <Header
        hasApiKey={Boolean(apiKey)}
        onOpenApiKeyModal={() => setIsModalOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <main className="mainContent">
        <FeatureInput onBuild={handleBuild} isBuilding={isBuilding} />

        {isBuilding && <PipelineProgress steps={steps} />}

        {errorMessage && (
          <div className="errorBanner">
            <p className="font-bold mb-1">🚨 생성 중 오류가 발생했습니다</p>
            <p className="text-sm">{errorMessage}</p>
            {!apiKey && (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="mt-2 text-xs underline font-semibold"
              >
                Gemini API 키를 등록하고 다시 시도해보세요.
              </button>
            )}
          </div>
        )}

        {result && !isBuilding && (
          <ResultViewer result={result} onReset={handleReset} />
        )}
      </main>

      <Footer />

      <ApiKeyModal
        isOpen={isModalOpen}
        currentApiKey={apiKey}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveApiKey}
      />
    </div>
  )
}
