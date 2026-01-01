import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { UpvoteButton } from '@/components/tools/upvote-button'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// We need to re-mock useSession for each test scenario
const mockUseSession = vi.fn()
vi.mock('@/lib/auth-client', () => ({
  useSession: () => mockUseSession(),
}))

describe('UpvoteButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockReset()
    // Default: user not logged in
    mockUseSession.mockReturnValue({
      data: null,
      isPending: false,
      error: null,
    })
  })

  it('should render with initial count', () => {
    render(<UpvoteButton toolId="1" initialCount={10} />)
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('should render upvote button', () => {
    render(<UpvoteButton toolId="1" initialCount={5} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should show error toast when not logged in', async () => {
    const { toast } = await import('sonner')
    render(<UpvoteButton toolId="1" initialCount={5} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(toast.error).toHaveBeenCalledWith('Connectez-vous pour voter', expect.any(Object))
  })

  it('should have outline variant when not voted', () => {
    render(<UpvoteButton toolId="1" initialCount={5} initialHasUpvoted={false} />)
    const button = screen.getByRole('button')
    // Check for outline variant class
    expect(button.className).toContain('border')
  })

  it('should have different styling when voted', () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: 'user1', email: 'test@test.com' } },
      isPending: false,
      error: null,
    })

    render(<UpvoteButton toolId="1" initialCount={5} initialHasUpvoted={true} />)
    const button = screen.getByRole('button')
    // When voted, should have bg-primary class
    expect(button.className).toContain('bg-primary')
  })

  it('should optimistically update count on click when logged in', async () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: 'user1', email: 'test@test.com' } },
      isPending: false,
      error: null,
    })

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, action: 'added', upvoteCount: 6, hasUpvoted: true }),
    })

    render(<UpvoteButton toolId="1" initialCount={5} initialHasUpvoted={false} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    // Optimistic update should show 6 immediately
    await waitFor(() => {
      expect(screen.getByText('6')).toBeInTheDocument()
    })
  })

  it('should revert on API error', async () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: 'user1', email: 'test@test.com' } },
      isPending: false,
      error: null,
    })

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Server error' }),
    })

    render(<UpvoteButton toolId="1" initialCount={5} initialHasUpvoted={false} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    // Should revert back to 5 after error
    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument()
    })
  })

  it('should disable button while loading', async () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: 'user1', email: 'test@test.com' } },
      isPending: false,
      error: null,
    })

    // Create a promise that we can control
    let resolvePromise: (value: unknown) => void
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve
    })

    mockFetch.mockReturnValueOnce(pendingPromise)

    render(<UpvoteButton toolId="1" initialCount={5} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    // Button should be disabled during loading
    expect(button).toBeDisabled()

    // Resolve to cleanup
    resolvePromise!({
      ok: true,
      json: () => Promise.resolve({ success: true, action: 'added', upvoteCount: 6, hasUpvoted: true }),
    })
  })

  it('should accept different sizes', () => {
    const { rerender } = render(<UpvoteButton toolId="1" initialCount={5} size="sm" />)
    expect(screen.getByRole('button')).toBeInTheDocument()

    rerender(<UpvoteButton toolId="1" initialCount={5} size="lg" />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(<UpvoteButton toolId="1" initialCount={5} className="custom-class" />)
    const button = screen.getByRole('button')
    expect(button.className).toContain('custom-class')
  })

  it('should fetch upvote status when user logs in', async () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: 'user1', email: 'test@test.com' } },
      isPending: false,
      error: null,
    })

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ hasUpvoted: true, upvoteCount: 10 }),
    })

    render(<UpvoteButton toolId="1" initialCount={5} />)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/upvote?toolId=1')
    })
  })
})
