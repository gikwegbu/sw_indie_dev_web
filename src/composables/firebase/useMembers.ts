import type { Member } from '@/types'
import { useCollection } from './useCollection'

export function useMembers() {
  return useCollection<Member>('members')
}
