<template>
  <div class="archives-page">
    <div class="container">
      <div class="page-header">
        <span class="section-label">时间线</span>
        <h1 class="page-title">文章归档</h1>
        <p class="page-subtitle">共 {{ total }} 篇文章，按时间倒序排列。</p>
      </div>

      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
      </div>

      <div v-else class="timeline">
        <div
          v-for="(group, year) in groupedArticles"
          :key="year"
          class="timeline-year"
        >
          <div class="year-header">
            <h2 class="year-title">{{ year }}</h2>
            <span class="year-count">{{ group.length }} 篇</span>
          </div>
          <div class="year-articles">
            <router-link
              v-for="article in group"
              :key="article.id"
              :to="`/article/${article.slug}`"
              class="timeline-item"
            >
              <span class="timeline-date">{{ formatMonthDay(article.publishedAt || article.createdAt) }}</span>
              <span class="timeline-title">{{ article.title }}</span>
              <span class="timeline-category" v-if="article.category">
                {{ article.category.name }}
              </span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { articles } from '../api'

const articlesList = ref([])
const total = ref(0)
const loading = ref(true)

const groupedArticles = computed(() => {
  const groups = {}
  articlesList.value.forEach(article => {
    const date = new Date(article.publishedAt || article.createdAt)
    const year = date.getFullYear()
    if (!groups[year]) groups[year] = []
    groups[year].push(article)
  })
  // Sort by year descending
  return Object.keys(groups)
    .sort((a, b) => b - a)
    .reduce((acc, year) => {
      acc[year] = groups[year]
      return acc
    }, {})
})

const formatMonthDay = (date) => {
  const d = new Date(date)
  const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  return `${months[d.getMonth()]} ${d.getDate()}日`
}

onMounted(async () => {
  try {
    const res = await articles.list({ limit: 100 })
    articlesList.value = res.data.articles || []
    total.value = res.data.total || 0
  } catch (err) {
    console.error('Failed to fetch articles:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.archives-page {
  padding: 3rem 0;
  min-height: 60vh;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: clamp(2rem, 4vw, 3rem);
  margin: 0.5rem 0;
}

.page-subtitle {
  color: var(--muted);
  font-size: 0.95rem;
}

.timeline {
  max-width: 800px;
  margin: 0 auto;
}

.timeline-year {
  margin-bottom: 3rem;
}

.year-header {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--ink);
}

.year-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--ink);
  font-family: var(--font-display);
}

.year-count {
  font-size: 0.9rem;
  color: var(--muted);
}

.year-articles {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius);
  transition: all 0.2s;
}

.timeline-item:hover {
  background: var(--bg-alt);
  transform: translateX(4px);
}

.timeline-date {
  font-size: 0.85rem;
  color: var(--accent);
  font-weight: 500;
  min-width: 100px;
  font-family: var(--font-mono);
}

.timeline-title {
  flex: 1;
  font-size: 0.95rem;
  color: var(--ink-soft);
  transition: color 0.2s;
}

.timeline-item:hover .timeline-title {
  color: var(--accent);
}

.timeline-category {
  font-size: 0.75rem;
  color: var(--muted);
  padding: 0.15rem 0.6rem;
  background: var(--bg-alt);
  border-radius: 100px;
}

@media (max-width: 640px) {
  .timeline-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.35rem;
  }
  .timeline-date {
    min-width: auto;
  }
}
</style>
