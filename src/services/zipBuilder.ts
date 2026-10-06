import JSZip from 'jszip'
import type { FeatureResult } from '../types/feature.ts'

export async function createProjectZip(result: FeatureResult): Promise<Blob> {
  const zip = new JSZip()
  const projectName = 'my-feature-app'
  const root = zip.folder(projectName) ?? zip

  // 1. package.json
  root.file(
    'package.json',
    JSON.stringify(
      {
        name: projectName,
        version: '0.1.0',
        private: true,
        scripts: {
          dev: 'next dev',
          build: 'next build',
          start: 'next start',
          lint: 'next lint',
        },
        dependencies: {
          react: '^19.0.0',
          'react-dom': '^19.0.0',
          next: '^15.1.0',
          'lucide-react': '^1.16.0',
          '@supabase/supabase-js': '^2.49.0',
          '@supabase/ssr': '^0.5.2',
        },
        devDependencies: {
          typescript: '^5.7.2',
          '@types/node': '^22.0.0',
          '@types/react': '^19.0.0',
          '@types/react-dom': '^19.0.0',
          postcss: '^8.4.49',
          tailwindcss: '^3.4.17',
          autoprefixer: '^10.4.20',
        },
      },
      null,
      2,
    ),
  )

  // 2. tsconfig.json
  root.file(
    'tsconfig.json',
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2017',
          lib: ['dom', 'dom.iterable', 'esnext'],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          module: 'esnext',
          moduleResolution: 'bundler',
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: 'preserve',
          incremental: true,
          plugins: [{ name: 'next' }],
          paths: {
            '@/*': ['./*'],
          },
        },
        include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
        exclude: ['node_modules'],
      },
      null,
      2,
    ),
  )

  // 3. tailwind.config.js & postcss.config.js
  root.file(
    'tailwind.config.js',
    `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`,
  )

  root.file(
    'postcss.config.js',
    `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`,
  )

  // 4. .env.example
  root.file(
    '.env.example',
    `NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
`,
  )

  // 5. .gitignore
  root.file(
    '.gitignore',
    `node_modules
.next
.env.local
.env
dist
`,
  )

  // 6. Supabase Schema
  root.file(result.schema.path, result.schema.code)

  // 7. Backend Action
  root.file(result.backend.path, result.backend.code)

  // 8. Frontend Component
  root.file(result.frontend.path, result.frontend.code)

  // 9. App Layout
  root.file(
    'app/layout.tsx',
    `import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '${result.title}',
  description: '${result.summary}',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="bg-slate-50 min-h-screen text-slate-900 antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
`,
  )

  // 10. App Page
  root.file(
    'app/page.tsx',
    `import React from 'react'

export default function HomePage() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <header className="text-center mb-10">
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full mb-3">
          FeatureCraft Generated Project
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
          ${result.title}
        </h1>
        <p className="text-sm text-slate-600">
          ${result.summary}
        </p>
      </header>

      {/* Feature Component Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <p className="text-xs font-semibold text-slate-400 mb-4 uppercase tracking-wider">
          컴포넌트 렌더링 위치
        </p>
        <p className="text-sm text-slate-700">
          이 프로젝트를 실행한 후 <code>components/</code> 안의 컴포넌트를 여기에 불러와 연결하세요.
        </p>
      </div>
    </main>
  )
}
`,
  )

  // 11. globals.css
  root.file(
    'app/globals.css',
    `@tailwind base;
@tailwind components;
@tailwind utilities;
`,
  )

  // 12. README.md
  root.file(
    'README.md',
    `# 🚀 ${result.title}

> ${result.summary}
> FeatureCraft(AI 원샷 풀스택 기능 빌더)로 자동 생성된 완전한 Next.js 프로젝트입니다.

---

## ⚡ 빠른 시작 (3분 안에 로컬 실행하기)

### 1. 패키지 설치
\`\`\`bash
npm install
\`\`\`

### 2. 데이터베이스 설정 (Supabase)
1. Supabase 대시보드 ➔ **SQL Editor**로 이동합니다.
2. \`${result.schema.path}\` 파일의 내용을 복사하여 실행합니다.

### 3. 환경변수 설정
\`\`\`bash
cp .env.example .env.local
\`\`\`
\`.env.local\` 파일에 본인의 Supabase Project URL과 Anon Key를 입력합니다.

### 4. 로컬 서버 시작
\`\`\`bash
npm run dev
\`\`\`
브라우저에서 **http://localhost:3000** 에 접속하여 기능을 확인하세요!
`,
  )

  return await zip.generateAsync({ type: 'blob' })
}
