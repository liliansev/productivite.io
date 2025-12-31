'use client'

import { InstantSearch, Configure } from 'react-instantsearch'
import { searchClient, TOOLS_INDEX } from '@/lib/algolia'

interface AlgoliaProviderProps {
  children: React.ReactNode
}

export function AlgoliaProvider({ children }: AlgoliaProviderProps) {
  // Ne pas rendre si les clés Algolia ne sont pas configurées
  if (!process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || !process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY) {
    return <>{children}</>
  }

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={TOOLS_INDEX}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
    >
      <Configure hitsPerPage={10} />
      {children}
    </InstantSearch>
  )
}
