export type TechStack = 'nextjs-supabase' | 'vite-fastapi' | 'react-express'

export interface TechStackInfo {
  id: TechStack
  name: string
  db: string
  backend: string
  frontend: string
  badge: string
}

export interface PipelineStep {
  id: 'schema' | 'backend' | 'frontend' | 'guide'
  title: string
  description: string
  status: 'idle' | 'running' | 'completed' | 'error'
  detail?: string
}

export interface GeneratedCodeFile {
  filename: string
  path: string
  language: string
  code: string
  description: string
}

export interface FeatureResult {
  id: string
  userGoal: string
  techStack: TechStack
  title: string
  summary: string
  schema: GeneratedCodeFile
  backend: GeneratedCodeFile
  frontend: GeneratedCodeFile
  guide: {
    markdown: string
    npmPackages: string[]
  }
  generatedAt: string
}
