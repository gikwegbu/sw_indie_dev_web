<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase'
import { Eye, EyeOff } from 'lucide-vue-next'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMsg = ref<string | null>(null)
const loading = ref(false)
const router = useRouter()

const handleSignIn = async () => {
  errorMsg.value = null
  loading.value = true
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    router.push('/xxy_admin')
  } catch (err: any) {
    console.error('Sign in error:', err)
    errorMsg.value = 'Invalid credentials.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-[#f3f4f6] text-[#111827] p-4">
    <div class="w-full max-w-sm bg-white border border-gray-200 rounded-2xl p-8 shadow-sm flex flex-col items-stretch">
      
      <!-- Wordmark Logo -->
      <div class="text-center mb-6">
        <span class="font-display text-2xl font-bold tracking-tighter text-[#6248d4]">
          SW·INDIE DEVS
        </span>
        <h1 class="text-[18px] font-medium text-gray-700 mt-3">
          Admin sign in
        </h1>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSignIn" class="flex flex-col gap-4">
        <!-- Email Input -->
        <div class="flex flex-col text-left">
          <label for="email" class="text-xs font-semibold text-gray-500 mb-1.5">Email address</label>
          <input
            id="email"
            type="email"
            v-model="email"
            required
            class="px-3.5 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#6248d4]/30 focus:border-[#6248d4] w-full"
            placeholder="admin@sw-indie.dev"
          />
        </div>

        <!-- Password Input -->
        <div class="flex flex-col text-left">
          <label for="password" class="text-xs font-semibold text-gray-500 mb-1.5">Password</label>
          <div class="relative w-full">
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              required
              class="pl-3.5 pr-10 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#6248d4]/30 focus:border-[#6248d4] w-full"
              placeholder="••••••••"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Eye v-if="!showPassword" class="h-4 w-4" />
              <EyeOff v-else class="h-4 w-4" />
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-[#6248d4] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#5037be] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </button>

        <!-- Inline Error Message -->
        <p v-if="errorMsg" class="text-xs font-semibold text-red-600 mt-2 text-center">
          {{ errorMsg }}
        </p>
      </form>
    </div>
  </div>
</template>
