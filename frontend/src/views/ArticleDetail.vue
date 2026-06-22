<template>
  <div class="article-detail" v-if="article">
    <!-- Article header -->
    <header class="article-header">
      <div class="container">
        <div class="header-back">
          <router-link to="/articles" class="back-link">
            ← 返回文章列表
          </router-link>
        </div>
        <div class="header-content reading-width">
          <div class="article-meta fade-up">
            <router-link
              v-if="article.category"
              :to="`/category/${article.category.id}`"
              class="article-category"
            >
              {{ article.category.name }}
            </router-link>
            <span class="article-date">{{ formatDate(article.publishedAt || article.createdAt) }}</span>
            <span class="article-views">{{ article.viewCount }} 次阅读</span>
          </div>
          <h1 class="article-title fade-up delay-1">{{ article.title }}</h1>
          <p class="article-excerpt fade-up delay-2" v-if="article.excerpt">{{ article.excerpt }}</p>
          <div class="article-author fade-up delay-3" v-if="article.author">
            <div class="author-avatar">
              {{ (article.author.nickname || article.author.username || '').charAt(0) }}
            </div>
            <div class="author-info">
              <span class="author-name">{{ article.author.nickname || article.author.username }}</span>
              <span class="author-role">作者</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Article content -->
    <article class="article-body">
      <div class="container">
        <div class="reading-width">
          <div class="markdown-body" v-html="renderedContent"></div>

          <!-- Tags -->
          <div class="article-tags" v-if="article.tags && article.tags.length">
            <span class="tags-label">标签：</span>
            <router-link
              v-for="tag in article.tags"
              :key="tag.id"
              :to="`/tag/${tag.id}`"
              class="tag-pill"
            >
              {{ tag.name }}
            </router-link>
          </div>

          <!-- Divider -->
          <div class="article-divider">
            <span>※</span>
          </div>
        </div>
      </div>
    </article>

    <!-- Comments section -->
    <section class="comments-section">
      <div class="container">
        <div class="reading-width">
          <h2 class="comments-title">评论 <span class="comments-count">{{ comments.length }}</span></h2>

          <!-- Comment form -->
          <div class="comment-form">
            <p v-if="commentNotice" class="comment-notice">{{ commentNotice }}</p>
            <textarea
              v-model="commentContent"
              placeholder="写下你的想法..."
              rows="3"
            ></textarea>
            <div class="comment-form-footer">
              <input v-model="commentName" placeholder="昵称（选填）" class="comment-name-input" />
              <button @click="submitComment" :disabled="!commentContent.trim()" class="comment-submit">
                发表评论
              </button>
            </div>
          </div>

          <!-- Comment list -->
          <div class="comment-list" v-if="comments.length">
            <div v-for="comment in comments" :key="comment.id" class="comment-item">
              <div class="comment-avatar">
                {{ getAvatar(comment) }}
              </div>
              <div class="comment-body">
                <div class="comment-header">
                  <span class="comment-author">{{ getAuthor(comment) }}</span>
                  <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
                </div>
                <p class="comment-content">{{ comment.content }}</p>
              </div>
            </div>
          </div>
          <p v-else class="no-comments">还没有评论，来说两句吧～</p>
        </div>
      </div>
    </section>
  </div>

  <div v-else-if="loading" class="loading" style="min-height: 60vh; display: flex; align-items: center; justify-content: center;">
    <div class="loading-spinner"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js'
import { articles as articlesApi, comments as commentsApi } from '../api'

const route = useRoute()
const article = ref(null)
const commentsList = ref([])
const loading = ref(true)
const commentContent = ref('')
const commentName = ref('')
const commentNotice = ref('')

marked.setOptions({
  breaks: true,
  gfm: true
})

const renderedContent = computed(() => {
  if (!article.value?.content) return ''
  const html = marked(article.value.content)
  return DOMPurify.sanitize(html)
})

const comments = computed(() => commentsList.value)

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

const getAvatar = (comment) => {
  const name = comment.user?.nickname || comment.user?.username || comment.guestName || '访'
  return name.charAt(0)
}

const getAuthor = (comment) => {
  return comment.user?.nickname || comment.user?.username || comment.guestName || '匿名访客'
}

const fetchArticle = async () => {
  loading.value = true
  try {
    const res = await articlesApi.get(route.params.slug)
    article.value = res.data
    await fetchComments(res.data.id)
  } catch (err) {
    console.error('Failed to fetch article:', err)
  } finally {
    loading.value = false
  }
}

const fetchComments = async (articleId) => {
  try {
    const res = await commentsApi.listByArticle(articleId)
    commentsList.value = res.data || []
  } catch (err) {
    console.error('Failed to fetch comments:', err)
  }
}

const submitComment = async () => {
  if (!commentContent.value.trim()) return
  try {
    await commentsApi.create({
      articleId: article.value.id,
      content: commentContent.value,
      guestName: commentName.value
    })
    commentContent.value = ''
    commentName.value = ''
    commentNotice.value = '评论提交成功，等待审核'
    await fetchComments(article.value.id)
  } catch (err) {
    console.error('Failed to submit comment:', err)
    commentNotice.value = err.response?.data?.message || '评论提交失败'
  }
}

