import React, { useState } from 'react'
import {
  Monitor,
  Smartphone,
  Sparkles,
  Heart,
  Send,
  User,
} from 'lucide-react'
import { Button } from 'gengarileo-design-system'
import type { FeatureResult } from '../types/feature.ts'

interface InteractiveLivePreviewProps {
  result: FeatureResult
}

export const InteractiveLivePreview: React.FC<InteractiveLivePreviewProps> = ({ result }) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop')

  // Profile Mock State
  const [nickname, setNickname] = useState('바이브코더')
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80')
  const [isSaving, setIsSaving] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Comments Mock State
  const [comments, setComments] = useState<Array<{ id: number; author: string; text: string; time: string }>>([
    { id: 1, author: '민수', text: '오 이거 진짜 완성품처럼 동작하네요!', time: '10분 전' },
    { id: 2, author: '지은', text: 'Supabase 연동 코드랑 변수명 딱 맞아서 소름...', time: '3분 전' },
  ])
  const [newComment, setNewComment] = useState('')
  const [likeCount, setLikeCount] = useState(12)
  const [isLiked, setIsLiked] = useState(false)

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)
    setToastMessage(null)

    setTimeout(() => {
      setIsSaving(false)
      setToastMessage(`✓ "${nickname}" 프로필이 안전하게 저장되었습니다!`)
      setTimeout(() => setToastMessage(null), 3500)
    }, 600)
  }

  function handleAddComment(e: React.FormEvent) {
    e.preventDefault()
    if (!newComment.trim()) return
    setComments((prev) => [
      ...prev,
      { id: Date.now(), author: nickname || '익명', text: newComment.trim(), time: '방금 전' },
    ])
    setNewComment('')
  }

  function handleToggleLike() {
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const isCommentFeature = result.userGoal.includes('댓글') || result.userGoal.includes('좋아요')

  return (
    <div className="previewContainer">
      {/* Browser Chrome Header */}
      <div className="browserHeader">
        <div className="browserDots">
          <span className="dot dotRed" />
          <span className="dot dotYellow" />
          <span className="dot dotGreen" />
        </div>

        <div className="browserUrlBar">
          <span className="text-slate-400">🔒 https://my-app.local/</span>
          <span className="text-slate-800 font-medium">
            {isCommentFeature ? 'posts/1' : 'profile/edit'}
          </span>
        </div>

        <div className="deviceToggleGroup">
          <button
            type="button"
            onClick={() => setDeviceMode('desktop')}
            className={`deviceBtn ${deviceMode === 'desktop' ? 'deviceBtnActive' : ''}`}
            title="데스크톱 뷰"
          >
            <Monitor size={14} />
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode('mobile')}
            className={`deviceBtn ${deviceMode === 'mobile' ? 'deviceBtnActive' : ''}`}
            title="모바일 뷰"
          >
            <Smartphone size={14} />
          </button>
        </div>
      </div>

      {/* Live Preview Viewport */}
      <div className="previewViewport">
        <div
          className={`previewFrame ${
            deviceMode === 'mobile' ? 'previewFrameMobile' : 'previewFrameDesktop'
          }`}
        >
          {isCommentFeature ? (
            /* Comment & Like Interactive Mockup */
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-lg mx-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                    FC
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">FeatureCraft 개발 일지</h4>
                    <p className="text-xs text-slate-400">자율 풀스택 기능 빌더 시연</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleToggleLike}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isLiked
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Heart size={14} className={isLiked ? 'fill-rose-500 text-rose-500' : ''} />
                  <span>{likeCount}</span>
                </button>
              </div>

              {/* Comments List */}
              <div className="space-y-3 mb-5 max-h-52 overflow-y-auto pr-1">
                {comments.map((c) => (
                  <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-800">{c.author}</span>
                      <span className="text-[10px] text-slate-400">{c.time}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{c.text}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="댓글을 직접 입력해 보세요..."
                  className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  disabled={!newComment.trim()}
                  leftIcon={<Send size={12} />}
                >
                  등록
                </Button>
              </form>
            </div>
          ) : (
            /* Profile Edit Interactive Mockup */
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-md mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">내 프로필 설정</h3>
                  <p className="text-xs text-slate-500">실시간으로 직접 변경사항을 저장해 보세요.</p>
                </div>
                <span className="previewLiveBadge">
                  실시간 인터랙티브
                </span>
              </div>

              {/* Avatar Picker */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200 flex items-center justify-center shrink-0 shadow-inner">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={28} className="text-slate-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-700 mb-1.5">아바타 빠른 선택</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80')}
                      className="px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 text-slate-700 font-medium"
                    >
                      사진 1
                    </button>
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80')}
                      className="px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 text-slate-700 font-medium"
                    >
                      사진 2
                    </button>
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('')}
                      className="px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 text-slate-700 font-medium"
                    >
                      기본 아이콘
                    </button>
                  </div>
                </div>
              </div>

              {/* Nickname Form */}
              <form onSubmit={handleSaveProfile}>
                <div className="mb-5">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">닉네임</label>
                  <input
                    type="text"
                    required
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="2자 이상 입력..."
                  />
                </div>

                {toastMessage && (
                  <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-medium animate-fadeIn">
                    {toastMessage}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  fullWidth={true}
                  disabled={isSaving || !nickname.trim()}
                  isLoading={isSaving}
                  leftIcon={!isSaving ? <Sparkles size={14} /> : undefined}
                >
                  {isSaving ? '서버에 저장 중...' : '변경사항 저장하기 (직접 클릭)'}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
