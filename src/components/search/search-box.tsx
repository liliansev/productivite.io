'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchBox, useHits } from 'react-instantsearch'
import { Search, X, Loader2 } from 'lucide-react'
import Link from 'next/link'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AlgoliaToolRecord } from '@/lib/algolia'

interface SearchBoxProps {
  className?: string
  placeholder?: string
  onClose?: () => void
}

export function SearchBox({ className, placeholder = 'Rechercher un outil...', onClose }: SearchBoxProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { query, refine, clear, isSearchStalled } = useSearchBox()
  const { hits } = useHits<AlgoliaToolRecord>()

  const showResults = isOpen && query.length > 0

  // Fermer quand on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Raccourcis clavier
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Cmd/Ctrl + K pour focus
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
        setIsOpen(true)
      }
      // Escape pour fermer
      if (event.key === 'Escape') {
        setIsOpen(false)
        inputRef.current?.blur()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    refine(e.target.value)
    setIsOpen(true)
  }, [refine])

  const handleClear = useCallback(() => {
    clear()
    inputRef.current?.focus()
  }, [clear])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (query) {
      router.push(`/tools?q=${encodeURIComponent(query)}`)
      setIsOpen(false)
      onClose?.()
    }
  }, [query, router, onClose])

  const handleHitClick = useCallback(() => {
    setIsOpen(false)
    clear()
    onClose?.()
  }, [clear, onClose])

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="search"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="w-full pl-9 pr-20"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {isSearchStalled && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleClear}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Effacer</span>
              </Button>
            )}
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </form>

      {/* Résultats de recherche */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-lg border bg-background shadow-lg z-50 max-h-[60vh] overflow-y-auto">
          {hits.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Aucun résultat pour "{query}"
            </div>
          ) : (
            <ul className="py-2">
              {hits.slice(0, 5).map((hit) => (
                <li key={hit.objectID}>
                  <Link
                    href={`/tools/${hit.slug}`}
                    onClick={handleHitClick}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-sm font-medium">
                      {hit.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{hit.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {hit.tagline}
                      </p>
                    </div>
                    {hit.category && (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        {hit.category.name}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
              {hits.length > 5 && (
                <li className="border-t">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full px-4 py-3 text-sm text-center text-primary hover:bg-muted transition-colors"
                  >
                    Voir tous les résultats ({hits.length})
                  </button>
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
