<template>
  <div class="admin-article-editor">
    <AdminSidebar />

    <div class="editor-main">
      <header class="editor-header">
        <h1 class="editor-title">{{ isEdit ? '编辑文章' : '新建文章' }}</h1>
      </header>

      <div class="editor-body">
        <!-- Left: Vditor Markdown Editor -->
        <div class="editor-pane">
          <div id="vditor-container"></div>
        </div>

        <!-- Right: Metadata Form -->
        <div class="meta-pane">
          <div class="glass-card meta-card">
            <div class="form-group">
              <label class="form-label">标题</label>
              <input
                v-model="title"
                type="text"
                class="form-input"
                placeholder="文章标题"
                @input="handleTitleInput"
              />
            </div>

            <div class="form-group">
              <label class="form-label">固定链接 (Slug)</label>
              <input
                v-model="slug"
                type="text"
                class="form-input"
                placeholder="article-slug"
              />
            </div>

            <div class="form-group">
              <label class="form-label">分类</label>
              <select v-model="category" class="form-select">
                <option :value="null" disabled>选择分类</option>
                <option
                  v-for="cat in articleStore.categories"
                  :key="cat.id"
                  :value="cat.id"
                >
                  {{ cat.name || cat.title }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">标签</label>
              <div class="tags-grid">
                <label
                  v-for="tag in articleStore.tags"
                  :key="tag.id"
                  class="tag-checkbox"
                  :class="{ active: tags.includes(tag.id) }"
                >
                  <input
                    v-model="tags"
                    type="checkbox"
                    :value="tag.id"
                    class="tag-input"
                  />
                  <span class="tag-name">{{ tag.name }}</span>
                </label>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">封面图片 URL</label>
              <input
                v-model="coverImage"
                type="text"
                class="form-input"
                placeholder="https://example.com/cover.jpg"
              />
              <div v-if="coverImage" class="cover-preview">
                <img :src="coverImage" alt="封面预览" @error="coverError = true" />
                <span v-if="coverError" class="cover-error">图片加载失败</span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">状态</label>
              <div class="status-toggle">
                <button
                  type="button"
                  class="status-btn status-draft"
                  :class="{ active: status === 'draft' }"
                  @click="status = 'draft'"
                >
                  草稿
                </button>
                <button
                  type="button"
                  class="status-btn status-published"
                  :class="{ active: status === 'published' }"
                  @click="status = 'published'"
                >
                  已发布
                </button>
                <button
                  type="button"
                  class="status-btn status-archived"
                  :class="{ active: status === 'archived' }"
                  @click="status = 'archived'"
                >
                  已归档
                </button>
              </div>
            </div>

            <div class="form-group form-group-inline">
              <label class="checkbox-label">
                <input v-model="isTop" type="checkbox" class="checkbox-input" />
                <span class="checkbox-custom"></span>
                <span>置顶文章</span>
              </label>
            </div>

            <div class="action-buttons">
              <button
                type="button"
                class="btn btn-save"
                @click="saveArticle('draft')"
              >
                保存草稿
              </button>
              <button
                type="button"
                class="btn btn-publish"
                @click="saveArticle('published')"
              >
                发布
              </button>
              <button
                type="button"
                class="btn btn-cancel"
                @click="handleCancel"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import AdminSidebar from '@/components/AdminSidebar.vue'
import { useAuthStore } from '@/stores/auth'
import { useArticleStore } from '@/stores/article'
import { createArticle, updateArticle } from '@/api/admin'
import client from '@/api/client'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const articleStore = useArticleStore()

const isEdit = computed(() => !!route.params.id)
const articleId = computed(() => route.params.id)

// Form state
const title = ref('')
const slug = ref('')
const category = ref(null)
const tags = ref([])
const coverImage = ref('')
const status = ref('draft')
const isTop = ref(false)
const coverError = ref(false)

let vditorInstance = null
let vditorReady = null
let resolveVditorReady = null

function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w一-龥\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function handleTitleInput() {
  if (!slug.value || slug.value === generateSlug(title.value)) {
    slug.value = generateSlug(title.value)
  }
}

async function saveArticle(publishStatus) {
  if (!title.value.trim()) {
    alert('请输入文章标题')
    return
  }

  const formData = {
    title: title.value.trim(),
    slug: slug.value.trim() || generateSlug(title.value.trim()),
    category_id: category.value,
    tags_ids: tags.value,
    cover_image: coverImage.value || '',
    status: publishStatus || status.value,
    is_top: isTop.value,
    content: vditorInstance ? vditorInstance.getValue() : '',
  }

  try {
    if (isEdit.value) {
      await updateArticle(articleId.value, formData)
    } else {
      await createArticle(formData)
    }
    router.push('/admin/articles')
  } catch (err) {
    console.error('Failed to save article:', err)
    const detail =
      err.response?.data?.detail || err.message || '保存失败，请重试'
    alert('保存失败: ' + (typeof detail === 'string' ? detail : JSON.stringify(detail)))
  }
}

function handleCancel() {
  router.push('/admin/articles')
}

onMounted(async () => {
  // Fetch categories and tags
  await Promise.all([
    articleStore.fetchCategories(),
    articleStore.fetchTags(),
  ])

  // Setup Vditor ready promise
  vditorReady = new Promise((resolve) => {
    resolveVditorReady = resolve
  })

  const apiBase =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/'
  const uploadUrl = apiBase + 'admin/upload/'

  await nextTick()

  vditorInstance = new Vditor('vditor-container', {
    height: '100%',
    mode: 'sv', // split view: editor left, preview right
    placeholder: '开始写作...',
    toolbar: [
      'headings',
      'bold',
      'italic',
      'strike',
      'link',
      '|',
      'list',
      'ordered-list',
      'check',
      '|',
      'quote',
      'line',
      'code',
      'inline-code',
      '|',
      'upload',
      'table',
      '|',
      'undo',
      'redo',
      '|',
      'preview',
    ],
    upload: {
      url: uploadUrl,
      headers: {
        Authorization: 'Bearer ' + authStore.token,
      },
      fieldName: 'image',
      accept: 'image/*',
      success: (editor, msg) => {
        try {
          const res = JSON.parse(msg)
          const imgUrl = res.url || res.data?.url || res
          editor.insertValue(`\n![image](${imgUrl})\n`)
        } catch (e) {
          console.error('Upload success parse error:', e)
        }
      },
    },
    cache: { enable: false },
    after: () => {
      resolveVditorReady()
    },
  })

  // If editing, fetch existing article data
  if (isEdit.value) {
    try {
      const res = await client.get(`/admin/articles/${articleId.value}/`)
      const article = res.data
      title.value = article.title || ''
      slug.value = article.slug || ''
      category.value = article.category || null
      tags.value = article.tags || []
      coverImage.value = article.cover_image || ''
      status.value = article.status || (article.is_published ? 'published' : 'draft')
      isTop.value = article.is_top || false

      // Wait for Vditor to be ready, then set content
      await vditorReady
      if (vditorInstance && article.content) {
        vditorInstance.setValue(article.content)
      }
    } catch (err) {
      console.error('Failed to fetch article for editing:', err)
      alert('加载文章失败')
    }
  }
})

onUnmounted(() => {
  if (vditorInstance) {
    try {
      vditorInstance.destroy()
    } catch (e) {
      console.error('Vditor destroy error:', e)
    }
    vditorInstance = null
  }
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.admin-article-editor {
  display: flex;
  min-height: calc(100vh - 56px);
  background: $bg-primary;
}

.editor-main {
  flex: 1;
  margin-left: 220px;
  display: flex;
  flex-direction: column;
  max-width: calc(100vw - 220px);
}

.editor-header {
  padding: 1.25rem 2rem;
  border-bottom: 1px solid $glass-border;
  flex-shrink: 0;
}

.editor-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: $text-primary;
  letter-spacing: 1px;
}

.editor-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

// ---- Left: Vditor Pane ----
.editor-pane {
  flex: 0 0 55%;
  max-width: 55%;
  padding: 1rem;
  overflow: hidden;
}

#vditor-container {
  height: 100%;
  min-height: 500px;
}

// ---- Right: Metadata Pane ----
.meta-pane {
  flex: 0 0 45%;
  max-width: 45%;
  padding: 1rem 1rem 1rem 0;
  overflow-y: auto;
}

.meta-card {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: $text-secondary;
  margin-bottom: 0.4rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-input,
.form-select {
  width: 100%;
  padding: 0.6rem 0.75rem;
  font-size: 0.9rem;
  font-family: inherit;
  color: $text-primary;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid $glass-border;
  border-radius: 6px;
  outline: none;
  transition:
    border-color $transition-fast,
    box-shadow $transition-fast;

  &::placeholder {
    color: rgba(255, 255, 255, 0.25);
  }

  &:focus {
    border-color: rgba($neon-cyan, 0.4);
    box-shadow: 0 0 0 2px rgba($neon-cyan, 0.08);
  }
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23888' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.6rem center;
  background-size: 12px;
  padding-right: 2rem;

  option {
    background: $bg-secondary;
    color: $text-primary;
  }
}

// ---- Tags ----
.tags-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0.3rem 0.65rem;
  font-size: 0.8rem;
  color: $text-secondary;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid $glass-border;
  border-radius: 999px;
  cursor: pointer;
  transition:
    color $transition-fast,
    background $transition-fast,
    border-color $transition-fast;

  &.active {
    color: $neon-purple;
    background: rgba($neon-purple, 0.08);
    border-color: rgba($neon-purple, 0.3);
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.15);
  }
}

