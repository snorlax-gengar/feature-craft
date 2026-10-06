import { describe, expect, it } from 'vitest'
import { runFeaturePipeline } from './generator.ts'

describe('runFeaturePipeline (Mock Pipeline Mode)', () => {
  it('completes all 4 pipeline steps and returns integrated fullstack files', async () => {
    const stepChanges: Array<{ id: string; status: string; detail?: string }> = []

    const result = await runFeaturePipeline({
      userGoal: '사용자 프로필 수정 기능',
      techStack: 'nextjs-supabase',
      apiKey: '', // empty key triggers mock pipeline
      onStepChange: (id, status, detail) => {
        stepChanges.push({ id, status, detail })
      },
    })

    expect(result).toBeDefined()
    expect(result.schema.filename).toBe('schema.sql')
    expect(result.backend.filename).toBe('profileActions.ts')
    expect(result.frontend.filename).toBe('ProfileEditForm.tsx')
    expect(result.schema.code).toContain('CREATE TABLE public.profiles')
    expect(result.backend.code).toContain('updateProfile')
    expect(result.frontend.code).toContain('ProfileEditForm')
    expect(result.guide.markdown).toContain('3분 만에 적용하는 가이드')

    // Verify all 4 steps progressed through running and completed
    const completedSteps = stepChanges.filter((s) => s.status === 'completed')
    expect(completedSteps.map((s) => s.id)).toEqual(['schema', 'backend', 'frontend', 'guide'])
  })
})
