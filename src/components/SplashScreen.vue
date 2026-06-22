<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const props = defineProps<{
  mediaUrl?: string
}>()

const emit = defineEmits<{
  (e: 'done'): void
}>()

const isFadingOut = ref(false)

const isVideo = computed(() => {
  if (!props.mediaUrl) return false
  const ext = props.mediaUrl.split('.').pop()?.toLowerCase()
  return ext === 'mp4' || ext === 'webm'
})

onMounted(() => {
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
  if (prefersReduced) {
    isFadingOut.value = true
    setTimeout(() => {
      emit('done')
    }, 400)
    return
  }

  // Start fading out after 2.5s (2500ms)
  setTimeout(() => {
    isFadingOut.value = true
  }, 2500)

  // Emit 'done' event after fade-out transition completes (2.5s + 0.4s = 2.9s)
  setTimeout(() => {
    emit('done')
  }, 2900)
})
</script>

<template>
  <div
    :class="[
      'fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-400 ease-out',
      isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
    ]"
    style="background-color: var(--color-background);"
  >
    <div class="flex flex-col items-center text-center px-4">
      <!-- Media: Image or Video -->
      <div 
        v-if="mediaUrl" 
        class="mb-6 w-[220px] h-[220px] flex items-center justify-center overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/50"
      >
        <video
          v-if="isVideo"
          :src="mediaUrl"
          autoplay
          muted
          playsinline
          class="w-full h-full object-contain rounded-2xl"
        />
        <img
          v-else
          :src="mediaUrl"
          class="w-full h-full object-contain rounded-2xl"
          alt="SW-Indie Devs"
        />
      </div>

      <!-- Wordmark -->
      <h1 
        class="font-display text-3xl font-bold tracking-tighter select-none"
        style="font-family: var(--font-display); color: var(--color-foreground);"
      >
        SW<span style="color: var(--color-brand);">·</span>INDIE DEVS
      </h1>

      <!-- Tagline -->
      <p 
        class="mt-2 text-sm select-none"
        style="color: var(--color-muted-foreground);"
      >
        A growing community of indie app builders
      </p>

      <!-- Progress Bar -->
      <div 
        class="w-48 h-[2px] rounded-full overflow-hidden mt-6"
        style="background-color: color-mix(in oklab, var(--color-muted) 30%, transparent);"
      >
        <div 
          class="progress-bar-fill h-full rounded-full"
          style="background-color: var(--color-brand);"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.progress-bar-fill {
  width: 0%;
  animation: fillProgress 2.2s linear forwards;
}

@keyframes fillProgress {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .progress-bar-fill {
    animation: none !important;
    width: 100% !important;
  }
}
</style>