.tag-input {
  display: none;
}

// ---- Cover Preview ----
.cover-preview {
  margin-top: 0.5rem;
  border-radius: 6px;
  overflow: hidden;
  max-height: 120px;

  img {
    width: 100%;
    height: auto;
    object-fit: cover;
    display: block;
  }
}

.cover-error {
  display: block;
  padding: 0.5rem;
  font-size: 0.75rem;
  color: #ff5252;
  text-align: center;
}

// ---- Status Toggle ----
.status-toggle {
  display: flex;
  gap: 0.5rem;
}

.status-btn {
  flex: 1;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: $font-mono;
  color: $text-secondary;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid $glass-border;
  border-radius: 6px;
  cursor: pointer;
  transition:
    color $transition-fast,
    background $transition-fast,
    border-color $transition-fast,
    box-shadow $transition-fast;

  &.active {
    &.status-draft {
      color: $text-secondary;
      border-color: rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.06);
    }

    &.status-published {
      color: #00e676;
      border-color: rgba(0, 230, 118, 0.3);
      background: rgba(0, 230, 118, 0.08);
      box-shadow: 0 0 6px rgba(0, 230, 118, 0.15);
    }

    &.status-archived {
      color: #ffaa00;
      border-color: rgba(255, 170, 0, 0.3);
      background: rgba(255, 170, 0, 0.08);
    }
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.15);
  }
}

