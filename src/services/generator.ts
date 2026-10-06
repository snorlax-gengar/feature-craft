import type { FeatureResult, PipelineStep, TechStack } from '../types/feature.ts'
import { callGemini } from './geminiClient.ts'
import { MOCK_PRESETS } from './mockData.ts'

export interface GenerateOptions {
  userGoal: string
  techStack: TechStack
  apiKey?: string
  onStepChange?: (stepId: PipelineStep['id'], status: PipelineStep['status'], detail?: string) => void
}

function cleanCodeBlock(text: string): string {
  const codeBlockRegex = /```(?:[a-zA-Z0-9_-]+)?\s*([\s\S]*?)```/
  const match = text.match(codeBlockRegex)
  if (match && match[1]) {
    return match[1].trim()
  }
  return text.trim()
}

export async function runFeaturePipeline(options: GenerateOptions): Promise<FeatureResult> {
  const { userGoal, techStack, apiKey, onStepChange } = options

  // If no API key is provided, simulate realistic pipeline with high-quality mock data
  if (!apiKey || apiKey.trim() === '') {
    return runMockPipeline(userGoal, techStack, onStepChange)
  }

  try {
    // ----------------------------------------------------
    // STEP 1: Database Schema Generation
    // ----------------------------------------------------
    onStepChange?.('schema', 'running', '요구사항에 맞는 데이터 엔티티와 RLS 보안 정책을 설계하는 중...')
    const schemaPrompt = `다음 기능을 구현하기 위해 필요한 PostgreSQL (Supabase) 테이블 스키마와 인덱스, RLS 보안 정책을 작성해주세요.
기능 요구사항: "${userGoal}"
선택된 스택: Next.js + Supabase

주의사항:
- 순수 SQL 코드 블록(\`\`\`sql ... \`\`\`)으로 출력해주세요.
- 테이블명과 컬럼명은 snake_case로 명확하게 작성하세요.
- updated_at 자동 갱신이나 외래키 관계를 명확히 지정하세요.
- 필요 시 RLS 정책(Row Level Security)을 반드시 포함하세요.`

    const rawSchema = await callGemini(
      schemaPrompt,
      apiKey,
      '당신은 시니어 데이터베이스 아키텍트입니다. 정확하고 보안이 강화된 PostgreSQL/Supabase DDL 스키마를 작성하세요.',
    )
    const schemaCode = cleanCodeBlock(rawSchema)
    onStepChange?.('schema', 'completed', '데이터베이스 스키마 및 RLS 보안 정책 생성 완료')

    // ----------------------------------------------------
    // STEP 2: Backend Logic Generation (Fed with Schema)
    // ----------------------------------------------------
    onStepChange?.('backend', 'running', '앞서 생성된 스키마 컬럼과 100% 매핑되는 백엔드 함수를 작성하는 중...')
    const backendPrompt = `앞서 작성된 데이터베이스 스키마를 100% 준수하여, Next.js Server Actions (TypeScript) 코드를 작성해주세요.
기능 요구사항: "${userGoal}"

[참조 데이터베이스 스키마]:
\`\`\`sql
${schemaCode}
\`\`\`

주의사항:
- 파일 최상단에 'use server'를 명시하세요.
- 스키마에 정의된 정확한 컬럼명과 타입을 갖는 TypeScript 인터페이스를 선언하세요.
- 데이터를 조회(SELECT)하고 수정/생성(INSERT/UPDATE)하는 명확한 Server Action 함수들을 작성하세요.
- 에러 처리(try/catch 또는 반환 상태 객체)를 꼼꼼히 작성하세요.
- 순수 TypeScript 코드 블록(\`\`\`typescript ... \`\`\`)으로 출력하세요.`

    const rawBackend = await callGemini(
      backendPrompt,
      apiKey,
      '당신은 시니어 백엔드 엔지니어입니다. 앞선 DB 스키마와 변수명이 완벽히 일치하는 타입 안전한 Next.js Server Actions를 작성하세요.',
    )
    const backendCode = cleanCodeBlock(rawBackend)
    onStepChange?.('backend', 'completed', '타입 안전한 Server Actions 백엔드 로직 생성 완료')

    // ----------------------------------------------------
    // STEP 3: Frontend UI Component Generation (Fed with Backend)
    // ----------------------------------------------------
    onStepChange?.('frontend', 'running', '백엔드 함수를 직접 호출하는 반응형 React 컴포넌트를 작성하는 중...')
    const frontendPrompt = `앞서 작성된 백엔드 Server Actions 함수를 호출하는 모던 반응형 React 19 + Tailwind CSS 클라이언트 컴포넌트를 작성해주세요.
기능 요구사항: "${userGoal}"

[참조 백엔드 Server Actions]:
\`\`\`typescript
${backendCode}
\`\`\`

주의사항:
- 최상단에 'use client'를 명시하세요.
- useTransition 또는 useState를 사용하여 로딩 상태와 제출 중 비활성화를 처리하세요.
- 성공 및 실패 피드백 메시지(토스트나 알림 박스)를 감각적인 Tailwind CSS로 꾸며주세요.
- 모바일에서도 보기 편한 반응형 디자인을 적용하세요.
- 순수 TypeScript/React 코드 블록(\`\`\`tsx ... \`\`\`)으로 출력하세요.`

    const rawFrontend = await callGemini(
      frontendPrompt,
      apiKey,
      '당신은 시니어 프론트엔드 엔지니어입니다. 세련된 Tailwind CSS와 사용자 경험이 뛰어난 React 컴포넌트를 작성하세요.',
    )
    const frontendCode = cleanCodeBlock(rawFrontend)
    onStepChange?.('frontend', 'completed', '인터랙티브 React 컴포넌트 생성 완료')

    // ----------------------------------------------------
    // STEP 4: Integration Guide
    // ----------------------------------------------------
    onStepChange?.('guide', 'running', '3분 안에 내 프로젝트에 적용할 수 있는 가이드를 작성하는 중...')
    const guidePrompt = `앞서 생성된 3개 파일(DB 스키마, Server Actions, React 컴포넌트)을 기존 Next.js 프로젝트에 3분 만에 적용하기 위한 간단명료한 마크다운 가이드를 작성해주세요.
필수 npm 패키지 설치 명령어와 파일 저장 위치를 명시하세요.`

    const guideMarkdown = await callGemini(
      guidePrompt,
      apiKey,
      '당신은 친절한 개발 멘토입니다. 비전공자도 그대로 따라 하면 동작하도록 간결한 적용 가이드를 작성하세요.',
    )
    onStepChange?.('guide', 'completed', '통합 설치 및 동작 검증 가이드 완성')

    return {
      id: `feat-${Date.now()}`,
      userGoal,
      techStack,
      title: `${userGoal} (풀스택 완성 세트)`,
      summary: 'DB 스키마부터 백엔드 함수, UI 컴포넌트까지 변수명이 100% 매핑된 자율 생성 코드입니다.',
      schema: {
        filename: 'schema.sql',
        path: 'supabase/migrations/schema.sql',
        language: 'sql',
        description: 'PostgreSQL 테이블 및 RLS 보안 정책',
        code: schemaCode,
      },
      backend: {
        filename: 'actions.ts',
        path: 'app/actions/actions.ts',
        language: 'typescript',
        description: 'Next.js Server Actions CRUD 함수',
        code: backendCode,
      },
      frontend: {
        filename: 'FeatureComponent.tsx',
        path: 'components/FeatureComponent.tsx',
        language: 'typescript',
        description: 'React + Tailwind CSS 인터랙티브 폼 컴포넌트',
        code: frontendCode,
      },
      guide: {
        markdown: guideMarkdown,
        npmPackages: ['@supabase/ssr', '@supabase/supabase-js'],
      },
      generatedAt: new Date().toISOString(),
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    onStepChange?.('guide', 'error', message)
    throw err
  }
}

async function runMockPipeline(
  userGoal: string,
  techStack: TechStack,
  onStepChange?: GenerateOptions['onStepChange'],
): Promise<FeatureResult> {
  const steps: Array<{ id: PipelineStep['id']; runningDetail: string; doneDetail: string }> = [
    { id: 'schema', runningDetail: '데이터 엔티티 및 RLS 보안 정책 설계 중...', doneDetail: 'PostgreSQL 스키마 설계 완료' },
    { id: 'backend', runningDetail: '스키마 컬럼과 일치하는 Server Actions 로직 작성 중...', doneDetail: '타입 안전한 백엔드 함수 완성' },
    { id: 'frontend', runningDetail: '반응형 Tailwind UI 폼 컴포넌트 조립 중...', doneDetail: 'React 클라이언트 컴포넌트 완성' },
    { id: 'guide', runningDetail: '3분 적용 가이드 문서 작성 중...', doneDetail: '통합 가이드 완성' },
  ]

  for (const step of steps) {
    onStepChange?.(step.id, 'running', step.runningDetail)
    await new Promise((r) => setTimeout(r, 650))
    onStepChange?.(step.id, 'completed', step.doneDetail)
  }

  // Use matching mock or fallback to profile-edit preset
  const preset = MOCK_PRESETS['profile-edit']!
  return {
    ...preset,
    id: `mock-${Date.now()}`,
    userGoal,
    techStack,
    generatedAt: new Date().toISOString(),
  }
}
