# Firebase Firestore Schema Documentation

This document describes the structure and fields required for each Firestore collection in the SW-Indie Devs marketing and admin applications.

---

## 1. `members` (Collection)
* **Description**: Lists community members, their roles, bios, and individual projects/apps.
* **Document ID**: Auto-ID
* **Fields**:
  * `name` (string): `"Marcus Vance"`
  * `role` (string): `"Organizing Team"` *(Must be `"Organizing Team"` or `"Member"`)*
  * `title` (string): `"iOS Developer"`
  * `portrait` (string): `"https://images.unsplash.com/photo-1539571696357-5a69c17a67c6"`
  * `bio` (string): `"Building SwiftUI apps."`
  * `socials` (map):
    * `linkedin` (string, optional): `"https://linkedin.com/in/username"`
    * `twitter` (string, optional): `"https://twitter.com/username"`
    * `github` (string, optional): `"https://github.com/username"`
    * `website` (string, optional): `"https://example.com"`
  * `apps` (array of maps):
    * `name` (string): `"HabitBuilder"`
    * `description` (string): `"A beautiful habit tracking app."`
    * `url` (string): `"https://apps.apple.com/..."`
    * `store` (string): `"apple"` *(Must be `"apple"`, `"play"`, `"web"`, or `"download"`)*

---

## 2. `projects` (Collection)
* **Description**: Details showcasing software projects built by community members.
* **Document ID**: Auto-ID
* **Fields**:
  * `name` (string): `"HabitBuilder"`
  * `tagline` (string): `"Track your daily goals beautifully."`
  * `builder` (string): `"Marcus Vance"`
  * `cover` (string): `"https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c"`
  * `screenshots` (array of strings): `["https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c"]`
  * `description` (string): `"HabitBuilder is a clean, minimal habit tracking app written entirely in SwiftUI."`
  * `monetisation` (string): `"Free / $1.99 Premium IAP"`
  * `tags` (array of strings): `["Productivity", "SwiftUI"]`
  * `featured` (boolean): `true`
  * `featuredOrder` (number, optional): `1`
  * `links` (array of maps):
    * `label` (string): `"Download"`
    * `url` (string): `"https://apps.apple.com/..."`
    * `icon` (string): `"apple"` *(Must be `"apple"`, `"play"`, `"web"`, or `"download"`)*

---

## 3. `upcomingEvents` (Collection)
* **Description**: Future developer circle meetups, show & tells, and workshops.
* **Document ID**: Auto-ID
* **Fields**:
  * `title` (string): `"Bristol Indie Devs: Show & Tell + Social"`
  * `description` (string): `"Join us at the Engine Shed for our monthly show & tell."`
  * `date` (string): `"2026-07-09T18:30:00Z"` *(Must be a future ISO 8601 string, e.g. `YYYY-MM-DDTHH:MM:SSZ`)*
  * `time` (string): `"6:30 PM BST"`
  * `location` (string): `"Engine Shed, Station Approach, Bristol BS1 6QH"`
  * `locationUrl` (string): `"https://maps.google.com/..."`
  * `meetupUrl` (string): `"https://meetup.com/..."`
  * `coverImage` (string): `"https://images.unsplash.com/photo-1511578314322-379afb476865"`
  * `tags` (array of strings): `["Meetup", "Show & Tell"]`

---

## 4. `pastEvents` (Collection)
* **Description**: Archive of past group events, featuring speaker talks and slide links.
* **Document ID**: Auto-ID
* **Fields**:
  * `title` (string): `"SW-Indie Devs: Winter Showcase 2025"`
  * `date` (string): `"2025-11-14"`
  * `coverImage` (string): `"https://images.unsplash.com/photo-1540575467063-178a50c2df87"`
  * `description` (string): `"Our annual winter showcase in Bristol."`
  * `fullDescription` (string): `"The Winter Showcase 2025 brought together developers to demo their latest products..."`
  * `tags` (array of strings): `["Showcase", "Bristol"]`
  * `galleryImages` (array of strings): `[]`

### Subcollection: `talks` *(Add this inside each individual `pastEvents` document)*
* **Collection ID**: `talks`
* **Document ID**: Auto-ID
* **Fields**:
  * `speakerName` (string): `"Marcus Vance"`
  * `speakerTitle` (string): `"iOS Developer"`
  * `speakerPortrait` (string): `"https://images.unsplash.com/photo-1539571696357-5a69c17a67c6"`
  * `talkTitle` (string): `"Bootstrapping a SwiftUI App to $5k MRR"`
  * `youtubeUrl` (string): `"https://www.youtube.com/watch?v=dQw4w9WgXcQ"`

---

## 5. `outreach` (Collection)
* **Description**: Community cleanup, accessibility workshops, and eco-initiatives.
* **Document ID**: Auto-ID
* **Fields**:
  * `title` (string): `"Bristol Parks Cleanup & Green Initiative"`
  * `summary` (string): `"A community cleanup event organized by our developer circle."`
  * `fullDescription` (string): `"Our developers traded keyboard shortcuts for litter pickers to clean up Castle Park..."`
  * `date` (string): `"2026-05-10"`
  * `coverImage` (string): `"https://images.unsplash.com/photo-1618477388954-7852f32655ec"`
  * `gallery` (array of strings): `["https://images.unsplash.com/photo-1618477388954-7852f32655ec"]`
  * `tags` (array of strings): `["Community", "Bristol"]`

---

## 6. `settings` (Collection)
* **Description**: Shared site configurations.
* **Document ID**: `global` *(Create this document manually with this exact name!)*
* **Fields**:
  * `socials` (map):
    * `instagram` (string): `"https://instagram.com/username"`
    * `facebook` (string): `"https://facebook.com/username"`
    * `twitter` (string): `"https://twitter.com/username"`
    * `linkedin` (string): `"https://linkedin.com/company/username"`

---

## 7. `admins` (Collection)
* **Description**: User privileges and dashboard roles.
* **Document ID**: *(The exact User UID from your Firebase Authentication console)*
* **Fields**:
  * `role` (string): `"superAdmin"` *(Allows access to the Admin Audit Log. Otherwise use `"admin"`)*
