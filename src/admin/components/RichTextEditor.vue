<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import { watch } from 'vue'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link2,
  ImageIcon,
  Undo2,
  Redo2
} from 'lucide-vue-next'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Underline,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-[#6248d4] underline hover:text-[#5037be]'
      }
    }),
    Image,
    TextAlign.configure({
      types: ['heading', 'paragraph']
    }),
    Placeholder.configure({
      placeholder: props.placeholder || 'Write description...'
    })
  ],
  onUpdate: () => {
    emit('update:modelValue', editor.value?.getHTML() || '')
  }
})

// Watch modelValue from parent to keep it synced
watch(() => props.modelValue, (newVal) => {
  const isSame = editor.value?.getHTML() === newVal
  if (isSame) return
  editor.value?.commands.setContent(newVal, { emitUpdate: false })
})

const addLink = () => {
  const previousUrl = editor.value?.getAttributes('link').href
  const url = window.prompt('URL:', previousUrl)
  
  if (url === null) return
  if (url === '') {
    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }
  editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

const addImage = () => {
  const url = window.prompt('Image URL:')
  if (url) {
    editor.value?.chain().focus().setImage({ src: url }).run()
  }
}
</script>

<template>
  <div class="flex flex-col border rounded-xl overflow-hidden" style="border-color: var(--admin-border); background-color: var(--admin-bg);">
    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-1.5 p-2 border-b bg-gray-50/50 dark:bg-stone-900/50" style="border-color: var(--admin-border);">
      
      <!-- Formatting -->
      <button
        type="button"
        @click="editor?.chain().focus().toggleBold().run()"
        :class="{ 'bg-gray-200 dark:bg-stone-850 text-[#6248d4]': editor?.isActive('bold') }"
        class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-stone-800/50 text-gray-500 cursor-pointer"
        title="Bold"
      >
        <Bold class="h-4 w-4" />
      </button>

      <button
        type="button"
        @click="editor?.chain().focus().toggleItalic().run()"
        :class="{ 'bg-gray-200 dark:bg-stone-850 text-[#6248d4]': editor?.isActive('italic') }"
        class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-stone-800/50 text-gray-500 cursor-pointer"
        title="Italic"
      >
        <Italic class="h-4 w-4" />
      </button>

      <button
        type="button"
        @click="editor?.chain().focus().toggleUnderline().run()"
        :class="{ 'bg-gray-200 dark:bg-stone-850 text-[#6248d4]': editor?.isActive('underline') }"
        class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-stone-800/50 text-gray-500 cursor-pointer"
        title="Underline"
      >
        <UnderlineIcon class="h-4 w-4" />
      </button>

      <button
        type="button"
        @click="editor?.chain().focus().toggleStrike().run()"
        :class="{ 'bg-gray-200 dark:bg-stone-850 text-[#6248d4]': editor?.isActive('strike') }"
        class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-stone-800/50 text-gray-500 cursor-pointer"
        title="Strikethrough"
      >
        <Strikethrough class="h-4 w-4" />
      </button>

      <div class="h-4 w-[1px] bg-gray-200 dark:bg-stone-850 mx-1"></div>

      <!-- Headings -->
      <button
        type="button"
        @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'bg-gray-200 dark:bg-stone-850 text-[#6248d4]': editor?.isActive('heading', { level: 2 }) }"
        class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-stone-800/50 text-gray-500 cursor-pointer"
        title="Heading 2"
      >
        <Heading2 class="h-4 w-4" />
      </button>

      <button
        type="button"
        @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'bg-gray-200 dark:bg-stone-850 text-[#6248d4]': editor?.isActive('heading', { level: 3 }) }"
        class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-stone-800/50 text-gray-500 cursor-pointer"
        title="Heading 3"
      >
        <Heading3 class="h-4 w-4" />
      </button>

      <button
        type="button"
        @click="editor?.chain().focus().toggleBlockquote().run()"
        :class="{ 'bg-gray-200 dark:bg-stone-850 text-[#6248d4]': editor?.isActive('blockquote') }"
        class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-stone-800/50 text-gray-500 cursor-pointer"
        title="Blockquote"
      >
        <Quote class="h-4 w-4" />
      </button>

      <div class="h-4 w-[1px] bg-gray-200 dark:bg-stone-850 mx-1"></div>

      <!-- Lists -->
      <button
        type="button"
        @click="editor?.chain().focus().toggleBulletList().run()"
        :class="{ 'bg-gray-200 dark:bg-stone-850 text-[#6248d4]': editor?.isActive('bulletList') }"
        class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-stone-800/50 text-gray-500 cursor-pointer"
        title="Bullet List"
      >
        <List class="h-4 w-4" />
      </button>

      <button
        type="button"
        @click="editor?.chain().focus().toggleOrderedList().run()"
        :class="{ 'bg-gray-200 dark:bg-stone-850 text-[#6248d4]': editor?.isActive('orderedList') }"
        class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-stone-800/50 text-gray-500 cursor-pointer"
        title="Ordered List"
      >
        <ListOrdered class="h-4 w-4" />
      </button>

      <div class="h-4 w-[1px] bg-gray-200 dark:bg-stone-850 mx-1"></div>

      <!-- Alignments -->
      <button
        type="button"
        @click="editor?.chain().focus().setTextAlign('left').run()"
        :class="{ 'bg-gray-200 dark:bg-stone-850 text-[#6248d4]': editor?.isActive({ textAlign: 'left' }) }"
        class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-stone-800/50 text-gray-500 cursor-pointer"
        title="Align Left"
      >
        <AlignLeft class="h-4 w-4" />
      </button>

      <button
        type="button"
        @click="editor?.chain().focus().setTextAlign('center').run()"
        :class="{ 'bg-gray-200 dark:bg-stone-850 text-[#6248d4]': editor?.isActive({ textAlign: 'center' }) }"
        class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-stone-800/50 text-gray-500 cursor-pointer"
        title="Align Center"
      >
        <AlignCenter class="h-4 w-4" />
      </button>

      <button
        type="button"
        @click="editor?.chain().focus().setTextAlign('right').run()"
        :class="{ 'bg-gray-200 dark:bg-stone-850 text-[#6248d4]': editor?.isActive({ textAlign: 'right' }) }"
        class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-stone-800/50 text-gray-500 cursor-pointer"
        title="Align Right"
      >
        <AlignRight class="h-4 w-4" />
      </button>

      <div class="h-4 w-[1px] bg-gray-200 dark:bg-stone-850 mx-1"></div>

      <!-- Links & Images -->
      <button
        type="button"
        @click="addLink"
        :class="{ 'bg-gray-200 dark:bg-stone-850 text-[#6248d4]': editor?.isActive('link') }"
        class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-stone-800/50 text-gray-500 cursor-pointer"
        title="Insert Link"
      >
        <Link2 class="h-4 w-4" />
      </button>

      <button
        type="button"
        @click="addImage"
        class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-stone-800/50 text-gray-500 cursor-pointer"
        title="Insert Image URL"
      >
        <ImageIcon class="h-4 w-4" />
      </button>

      <div class="h-4 w-[1px] bg-gray-200 dark:bg-stone-850 mx-1"></div>

      <!-- History -->
      <button
        type="button"
        @click="editor?.chain().focus().undo().run()"
        class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-stone-800/50 text-gray-500 cursor-pointer"
        title="Undo"
      >
        <Undo2 class="h-4 w-4" />
      </button>

      <button
        type="button"
        @click="editor?.chain().focus().redo().run()"
        class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-stone-800/50 text-gray-500 cursor-pointer"
        title="Redo"
      >
        <Redo2 class="h-4 w-4" />
      </button>
    </div>

    <!-- Editor Content Area -->
    <div class="p-4 min-h-[160px] text-sm focus:outline-none outline-none overflow-y-auto">
      <EditorContent :editor="editor" class="prose max-w-none text-left" />
    </div>

    <!-- Live Preview Panel -->
    <div class="border-t p-4 text-left bg-gray-50/50 dark:bg-stone-900/30" style="border-color: var(--admin-border);">
      <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Preview</span>
      <div 
        class="prose max-w-none text-sm mt-2 border rounded-lg p-4 bg-white dark:bg-stone-950 min-h-[60px]" 
        style="border-color: var(--admin-border); color: var(--admin-text-primary);"
        v-html="modelValue || '<p class=\'text-gray-400 italic\'>Write text to preview content...</p>'"
      ></div>
    </div>
  </div>
</template>

<style>
/* Scoped TipTap styling placeholder configurations */
.ProseMirror {
  outline: none !important;
  min-height: 120px;
}
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

.ProseMirror, .prose {
  color: var(--admin-text-primary);
}
.ProseMirror h2, .prose h2 {
  font-size: 1.5em;
  font-weight: bold;
  margin-top: 0.8em;
  margin-bottom: 0.4em;
}
.ProseMirror h3, .prose h3 {
  font-size: 1.25em;
  font-weight: bold;
  margin-top: 0.8em;
  margin-bottom: 0.4em;
}
.ProseMirror ul, .prose ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
.ProseMirror ol, .prose ol {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
.ProseMirror blockquote, .prose blockquote {
  border-left: 3px solid var(--admin-accent);
  padding-left: 1rem;
  font-style: italic;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  color: var(--admin-text-secondary);
}
.ProseMirror a, .prose a {
  color: var(--admin-accent);
  text-decoration: underline;
}
.ProseMirror img, .prose img {
  max-width: 100%;
  border-radius: 8px;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
</style>
