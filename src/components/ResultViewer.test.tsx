import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ResultViewer } from './ResultViewer.tsx'
import { MOCK_PRESETS } from '../services/mockData.ts'

describe('ResultViewer', () => {
  it('switches between Database, Backend, Frontend, and Guide tabs', () => {
    const onResetMock = vi.fn()
    const mockResult = MOCK_PRESETS['profile-edit']!

    render(<ResultViewer result={mockResult} onReset={onResetMock} />)

    // Initial tab: Database schema
    expect(screen.getByText(/CREATE TABLE public.profiles/)).toBeTruthy()

    // Switch to Backend tab
    const backendTab = screen.getByRole('button', { name: /2. Backend/ })
    fireEvent.click(backendTab)
    expect(screen.getByText(/export async function updateProfile/)).toBeTruthy()

    // Switch to Frontend tab
    const frontendTab = screen.getByRole('button', { name: /3. Frontend/ })
    fireEvent.click(frontendTab)
    expect(screen.getByText(/export function ProfileEditForm/)).toBeTruthy()

    // Switch to Guide tab
    const guideTab = screen.getByRole('button', { name: /4. 3분 적용 가이드/ })
    fireEvent.click(guideTab)
    expect(screen.getByText(/3분 만에 적용하는 가이드/)).toBeTruthy()
  })

  it('calls onReset when clicking 새 기능 만들기', () => {
    const onResetMock = vi.fn()
    const mockResult = MOCK_PRESETS['profile-edit']!

    render(<ResultViewer result={mockResult} onReset={onResetMock} />)
    const resetBtn = screen.getByRole('button', { name: /새 기능 만들기/ })
    fireEvent.click(resetBtn)

    expect(onResetMock).toHaveBeenCalled()
  })
})
