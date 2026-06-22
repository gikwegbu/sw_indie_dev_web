# SW-Indie Devs Portal

A premium Vue 3 + Vite + TypeScript + Tailwind CSS v4 web portal and administrator dashboard for **SW-Indie Devs**—a growing community of indie application builders, designers, and bootstrappers in the South West.

The project features a sleek, glassmorphic marketing site that synchronizes in real time with Cloud Firestore, paired with a hidden, light-mode admin dashboard for community organizers to manage members, events, and projects.

---

## 🚀 Getting Started

### 1. Installation
Install the project dependencies (using local cache directories to bypass root permission locks if needed):
```bash
npm install --cache=./.npm-cache
```

### 2. Environment Configuration
Create a `.env` file in the root directory and populate it with your Firebase Web App credentials:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef...
```

### 3. Firebase Console Configuration
1. **Firestore Database**: Create a database instance in **Firestore Database** (start in production mode).
2. **Rules Deployment**: Copy the rules from your local `firestore.rules` and paste them into the **Rules** tab in the Firestore Console, then click **Publish**.
3. **Authentication**: Navigate to **Authentication**, click **Get Started**, and enable the **Email/Password** sign-in provider. Create an administrator account under the **Users** tab.
4. **Roles Configuration**: To assign the `superAdmin` role (required to view the Admin Audit Log), create a document in the `admins` collection with the User's UID as the Document ID, containing a string field `role` set to `"superAdmin"`.

### 4. Run Locally
Run the development server:
```bash
npm run dev
```

The site will be available at:
* **Marketing Portal**: `http://localhost:5173/`
* **Admin Dashboard**: `http://localhost:5173/xxy_admin` (redirects to `/xxy_admin/login` if not authenticated)

---

## 🛠️ Tech Stack & Key Architectures
- **Core**: Vue 3 (Composition API, `<script setup>`), Vite, TypeScript.
- **Styling**: Tailwind CSS v4 + Scoped light-mode variables in `src/admin/admin.css` to prevent polluting the dark-themed public pages.
- **Database & Auth**: Cloud Firestore real-time observers (`onSnapshot`), Firebase Authentication, and Storage.
- **Components**: Radix Vue dialogs, Embla Carousel for Outreach gallery sliders, Lucide Vue icons.

---

## 📈 Changelog

### Phase 1 — Core Layout & Dynamic Additions
- **Splash Screen**: Created a full-viewport startup animation (`SplashScreen.vue`) displaying the "SW·INDIE DEVS" wordmark and tagline with an animated brand progress bar, fading out gracefully after 2.5s.
- **Footer Socials**: Added custom props for social link profiles inside `SiteFooter.vue` to allow dynamic links from the settings dashboard.

### Phase 2 — Past Events & Outreach Modules
- **Past Events**: Developed `PastEvents.vue` section displaying past meetups, complete with a Radix-based dialog modal (`PastEventDialog.vue`) that plays Embedded YouTube videos of member talks.
- **Community Outreach**: Developed `CommunityOutreach.vue` showcasing community cleanups and workshops with `OutreachDialog.vue` housing touch-friendly Embla Carousel gallery sliders.

### Phase 3 — Firebase Integration & Composables
- **Firebase Clients**: Created the client initializer in `src/firebase/index.ts` sourcing keys from Vite environment variables.
- **Firestore Composables**: Programmed reactive database composables under `src/composables/firebase/`:
  - `useCollection` and `useDocument` for generic, real-time snapshot bindings.
  - `useMembers`, `useProjects`, `useUpcomingEvents`, `usePastEvents`, and `useOutreach` for type-safe database queries.
  - `useSettings` to manage global site properties like social links.
  - `useAuditLog` to automatically write administrative audit entries.

### Phase 4 — Database Wiring & State Placeholders
- **Security Rules**: Deployed strict, read-permissive database filters in `firestore.rules` preventing unauthorized write access.
- **Database Integration**: Replaced static seed arrays across Showcase, Members, Upcoming Events, Past Events, and Outreach sections with reactive database subscriptions.
- **State Layouts**: Designed matching pulse-animated shimmers for loading phases, error-state inline handlers, and custom collection empty states.
- **Subcollections**: Refactored the event talks segment to subscribe to `/pastEvents/{eventId}/talks` subcollections dynamically in real time.

### Phase 5 — Hidden Admin Dashboard Scaffolding
- **Navigation Guarding**: Configured a `requiresAuth` metadata check in `src/router.ts` redirecting unauthenticated traffic to `/xxy_admin/login`.
- **Light-Mode Admin Shell**: Created `AdminApp.vue` styling variables in `src/admin/admin.css` containing dedicated white backgrounds, grey sidebar panels, and purple accent brand outlines.
- **Administrator Login**: Developed `AdminLogin.vue` with toggleable Eye/EyeOff password indicators.
- **Dashboard Views**: Added stub views for all administrative content lists, settings forms, and log lists, alongside a real-time `useAdminUser` role verification check.

### Phase 6 — Complete CMS CRUD Views, Dark Mode, & Soft-Deletes
- **Theme Modes**: Implemented unified light/dark variable sheets inside `src/admin/admin.css` isolating the admin dashboard. Added a reactive mode-toggle button in `AdminApp.vue` saving theme preferences to `localStorage`.
- **Shared CMS Components**: Built robust reusable components in `src/admin/components/`:
  - `ShimmerTable.vue` (skeleton loading placeholders)
  - `EmptyState.vue` (plus icon fallback prompts)
  - `ConfirmDeleteModal.vue` (Radix delete dialogs)
  - `RichTextEditor.vue` (TipTap rich text editor toolbar, Markdown support, and live Tailwind prose preview)
  - `DataTable.vue` (action columns eye/pencil/trash binding, custom slots)
  - `AddButton.vue` (styled accent actions)
- **CMS Views**: Replaced stubs in `src/admin/views/` with complete CRUD implementations:
  - `AdminMembers.vue` (member records, bio copy, repeatable app lists)
  - `AdminProjects.vue` (portfolio project submissions, member builder picker, exclusive featured states)
  - `AdminFeatured.vue` (dropdown highlighted project selectors)
  - `AdminUpcomingEvents.vue` (ISO 8601 calendar pickers, address mapping)
  - `AdminPastEvents.vue` (talks subcollections replication, speaker subforms, gallery arrays)
  - `AdminOutreach.vue` (activity records, gallery slideshow URLs)
  - `AdminAbout.vue`, `AdminSocials.vue`, `AdminHero.vue` (settings overrides on `/settings/global`)
  - `AdminAuditLog.vue` (read-only logs tracking operator mutations)
- **Soft-Delete System**: Coded transaction logic in `src/composables/firebase/useSoftDelete.ts` copy-archiving deleted documents to the `/bin` collection with a 30-day expiration stamp before purging records.