watch(() => route.params.slug, () => {
  if (route.params.slug) fetchArticle()
})

onMounted(() => {
  if (route.params.slug) fetchArticle()
})
</script>

<style scoped>
/* Article header */
.article-header {
  padding: 3rem 0 2rem;
  background: var(--bg-alt);
  border-bottom: 1px solid var(--border);
}

.header-back {
  margin-bottom: 2rem;
}

.back-link {
  font-size: 0.85rem;
  color: var(--muted);
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--accent);
}

.header-content {
  text-align: center;
}

.article-meta {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.85rem;
}

.article-category {
  color: var(--accent);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.75rem;
}

.article-date, .article-views {
  color: var(--muted);
}

.article-title {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  margin-bottom: 1rem;
  line-height: 1.2;
}

.article-excerpt {
  font-size: 1.1rem;
  color: var(--muted);
  line-height: 1.7;
  margin-bottom: 2rem;
  font-family: var(--font-read);
}

.article-author {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: var(--bg-card);
  border-radius: 100px;
  border: 1px solid var(--border);
}

.author-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.author-name {
  font-weight: 600;
  font-size: 0.9rem;
  display: block;
}

.author-role {
  font-size: 0.75rem;
  color: var(--muted);
}

/* Article body */
.article-body {
  padding: 3rem 0;
}

.markdown-body {
  font-family: var(--font-read);
  font-size: 1.125rem;
  line-height: 1.85;
  color: var(--ink-soft);
}

.markdown-body :deep(h2) {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 600;
  margin: 2.5rem 0 1rem;
  color: var(--ink);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border);
}

.markdown-body :deep(h3) {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 600;
  margin: 2rem 0 0.75rem;
  color: var(--ink);
}

.markdown-body :deep(p) {
  margin-bottom: 1.25rem;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin-bottom: 1.25rem;
  padding-left: 1.5rem;
}

.markdown-body :deep(li) {
  margin-bottom: 0.5rem;
}

.markdown-body :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.875em;
  background: var(--bg-alt);
  padding: 0.15em 0.4em;
  border-radius: 3px;
  color: var(--accent);
}

.markdown-body :deep(pre) {
  background: var(--code-bg) !important;
  border-radius: var(--radius);
  padding: 1.25rem 1.5rem;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.markdown-body :deep(pre code) {
  background: none;
  color: #e4e4e4;
  padding: 0;
  font-size: 0.875rem;
  line-height: 1.6;
}

.markdown-body :deep(blockquote) {
  border-left: 3px solid var(--accent);
  padding: 0.5rem 0 0.5rem 1.5rem;
  margin: 1.5rem 0;
  color: var(--muted);
  font-style: italic;
}

.markdown-body :deep(a) {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.markdown-body :deep(strong) {
  font-weight: 600;
  color: var(--ink);
}

/* Tags */
.article-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
}

.tags-label {
  font-size: 0.85rem;
  color: var(--muted);
  margin-right: 0.5rem;
}

/* Divider */
.article-divider {
  text-align: center;
  margin: 3rem 0;
  color: var(--accent);
  font-size: 1.5rem;
  letter-spacing: 1rem;
}

/* Comments */
.comments-section {
  padding: 2rem 0 4rem;
  background: var(--bg-alt);
}

.comments-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.comments-count {
  font-size: 0.9rem;
  color: var(--muted);
  background: var(--bg-card);
  padding: 0.15rem 0.6rem;
  border-radius: 100px;
  font-family: var(--font-body);
}

.comment-form {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  margin-bottom: 2rem;
}

.comment-notice {
  margin-bottom: 0.75rem;
  color: var(--accent);
  font-size: 0.85rem;
}

.comment-form textarea {
  width: 100%;
  border: none;
  background: none;
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--ink);
  resize: vertical;
  outline: none;
  min-height: 80px;
}

.comment-form textarea::placeholder {
  color: var(--muted-light);
}

.comment-form-footer {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-soft);
}

.comment-name-input {
  flex: 1;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.5rem 0.75rem;
  font-family: var(--font-body);
  font-size: 0.85rem;
  outline: none;
  transition: border-color 0.2s;
}

.comment-name-input:focus {
  border-color: var(--accent);
}

.comment-submit {
  background: var(--accent);
  color: #fff;
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: var(--radius);
  font-weight: 500;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.comment-submit:hover:not(:disabled) {
  background: var(--accent-dark);
}

.comment-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.comment-item {
  display: flex;
  gap: 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--accent-soft);
  color: var(--accent-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
  flex-shrink: 0;
}

.comment-body {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.comment-author {
  font-weight: 600;
  font-size: 0.9rem;
}

.comment-date {
  font-size: 0.8rem;
  color: var(--muted);
}

.comment-content {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--ink-soft);
}

.no-comments {
  text-align: center;
  color: var(--muted);
  padding: 2rem;
}
</style>
