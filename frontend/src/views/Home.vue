<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <p class="hero-eyebrow fade-up delay-1">技术博客 · 个人空间</p>
          <h1 class="hero-title fade-up delay-2">
            记录代码与<br />
            <span class="hero-accent">思考</span>的痕迹
          </h1>
          <p class="hero-desc fade-up delay-3">
            这里是我沉淀技术、分享见解的地方。<br />
            从前端到后端，从架构到工具，探索软件开发的无限可能。
          </p>
          <div class="hero-actions fade-up delay-4">
            <router-link to="/articles" class="btn-primary">
              浏览文章
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </router-link>
            <router-link to="/about" class="btn-ghost">关于我</router-link>
          </div>
        </div>
        <div class="hero-deco fade-up delay-3">
          <div class="deco-circle"></div>
          <div class="deco-text">
            <span>{{ stats.articles || '—' }}</span>
            <small>篇文章</small>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Article -->
    <section class="section" v-if="featuredArticle">
      <div class="container">
        <div class="section-header">
          <span class="section-label">精选文章</span>
          <router-link to="/articles" class="view-all">查看全部 →</router-link>
        </div>
        <ArticleCard :article="featuredArticle" :featured="true" />
      </div>
    </section>

    <!-- Latest Articles -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <span class="section-label">最新发布</span>
          <router-link to="/articles" class="view-all">查看全部 →</router-link>
        </div>
        <div class="articles-grid">
          <ArticleCard
            v-for="article in latestArticles"
            :key="article.id"
            :article="article"
          />
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="section" v-if="categories.length">
      <div class="container">
        <div class="section-header">
          <span class="section-label">探索分类</span>
        </div>
        <div class="categories-grid">
          <router-link
            v-for="cat in categories"
            :key="cat.id"
            :to="`/category/${cat.id}`"
            class="category-card"
          >
            <span class="cat-number">{{ String(cat.articleCount).padStart(2, '0') }}</span>
            <span class="cat-name">{{ cat.name }}</span>
            <span class="cat-desc">{{ cat.description }}</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Tags -->
    <section class="section" v-if="tags.length">
      <div class="container">
        <div class="section-header">
          <span class="section-label">热门标签</span>
        </div>
        <div class="tags-cloud">
          <router-link
            v-for="tag in tags"
            :key="tag.id"
            :to="`/tag/${tag.id}`"
            class="tag-pill"
          >
            {{ tag.name }}
            <span class="tag-count">{{ tag.articleCount }}</span>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { articles as articlesApi, categories as categoriesApi, tags as tagsApi } from '../api'
import ArticleCard from '../components/ArticleCard.vue'

const allArticles = ref([])
const categoriesList = ref([])
const tagsList = ref([])
const stats = ref({})

const featuredArticle = computed(() => allArticles.value[0] || null)
const latestArticles = computed(() => allArticles.value.slice(1, 5))
const categories = computed(() => categoriesList.value.slice(0, 5))
const tags = computed(() => tagsList.value.filter(t => t.articleCount > 0).slice(0, 12))

onMounted(async () => {
  try {
    const [articlesRes, catRes, tagRes] = await Promise.allSettled([
      articlesApi.list({ limit: 5 }),
      categoriesApi.list(),
      tagsApi.list()
    ])

    if (articlesRes.status === 'fulfilled') {
      allArticles.value = articlesRes.value.data.articles || []
      stats.value = { articles: articlesRes.value.data.total }
    }
    if (catRes.status === 'fulfilled') {
      categoriesList.value = catRes.value.data || []
    }
    if (tagRes.status === 'fulfilled') {
      tagsList.value = tagRes.value.data || []
    }
  } catch (err) {
    console.error('Failed to fetch home data:', err)
  }
})
</script>

<style scoped>
/* Hero */
.hero {
  padding: 5rem 0 4rem;
  position: relative;
  overflow: hidden;
}

.hero .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.hero-eyebrow {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 1.5rem;
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.03em;
  margin-bottom: 1.5rem;
}

.hero-accent {
  font-style: italic;
  font-weight: 400;
  color: var(--accent);
  position: relative;
}

.hero-accent::after {
  content: '';
  position: absolute;
  bottom: 0.1em;
  left: 0;
  right: 0;
  height: 0.08em;
  background: var(--accent-soft);
  z-index: -1;
}

.hero-desc {
  font-size: 1.1rem;
  color: var(--muted);
  line-height: 1.7;
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--accent);
  color: #fff;
  padding: 0.75rem 1.75rem;
  border-radius: var(--radius);
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: var(--accent-dark);
  color: #fff;
  transform: translateY(-2px);
}

.btn-ghost {
  padding: 0.75rem 1.75rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-weight: 500;
  font-size: 0.95rem;
  color: var(--ink-soft);
  transition: all 0.2s;
}

.btn-ghost:hover {
  border-color: var(--accent);
  color: var(--accent);
}

/* Hero decoration */
.hero-deco {
  position: relative;
  width: 280px;
  height: 280px;
  flex-shrink: 0;
}

.deco-circle {
  position: absolute;
  inset: 0;
  border: 1px solid var(--border);
  border-radius: 50%;
  animation: rotate 30s linear infinite;
}

.deco-circle::before,
.deco-circle::after {
  content: '';
  position: absolute;
  border-radius: 50%;
}

.deco-circle::before {
  inset: 20px;
  border: 1px dashed var(--accent-soft);
}

.deco-circle::after {
  inset: 60px;
  background: var(--accent);
  opacity: 0.05;
}

.deco-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.deco-text span {
  display: block;
  font-family: var(--font-display);
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--accent);
  line-height: 1;
}

.deco-text small {
  font-size: 0.85rem;
  color: var(--muted);
  letter-spacing: 0.1em;
}

@keyframes rotate {
  to { transform: rotate(360deg); }
}

/* Sections */
.section {
  padding: 3rem 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.view-all {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--muted);
  transition: color 0.2s;
}

.view-all:hover {
  color: var(--accent);
}

/* Articles grid */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

/* Categories */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.category-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  transition: all 0.3s;
}

.category-card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.cat-number {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent);
  line-height: 1;
}

.cat-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--ink);
}

.cat-desc {
  font-size: 0.85rem;
  color: var(--muted);
  line-height: 1.5;
}

/* Tags cloud */
.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tag-count {
  margin-left: 0.35rem;
  font-size: 0.7rem;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .hero .container {
    flex-direction: column;
    text-align: center;
  }
  .hero-deco {
    display: none;
  }
  .hero-actions {
    justify-content: center;
  }
  .articles-grid {
    grid-template-columns: 1fr;
  }
}
</style>
