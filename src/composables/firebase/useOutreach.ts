import type { OutreachActivity } from '@/types'
import { useCollection } from './useCollection'

export function useOutreach() {
  return useCollection<OutreachActivity>('outreach')
}
