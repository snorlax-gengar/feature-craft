import React from 'react'
import { Database, Server, Layout, FileText } from 'lucide-react'
import { Card, Badge } from 'gengarileo-design-system'
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
    <Card variant="default" padding="lg" className="pipelineContainer">
      <div className="pipelineHeader">
        <div>
          <h3 className="pipelineTitle">자율 멀티 에이전트 파이프라인 가동 중</h3>
          <p className="pipelineSubtitle">
            각 에이전트가 앞 단계의 산출물을 인계받아 변수명이 100% 일치하도록 연속 생성합니다.
          </p>
        </div>
        <Badge variant="lavender" size="md">
          {progressPercent}%
        </Badge>
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
                  <Badge variant="sky" size="sm" dot={true}>
                    완료
                  </Badge>
                ) : isRunning ? (
                  <Badge variant="lavender" size="sm" dot={true}>
                    생성 중
                  </Badge>
                ) : isError ? (
                  <Badge variant="coral" size="sm">
                    에러 발생
                  </Badge>
                ) : (
                  <Badge variant="slate" size="sm">
                    대기
                  </Badge>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
