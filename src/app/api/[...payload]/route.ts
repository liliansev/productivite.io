/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '@payload-config'
import {
  REST_DELETE,
  REST_GET,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'

// Type workaround for Next.js 15 compatibility
export const GET = REST_GET(config) as any
export const POST = REST_POST(config) as any
export const DELETE = REST_DELETE(config) as any
export const PATCH = REST_PATCH(config) as any
export const PUT = REST_PUT(config) as any
