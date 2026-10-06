import React, { useState } from 'react'
import {
  Database,
  Server,
  Layout,
  FileText,
  Copy,
  Check,
  Download,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import type { FeatureResult } from '../types/feature.ts'

interface ResultViewerProps {
  result: FeatureResult
  onReset: () => void
}

type TabKey = 'schema' | 'backend' | 'frontend' | 'guide'

export const ResultViewer: React.FC<ResultViewerProps> = ({ result, onReset }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('schema')
  const [copiedTab, setCopiedTab] = useState<string | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)

  const currentFile =
    activeTab === 'schema'
      ? result.schema
      : activeTab === 'backend'
      ? result.backend
      : activeTab === 'frontend'
      ? result.frontend
      : null

  async function handleCopyCurrent() {
    const textToCopy = currentFile ? currentFile.code : result.guide.markdown
    await navigator.clipboard.writeText(textToCopy)
    setCopiedTab(activeTab)
    setTimeout(() => setCopiedTab(null), 2000)
  }

  async function handleCopyAll() {
    const allText = `# ${result.title}
요구사항: ${result.userGoal}

==================================================
1. [DATABASE SCHEMA] File: ${result.schema.path}
==================================================
${result.schema.code}

==================================================
2. [BACKEND LOGIC] File: ${result.backend.path}
==================================================
${result.backend.code}

==================================================
3. [FRONTEND UI] File: ${result.frontend.path}
==================================================
${result.frontend.code}

==================================================
4. [INTEGRATION GUIDE]
==================================================
${result.guide.markdown}
`
    await navigator.clipboard.writeText(allText)
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2000)
  }

  function handleDownloadBundle() {
    // Generate simple text bundle download
    const bundleText = `# ${result.title}
==================================================
File: ${result.schema.path}
==================================================
${result.schema.code}

==================================================
File: ${result.backend.path}
==================================================
${result.backend.code}

==================================================
File: ${result.frontend.path}
==================================================
${result.frontend.code}
`
    const blob = new Blob([bundleText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `feature-bundle-${result.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="resultContainer">
      {/* Result Top Banner */}
      <div className="resultHeader">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="resultSuccessBadge">
              <Sparkles size={13} />
              <span>완성형 풀스택 세트 생성됨</span>
            </span>
            <span className="text-xs text-slate-500 font-medium">변수명 100% 매핑 검증 완료</span>
          </div>
          <h2 className="resultTitle">{result.title}</h2>
          <p className="resultSummary">{result.summary}</p>
        </div>

        <div className="resultHeaderActions">
          <button
            type="button"
            onClick={onReset}
            className="resetBtn"
          >
            <RotateCcw size={14} />
            <span>새 기능 만들기</span>
          </button>
          <button
            type="button"
            onClick={handleCopyAll}
            className={`copyAllBtn ${copiedAll ? 'copyAllBtnSuccess' : ''}`}
          >
            {copiedAll ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedAll ? '전체 세트 복사 완료!' : '전체 파일 일괄 복사'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadBundle}
            className="downloadBtn"
            title="텍스트 번들로 다운로드"
          >
            <Download size={14} />
            <span>다운로드</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabBar">
        <button
          type="button"
          onClick={() => setActiveTab('schema')}
          className={`tabItem ${activeTab === 'schema' ? 'tabItemActive' : ''}`}
        >
          <Database size={15} />
          <span>1. Database ({result.schema.filename})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('backend')}
          className={`tabItem ${activeTab === 'backend' ? 'tabItemActive' : ''}`}
        >
          <Server size={15} />
          <span>2. Backend ({result.backend.filename})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('frontend')}
          className={`tabItem ${activeTab === 'frontend' ? 'tabItemActive' : ''}`}
        >
          <Layout size={15} />
          <span>3. Frontend ({result.frontend.filename})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('guide')}
          className={`tabItem ${activeTab === 'guide' ? 'tabItemActive' : ''}`}
        >
          <FileText size={15} />
          <span>4. 3분 적용 가이드</span>
        </button>
      </div>

      {/* File Info Bar */}
      <div className="fileInfoBar">
        <div className="fileInfoLeft">
          <span className="filePathBadge">
            📁 {activeTab === 'guide' ? 'README.md' : currentFile?.path}
          </span>
          <span className="fileDesc">
            {activeTab === 'guide'
              ? '프로젝트에 바로 적용할 수 있는 단계별 가이드'
              : currentFile?.description}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopyCurrent}
          className={`copyCurrentBtn ${copiedTab === activeTab ? 'copyCurrentBtnDone' : ''}`}
        >
          {copiedTab === activeTab ? <Check size={13} /> : <Copy size={13} />}
          <span>{copiedTab === activeTab ? '복사됨!' : '이 파일 복사'}</span>
        </button>
      </div>

      {/* Code / Markdown Display */}
      <div className="codeBox">
        {activeTab === 'guide' ? (
          <div className="markdownViewer">
            <pre className="whitespace-pre-wrap font-sans text-sm text-slate-800 leading-relaxed">
              {result.guide.markdown}
            </pre>
          </div>
        ) : (
          <pre className="codePre">
            <code>{currentFile?.code}</code>
          </pre>
        )}
      </div>
    </div>
  )
}