// ---- Inline checkbox ----
.form-group-inline {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.88rem;
  color: $text-primary;
  cursor: pointer;
  user-select: none;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 1px solid $glass-border;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.04);
  position: relative;
  transition:
    background $transition-fast,
    border-color $transition-fast;

  .checkbox-input:checked + & {
    background: rgba($neon-purple, 0.2);
    border-color: $neon-purple;

    &::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 5px;
      width: 5px;
      height: 9px;
      border: solid $neon-purple;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }
}

// ---- Action Buttons ----
.action-buttons {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid $glass-border;
}

.btn {
  flex: 1;
  padding: 0.65rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: $font-mono;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid transparent;
  transition:
    background $transition-fast,
    color $transition-fast,
    box-shadow $transition-fast,
    border-color $transition-fast;
  text-align: center;

  &:focus-visible {
    outline: 2px solid rgba($neon-cyan, 0.5);
    outline-offset: 2px;
  }
}

.btn-save {
  color: $neon-cyan;
  background: transparent;
  border-color: rgba($neon-cyan, 0.3);

  &:hover {
    background: rgba($neon-cyan, 0.08);
    box-shadow:
      0 0 8px rgba($neon-cyan, 0.2),
      0 0 16px rgba($neon-cyan, 0.08);
    border-color: rgba($neon-cyan, 0.5);
  }
}

.btn-publish {
  color: #fff;
  background: rgba($neon-pink, 0.15);
  border-color: rgba($neon-pink, 0.4);
  box-shadow:
    0 0 8px rgba($neon-pink, 0.15);

  &:hover {
    background: rgba($neon-pink, 0.25);
    box-shadow:
      0 0 12px rgba($neon-pink, 0.3),
      0 0 24px rgba($neon-pink, 0.12);
    border-color: rgba($neon-pink, 0.6);
  }
}

.btn-cancel {
  color: $text-secondary;
  background: transparent;
  border-color: transparent;

  &:hover {
    color: $text-primary;
    background: rgba(255, 255, 255, 0.04);
  }
}
</style>
