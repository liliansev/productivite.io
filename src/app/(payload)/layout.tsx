/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import React from 'react'

import './custom.scss'
import { importMap } from './admin/importMap'

type Args = {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Admin - productivite.io',
}

// Server function client wrapper - Payload requires this for admin functionality
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serverFunctionClient = async (args: any) => {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

export default async function Layout({ children }: Args) {
  return (
    <RootLayout
      config={config}
      importMap={importMap}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      serverFunction={serverFunctionClient as any}
    >
      {children}
    </RootLayout>
  )
}
