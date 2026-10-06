import type { FeatureResult } from '../types/feature.ts'

export const MOCK_PRESETS: Record<string, FeatureResult> = {
  'profile-edit': {
    id: 'profile-edit',
    userGoal: '사용자가 구글 로그인 후 프로필 사진과 닉네임을 수정하는 기능',
    techStack: 'nextjs-supabase',
    title: '유저 프로필 관리 기능 (Profile Management)',
    summary: '구글 OAuth 로그인 후 유저의 프로필 사진 업로드와 닉네임 변경을 완벽하게 처리하는 풀스택 기능 세트입니다.',
    schema: {
      filename: 'schema.sql',
      path: 'supabase/migrations/20261006_create_profiles.sql',
      language: 'sql',
      description: '유저 프로필 테이블 및 Supabase Auth 연동 트리거, RLS 보안 정책',
      code: `-- 1. profiles 테이블 생성
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nickname TEXT NOT NULL CHECK (char_length(nickname) >= 2 AND char_length(nickname) <= 30),
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Row Level Security (RLS) 활성화: 자신의 프로필만 수정 가능
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 3. 구글 로그인 시 자동으로 프로필 행 생성하는 트리거
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', '새 사용자'),
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
`,
    },
    backend: {
      filename: 'profileActions.ts',
      path: 'app/actions/profileActions.ts',
      language: 'typescript',
      description: 'Next.js Server Actions: 프로필 조회 및 닉네임/사진 업데이트 로직',
      code: `'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface Profile {
  id: string
  nickname: string
  avatar_url: string | null
  updated_at: string
}

export interface UpdateProfileState {
  success: boolean
  message: string
}

// 1. 현재 로그인 유저의 프로필 가져오기
export async function getMyProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching profile:', error.message)
    return null
  }
  return data
}

// 2. 프로필 업데이트 Server Action
export async function updateProfile(formData: FormData): Promise<UpdateProfileState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: '로그인이 필요합니다.' }
  }

  const nickname = formData.get('nickname') as string
  const avatar_url = formData.get('avatar_url') as string | null

  if (!nickname || nickname.trim().length < 2) {
    return { success: false, message: '닉네임은 2자 이상이어야 합니다.' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      nickname: nickname.trim(),
      avatar_url: avatar_url || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath('/profile')
  return { success: true, message: '프로필이 성공적으로 업데이트되었습니다!' }
}
`,
    },
    frontend: {
      filename: 'ProfileEditForm.tsx',
      path: 'components/profile/ProfileEditForm.tsx',
      language: 'typescript',
      description: '반응형 아바타 미리보기 및 닉네임 수정 폼 React 컴포넌트',
      code: `'use client'

import React, { useState, useTransition } from 'react'
import { updateProfile, type Profile } from '@/app/actions/profileActions'

interface ProfileEditFormProps {
  initialProfile: Profile
}

export function ProfileEditForm({ initialProfile }: ProfileEditFormProps) {
  const [nickname, setNickname] = useState(initialProfile.nickname)
  const [avatarUrl, setAvatarUrl] = useState(initialProfile.avatar_url || '')
  const [statusMessage, setStatusMessage] = useState<{ text: string; ok: boolean } | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatusMessage(null)

    const formData = new FormData()
    formData.append('nickname', nickname)
    formData.append('avatar_url', avatarUrl)

    startTransition(async () => {
      const result = await updateProfile(formData)
      setStatusMessage({ text: result.message, ok: result.success })
    })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-900 mb-6">프로필 설정</h2>

      {/* 아바타 미리보기 */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl text-slate-400">👤</span>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">아바타 이미지 URL</label>
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://example.com/avatar.png"
            className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 닉네임 입력 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">닉네임</label>
        <input
          type="text"
          required
          minLength={2}
          maxLength={30}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="사용할 닉네임을 입력하세요"
        />
      </div>

      {/* 알림 메시지 */}
      {statusMessage && (
        <div className={\`p-3 rounded-lg text-sm mb-4 \${statusMessage.ok ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}\`}>
          {statusMessage.text}
        </div>
      )}

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg transition-colors disabled:opacity-50"
      >
        {isPending ? '저장 중...' : '변경사항 저장'}
      </button>
    </form>
  )
}
`,
    },
    guide: {
      npmPackages: ['@supabase/ssr', '@supabase/supabase-js'],
      markdown: `### 🚀 3분 만에 적용하는 가이드

1. **패키지 설치**:
   \`\`\`bash
   npm install @supabase/ssr @supabase/supabase-js
   \`\`\`

2. **데이터베이스 적용**:
   - Supabase 대시보드 ➔ **SQL Editor**로 이동합니다.
   - 위의 \`schema.sql\` 코드를 붙여넣고 **Run**을 실행합니다.

3. **파일 복사**:
   - \`profileActions.ts\` ➔ \`app/actions/profileActions.ts\`에 저장합니다.
   - \`ProfileEditForm.tsx\` ➔ \`components/profile/ProfileEditForm.tsx\`에 저장합니다.

4. **페이지에서 불러오기**:
   \`\`\`tsx
   import { getMyProfile } from '@/app/actions/profileActions'
   import { ProfileEditForm } from '@/components/profile/ProfileEditForm'

   export default async function ProfilePage() {
     const profile = await getMyProfile()
     if (!profile) return <div>로그인이 필요합니다.</div>
     return <ProfileEditForm initialProfile={profile} />
   }
   \`\`\`
`,
    },
    generatedAt: new Date().toISOString(),
  },
}
