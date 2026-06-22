import { ref, watch } from 'vue'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { useDocument } from './useDocument'

export interface SocialLinks {
  instagram: string
  facebook: string
  twitter: string
  linkedin: string
}

interface SettingsDoc {
  id: string
  socials: SocialLinks
}

export function useSettings() {
  const { doc: settingsDoc, loading, error } = useDocument<SettingsDoc>('settings', 'global')
  
  const socials = ref<SocialLinks>({
    instagram: '#',
    facebook: '#',
    twitter: '#',
    linkedin: '#',
  })

  watch(settingsDoc, (newDoc) => {
    if (newDoc && newDoc.socials) {
      socials.value = {
        instagram: newDoc.socials.instagram || '#',
        facebook: newDoc.socials.facebook || '#',
        twitter: newDoc.socials.twitter || '#',
        linkedin: newDoc.socials.linkedin || '#',
      }
    }
  }, { immediate: true })

  const update = async (data: Partial<SocialLinks>) => {
    const docRef = doc(db, 'settings', 'global')
    const newSocials = { ...socials.value, ...data }
    await setDoc(docRef, { socials: newSocials }, { merge: true })
  }

  return { socials, loading, error, update }
}
