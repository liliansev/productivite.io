'use client'

import { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useSession } from '@/lib/auth-client'

interface UpvoteButtonProps {
  toolId: string
  initialCount: number
  initialHasUpvoted?: boolean
  className?: string
  size?: 'sm' | 'default' | 'lg'
}

export function UpvoteButton({
  toolId,
  initialCount,
  initialHasUpvoted = false,
  className,
  size = 'sm',
}: UpvoteButtonProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [count, setCount] = useState(initialCount)
  const [hasVoted, setHasVoted] = useState(initialHasUpvoted)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch initial upvote status when user is logged in
  useEffect(() => {
    if (session?.user && !initialHasUpvoted) {
      fetch(`/api/upvote?toolId=${toolId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.hasUpvoted !== undefined) {
            setHasVoted(data.hasUpvoted)
          }
          if (data.upvoteCount !== undefined) {
            setCount(data.upvoteCount)
          }
        })
        .catch(console.error)
    }
  }, [session?.user, toolId, initialHasUpvoted])

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Check if user is logged in
    if (!session?.user) {
      toast.error('Connectez-vous pour voter', {
        action: {
          label: 'Connexion',
          onClick: () => router.push('/login'),
        },
      })
      return
    }

    setIsLoading(true)

    // Optimistic update
    const previousCount = count
    const previousHasVoted = hasVoted

    if (hasVoted) {
      setCount((prev) => prev - 1)
      setHasVoted(false)
    } else {
      setCount((prev) => prev + 1)
      setHasVoted(true)
    }

    try {
      const response = await fetch('/api/upvote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toolId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du vote')
      }

      // Update with server values
      setCount(data.upvoteCount)
      setHasVoted(data.hasUpvoted)

      if (data.action === 'added') {
        toast.success('Vote ajouté !')
      } else {
        toast.success('Vote retiré')
      }
    } catch (error) {
      // Revert optimistic update
      setCount(previousCount)
      setHasVoted(previousHasVoted)
      toast.error(error instanceof Error ? error.message : 'Erreur lors du vote')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={hasVoted ? 'default' : 'outline'}
      size={size}
      onClick={handleUpvote}
      disabled={isLoading}
      className={cn(
        'flex items-center gap-1.5 font-medium transition-all',
        hasVoted && 'bg-primary text-primary-foreground',
        className
      )}
    >
      <ChevronUp
        className={cn(
          'h-4 w-4 transition-transform',
          hasVoted && 'text-primary-foreground'
        )}
      />
      <span>{count}</span>
    </Button>
  )
}
