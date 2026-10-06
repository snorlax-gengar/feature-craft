import { describe, expect, it } from 'vitest'
import { createProjectZip } from './zipBuilder.ts'
import { MOCK_PRESETS } from './mockData.ts'
import JSZip from 'jszip'

describe('createProjectZip', () => {
  it('bundles a complete runnable Next.js project into a zip blob', async () => {
    const mockResult = MOCK_PRESETS['profile-edit']!
    const blob = await createProjectZip(mockResult)

    expect(blob).toBeDefined()
    expect(blob.size).toBeGreaterThan(100)

    // Unpack zip and verify key files exist
    const zip = await JSZip.loadAsync(blob)
    expect(zip.file('my-feature-app/package.json')).toBeDefined()
    expect(zip.file('my-feature-app/tsconfig.json')).toBeDefined()
    expect(zip.file('my-feature-app/app/layout.tsx')).toBeDefined()
    expect(zip.file('my-feature-app/app/page.tsx')).toBeDefined()
    expect(zip.file(`my-feature-app/${mockResult.schema.path}`)).toBeDefined()
    expect(zip.file(`my-feature-app/${mockResult.backend.path}`)).toBeDefined()
    expect(zip.file(`my-feature-app/${mockResult.frontend.path}`)).toBeDefined()
    expect(zip.file('my-feature-app/README.md')).toBeDefined()
  })
})
