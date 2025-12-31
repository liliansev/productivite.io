'use server'

import config from '@payload-config'
import { getPayload } from 'payload'

export async function getPayloadInstance() {
  return getPayload({ config })
}
