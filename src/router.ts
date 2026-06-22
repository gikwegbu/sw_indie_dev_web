import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth'

// Helper function to resolve the current authenticated user session
function getCurrentUser(): Promise<any> {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe()
        resolve(user)
      },
      reject
    )
  })
}

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: { render: () => null }
    },
    {
      path: '/xxy_admin/login',
      component: () => import('@/admin/AdminLogin.vue')
    },
    {
      path: '/xxy_admin',
      component: () => import('@/admin/AdminApp.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/xxy_admin/members'
        },
        {
          path: 'members',
          component: () => import('@/admin/views/AdminMembers.vue')
        },
        {
          path: 'projects',
          component: () => import('@/admin/views/AdminProjects.vue')
        },
        {
          path: 'featured',
          component: () => import('@/admin/views/AdminFeatured.vue')
        },
        {
          path: 'events/upcoming',
          component: () => import('@/admin/views/AdminUpcomingEvents.vue')
        },
        {
          path: 'events/past',
          component: () => import('@/admin/views/AdminPastEvents.vue')
        },
        {
          path: 'outreach',
          component: () => import('@/admin/views/AdminOutreach.vue')
        },
        {
          path: 'settings/about',
          component: () => import('@/admin/views/AdminAbout.vue')
        },
        {
          path: 'settings/socials',
          component: () => import('@/admin/views/AdminSocials.vue')
        },
        {
          path: 'settings/hero',
          component: () => import('@/admin/views/AdminHero.vue')
        },
        {
          path: 'audit',
          component: () => import('@/admin/views/AdminAuditLog.vue')
        }
      ]
    }
  ]
})

router.beforeEach(async (to, _from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const user = await getCurrentUser()
    if (!user) {
      next('/xxy_admin/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

