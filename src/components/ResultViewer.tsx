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
  Eye,
  FolderTree,
  FileCode,
} from 'lucide-react'
import type { FeatureResult } from '../types/feature.ts'
import { createProjectZip } from '../services/zipBuilder.ts'
import { InteractiveLivePreview } from './InteractiveLivePreview.tsx'
import { Button, Badge, Card } from 'gengarileo-design-system'

interface ResultViewerProps {
  result: FeatureResult
  onReset: () => void
}

type TabKey = 'preview' | 'schema' | 'backend' | 'frontend' | 'guide'

export const ResultViewer: React.FC<ResultViewerProps> = ({ result, onReset }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('preview')
  const [copiedTab, setCopiedTab] = useState<string | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)
  const [isZipping, setIsZipping] = useState(false)

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

  async function handleDownloadZip() {
    setIsZipping(true)
    try {
      const blob = await createProjectZip(result)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `my-feature-app-${result.id}.zip`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to create zip:', err)
      alert('ZIP 파일 생성 중 오류가 발생했습니다.')
    } finally {
      setIsZipping(false)
    }
  }

  return (
    <Card variant="default" padding="none" className="resultContainer">
      {/* Result Top Banner */}
      <div className="resultHeader">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="sky" size="sm" dot={true}>
              실행 가능한 풀스택 프로젝트 생성됨
            </Badge>
            <Badge variant="lavender" size="sm">
              변수명 & 타입 100% 일치
            </Badge>
          </div>
          <h2 className="resultTitle">{result.title}</h2>
          <p className="resultSummary">{result.summary}</p>
        </div>

        <div className="resultHeaderActions">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            leftIcon={<RotateCcw size={14} />}
            className="resetBtn"
          >
            새 기능 만들기
          </Button>

          <Button
            variant={copiedAll ? 'soft-sky' : 'outline'}
            size="sm"
            onClick={handleCopyAll}
            leftIcon={copiedAll ? <Check size={14} /> : <Copy size={14} />}
            className="copyAllBtn"
          >
            {copiedAll ? '복사 완료!' : '전체 코드 복사'}
          </Button>

          {/* Super Prominent ZIP Download Button */}
          <Button
            variant="gradient"
            size="md"
            onClick={handleDownloadZip}
            disabled={isZipping}
            isLoading={isZipping}
            leftIcon={!isZipping ? <Download size={15} /> : undefined}
            className="downloadZipBtn"
          >
            {isZipping ? '프로젝트 압축 중...' : '완전한 프로젝트 ZIP 다운로드'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabBar">
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`tabItem ${activeTab === 'preview' ? 'tabItemActive tabItemPreview' : ''}`}
        >
          <Eye size={15} className="text-blue-500" />
          <span>👀 실시간 인터랙티브 미리보기</span>
        </button>

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
          <span>4. 3분 설치 가이드</span>
        </button>
      </div>

      {/* Main Tab View */}
      {activeTab === 'preview' ? (
        <InteractiveLivePreview result={result} />
      ) : (
        <div className="codeLayoutWrapper">
          {/* File Explorer Tree Sidebar */}
          <aside className="fileTreeSidebar">
            <div className="fileTreeHeader">
              <FolderTree size={14} className="text-slate-400" />
              <span>프로젝트 파일 구조</span>
            </div>
            <ul className="fileTreeList">
              <li
                onClick={() => setActiveTab('schema')}
                className={`fileTreeItem ${activeTab === 'schema' ? 'fileTreeItemActive' : ''}`}
              >
                <FileCode size={13} className="text-amber-500" />
                <span>{result.schema.path}</span>
              </li>
              <li
                onClick={() => setActiveTab('backend')}
                className={`fileTreeItem ${activeTab === 'backend' ? 'fileTreeItemActive' : ''}`}
              >
                <FileCode size={13} className="text-blue-500" />
                <span>{result.backend.path}</span>
              </li>
              <li
                onClick={() => setActiveTab('frontend')}
                className={`fileTreeItem ${activeTab === 'frontend' ? 'fileTreeItemActive' : ''}`}
              >
                <FileCode size={13} className="text-cyan-500" />
                <span>{result.frontend.path}</span>
              </li>
              <li
                onClick={() => setActiveTab('guide')}
                className={`fileTreeItem ${activeTab === 'guide' ? 'fileTreeItemActive' : ''}`}
              >
                <FileText size={13} className="text-emerald-500" />
                <span>README.md (가이드)</span>
              </li>
            </ul>
          </aside>

          {/* Code Content */}
          <div className="codeContentMain">
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

              <Button
                variant={copiedTab === activeTab ? 'soft-sky' : 'outline'}
                size="xs"
                onClick={handleCopyCurrent}
                leftIcon={copiedTab === activeTab ? <Check size={13} /> : <Copy size={13} />}
                className="copyCurrentBtn"
              >
                {copiedTab === activeTab ? '복사됨!' : '이 파일 복사'}
              </Button>
            </div>

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
        </div>
      )}
    </Card>
  )
}
