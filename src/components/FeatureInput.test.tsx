import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { FeatureInput } from './FeatureInput.tsx'

describe('FeatureInput', () => {
  it('updates input when clicking a preset idea and calls onBuild on submit', () => {
    const onBuildMock = vi.fn()
    render(<FeatureInput onBuild={onBuildMock} isBuilding={false} />)

    const presetBtn = screen.getByText('👤 프로필 사진 & 닉네임 수정')
    fireEvent.click(presetBtn)

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(textarea.value).toContain('프로필 사진과 닉네임을 수정하는 기능')

    const submitBtn = screen.getByRole('button', { name: /원샷 풀스택 빌드/ })
    fireEvent.click(submitBtn)

    expect(onBuildMock).toHaveBeenCalledWith('사용자가 구글 로그인 후 프로필 사진과 닉네임을 수정하는 기능')
  })
})
