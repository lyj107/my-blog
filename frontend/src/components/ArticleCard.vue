<template>
  <article class="article-card" :class="{ featured }" @click="goToArticle">
    <div v-if="article.coverImage && featured" class="card-cover">
      <img :src="article.coverImage" :alt="article.title" loading="lazy" />
    </div>
    <div class="card-body">
      <div class="card-meta">
        <span class="card-category" v-if="article.category">{{ article.category.name }}</span>
        <span class="card-date">{{ formatDate(article.publishedAt || article.createdAt) }}</span>
      </div>
      <h3 class="card-title">{{ article.title }}</h3>
      <p class="card-excerpt">{{ article.excerpt }}</p>
      <div class="card-footer">
        <div class="card-tags" v-if="article.tags && article.tags.length">
          <span v-for="tag in article.tags.slice(0, 3)" :key="tag.id" class="tag-mini">
            {{ tag.name }}
          </span>
        </div>
        <span class="card-read">
          阅读全文
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </span>
      </div>
    </div>
  </article>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  article: { type: Object, required: true },
  featured: { type: Boolean, default: false }
})

const router = useRouter()

const goToArticle = () => {
  router.push(`/article/${article.slug}`)
}

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  return `${d.getFullYear()}年${months[d.getMonth()]}${d.getDate()}日`
}

const { article } = props
</script>

<style scoped>
.article-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--border-soft);
  display: flex;
  flex-direction: column;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--accent-soft);
}

.article-card.featured {
  flex-direction: row;
}

.card-cover {
  flex: 0 0 45%;
  overflow: hidden;
  max-height: 280px;
}

.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.article-card:hover .card-cover img {
  transform: scale(1.05);
}

.card-body {
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.featured .card-body {
  padding: 2.5rem;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.8rem;
}

.card-category {
  color: var(--accent);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.75rem;
}

.card-date {
  color: var(--muted);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 0.75rem;
  color: var(--ink);
  transition: color 0.2s;
}

.featured .card-title {
  font-size: 1.75rem;
}

.article-card:hover .card-title {
  color: var(--accent);
}

.card-excerpt {
  font-size: 0.9rem;
  color: var(--muted);
  line-height: 1.6;
  margin-bottom: 1.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-tags {
  display: flex;
  gap: 0.5rem;
}

.tag-mini {
  font-size: 0.7rem;
  color: var(--muted);
  padding: 0.15rem 0.5rem;
  background: var(--bg-alt);
  border-radius: 100px;
}

.card-read {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--accent);
  display: flex;
  align-items: center;
  gap: 0.35rem;
  transition: gap 0.2s;
}

.article-card:hover .card-read {
  gap: 0.6rem;
}

@media (max-width: 768px) {
  .article-card.featured {
    flex-direction: column;
  }
  .card-cover {
    flex: none;
    max-height: 200px;
  }
  .featured .card-body {
    padding: 1.75rem;
  }
  .featured .card-title {
    font-size: 1.25rem;
  }
}
</style>
