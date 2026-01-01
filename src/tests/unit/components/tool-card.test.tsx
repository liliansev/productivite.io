import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ToolCard } from '@/components/tools/tool-card'
import type { Tool } from '@/types'

const mockTool: Tool = {
  id: '1',
  name: 'Test Tool',
  slug: 'test-tool',
  tagline: 'A great tool for testing',
  description: 'This is a test tool description',
  website: 'https://testtool.com',
  category: {
    id: 'cat1',
    name: 'Productivité',
    slug: 'productivite',
  },
  pricing: 'freemium',
  platforms: ['web', 'mac', 'windows'],
  upvoteCount: 42,
  status: 'published',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
}

describe('ToolCard', () => {
  it('should render tool name', () => {
    render(<ToolCard tool={mockTool} />)
    expect(screen.getByText('Test Tool')).toBeInTheDocument()
  })

  it('should render tool tagline', () => {
    render(<ToolCard tool={mockTool} />)
    expect(screen.getByText('A great tool for testing')).toBeInTheDocument()
  })

  it('should render category badge', () => {
    render(<ToolCard tool={mockTool} />)
    expect(screen.getByText('Productivité')).toBeInTheDocument()
  })

  it('should link to tool detail page', () => {
    render(<ToolCard tool={mockTool} />)
    const link = screen.getByRole('link', { name: /voir test tool/i })
    expect(link).toHaveAttribute('href', '/tools/test-tool')
  })

  it('should render upvote count', () => {
    render(<ToolCard tool={mockTool} />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('should render fallback initial when no logo', () => {
    const toolWithoutLogo = { ...mockTool, logo: undefined }
    render(<ToolCard tool={toolWithoutLogo} />)
    expect(screen.getByText('T')).toBeInTheDocument() // First letter of "Test Tool"
  })

  it('should render logo image when provided', () => {
    const toolWithLogo = { ...mockTool, logo: '/logo.png' }
    render(<ToolCard tool={toolWithLogo} />)
    const img = screen.getByRole('img', { name: 'Test Tool' })
    expect(img).toHaveAttribute('src', '/logo.png')
  })

  it('should render "Voir" text', () => {
    render(<ToolCard tool={mockTool} />)
    expect(screen.getByText('Voir')).toBeInTheDocument()
  })

  it('should render different pricing types', () => {
    const freeTool = { ...mockTool, pricing: 'free' as const }
    const { rerender } = render(<ToolCard tool={freeTool} />)
    expect(screen.getByText('Gratuit')).toBeInTheDocument()

    const paidTool = { ...mockTool, pricing: 'paid' as const }
    rerender(<ToolCard tool={paidTool} />)
    expect(screen.getByText('Payant')).toBeInTheDocument()
  })

  it('should not render platforms section when empty', () => {
    const toolNoPlatforms = { ...mockTool, platforms: [] }
    render(<ToolCard tool={toolNoPlatforms} />)
    // Platform icons should not be present
    expect(screen.queryByLabelText(/web/i)).not.toBeInTheDocument()
  })
})
