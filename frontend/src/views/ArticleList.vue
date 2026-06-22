<template>
  <div class="article-list-page">
    <div class="container">
      <!-- Page header -->
      <div class="page-header">
        <span class="section-label">{{ pageTitle }}</span>
        <h1 class="page-title">{{ pageHeading }}</h1>
        <p class="page-subtitle" v-if="pageSubtitle">{{ pageSubtitle }}</p>
      </div>

      <!-- Filters -->
      <div class="filters">
        <div class="filter-tabs">
          <button
            v-for="cat in allCategories"
            :key="cat.id"
            class="filter-tab"
            :class="{ active: activeCategory == cat.id }"
            @click="filterByCategory(cat.id)"
          >
            {{ cat.name }}
          </button>
        </div>
      </div>

      <!-- Articles -->
      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
      </div>

      <div v-else-if="articles.length === 0" class="empty-state">
        <h3>暂无文章</h3>
        <p>还没有发布任何文章，敬请期待。</p>
      </div>

      <div v-else class="articles-grid">
        <ArticleCard
          v-for="article in articles"
          :key="article.id"
          :article="article"
        />
      </div>

      <!-- Pagination -->
      <div class="pagination" v-if="total > pageSize">
        <button
          :disabled="currentPage <= 1"
          @click="changePage(currentPage - 1)"
          class="page-btn"
        >
          ← 上一页
        </button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button
          :disabled="currentPage >= totalPages"
          @click="changePage(currentPage + 1)"
          class="page-btn"
        >
          下一页 →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { articles as articlesApi, categories as categoriesApi } from '../api'
import ArticleCard from '../components/ArticleCard.vue'

const route = useRoute()
const router = useRouter()

const articlesList = ref([])
const allCategories = ref([])
const loading = ref(true)
const currentPage = ref(1)
const pageSize = ref(9)
const total = ref(0)
const activeCategory = ref(null)

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const pageTitle = computed(() => {
  if (route.name === 'CategoryArticles') return '分类浏览'
  if (route.name === 'TagArticles') return '标签筛选'
  if (route.query.keyword) return '搜索结果'
  return '所有文章'
})

const pageHeading = computed(() => {
  if (route.query.keyword) return `「${route.query.keyword}」`
  return '文章列表'
})

const pageSubtitle = computed(() => {
  if (route.name === 'CategoryArticles') {
    const cat = allCategories.value.find(c => c.id == route.params.id)
    return cat ? cat.description : ''
  }
  return ''
})

const articles = computed(() => articlesList.value)

const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit: pageSize.value
    }

    if (route.name === 'CategoryArticles') {
      params.categoryId = route.params.id
      activeCategory.value = route.params.id
    } else if (route.name === 'TagArticles') {
      params.tagId = route.params.id
    } else if (route.query.keyword) {
      params.keyword = route.query.keyword
    }

    const res = await articlesApi.list(params)
    articlesList.value = res.data.articles || []
    total.value = res.data.total || 0
  } catch (err) {
    console.error('Failed to fetch articles:', err)
  } finally {
    loading.value = false
  }
}

const filterByCategory = (catId) => {
  if (catId === activeCategory.value) {
    activeCategory.value = null
    router.push('/articles')
  } else {
    activeCategory.value = catId
    router.push(`/category/${catId}`)
  }
  currentPage.value = 1
}

const changePage = (page) => {
  currentPage.value = page
  fetchData()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(() => route.fullPath, () => {
  currentPage.value = 1
  activeCategory.value = route.name === 'CategoryArticles' ? route.params.id : null
  fetchData()
})

onMounted(async () => {
  try {
    const catRes = await categoriesApi.list()
    allCategories.value = catRes.data || []
  } catch (err) {
    console.error('Failed to fetch categories:', err)
  }
  activeCategory.value = route.name === 'CategoryArticles' ? route.params.id : null
  await fetchData()
})
</script>

<style scoped>
.article-list-page {
  padding: 3rem 0;
  min-height: 60vh;
}

.page-header {
  margin-bottom: 2.5rem;
  text-align: center;
}

.page-title {
  font-size: clamp(2rem, 4vw, 3rem);
  margin: 0.5rem 0;
}

.page-subtitle {
  color: var(--muted);
  font-size: 0.95rem;
  max-width: 500px;
  margin: 0.5rem auto 0;
}

.filters {
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border);
  padding-bottom: 1rem;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-tab {
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--muted);
  cursor: pointer;
  border-radius: 100px;
  transition: all 0.2s;
}

.filter-tab:hover {
  color: var(--ink);
  background: var(--bg-alt);
}

.filter-tab.active {
  background: var(--ink);
  color: var(--bg);
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-top: 3rem;
}

.page-btn {
  background: none;
  border: 1px solid var(--border);
  padding: 0.5rem 1.25rem;
  border-radius: var(--radius);
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--ink-soft);
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--accent);
  color: var(--accent);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.9rem;
  color: var(--muted);
  font-weight: 500;
}

@media (max-width: 968px) {
  .articles-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .articles-grid {
    grid-template-columns: 1fr;
  }
}
</style>
