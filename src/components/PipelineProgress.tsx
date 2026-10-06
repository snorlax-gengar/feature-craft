import React from 'react'
import { CheckCircle2, Loader2, Database, Server, Layout, FileText } from 'lucide-react'
import type { PipelineStep } from '../types/feature.ts'

interface PipelineProgressProps {
  steps: PipelineStep[]
}

const STEP_ICONS = {
  schema: Database,
  backend: Server,
  frontend: Layout,
  guide: FileText,
}

export const PipelineProgress: React.FC<PipelineProgressProps> = ({ steps }) => {
  const completedCount = steps.filter((s) => s.status === 'completed').length
  const progressPercent = Math.round((completedCount / steps.length) * 100)

  return (
    <div className="pipelineContainer">
      <div className="pipelineHeader">
        <div>
          <h3 className="pipelineTitle">자율 멀티 에이전트 파이프라인 가동 중</h3>
          <p className="pipelineSubtitle">
            각 에이전트가 앞 단계의 산출물을 인계받아 변수명이 100% 일치하도록 연속 생성합니다.
          </p>
        </div>
        <div className="pipelinePercentBadge">{progressPercent}%</div>
      </div>

      <div className="progressBarTrack">
        <div className="progressBarFill" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="stepsGrid">
        {steps.map((step, idx) => {
          const Icon = STEP_ICONS[step.id]
          const isDone = step.status === 'completed'
          const isRunning = step.status === 'running'
          const isError = step.status === 'error'

          return (
            <div
              key={step.id}
              className={`stepCard ${
                isDone
                  ? 'stepCardDone'
                  : isRunning
                  ? 'stepCardRunning'
                  : isError
                  ? 'stepCardError'
                  : 'stepCardIdle'
              }`}
            >
              <div className="stepCardTop">
                <div className="stepIconWrap">
                  <Icon size={16} />
                </div>
                <span className="stepNumber">0{idx + 1}</span>
              </div>

              <div className="stepBody">
                <h4 className="stepTitleText">{step.title}</h4>
                <p className="stepDescText">{step.description}</p>
                {step.detail && <p className="stepDetailText">{step.detail}</p>}
              </div>

              <div className="stepStatusBadge">
                {isDone ? (
                  <span className="text-emerald-600 flex items-center gap-1 font-semibold text-xs">
                    <CheckCircle2 size={13} />
                    완료
                  </span>
                ) : isRunning ? (
                  <span className="text-blue-600 flex items-center gap-1 font-semibold text-xs">
                    <Loader2 size={13} className="animate-spin" />
                    생성 중
                  </span>
                ) : isError ? (
                  <span className="text-rose-600 font-semibold text-xs">에러 발생</span>
                ) : (
                  <span className="text-slate-400 text-xs">대기</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
