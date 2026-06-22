<template>
  <Layout>
    <div class="dashboard">
      <!-- Stats cards -->
      <div class="stats-grid">
        <div class="stat-card" v-for="card in statCards" :key="card.label">
          <div class="stat-icon" :style="{ background: card.gradient }">
            <span v-html="card.icon"></span>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ card.value }}</span>
            <span class="stat-label">{{ card.label }}</span>
          </div>
        </div>
      </div>

      <!-- Two column layout -->
      <div class="dashboard-grid">
        <!-- Pending comments -->
        <div class="panel">
          <div class="panel-header">
            <h2 class="panel-title">待审核评论</h2>
            <router-link to="/comments" class="panel-link">查看全部 →</router-link>
          </div>
          <div class="panel-body">
            <div v-if="pendingComments.length === 0" class="empty-text">暂无待审核评论</div>
            <div v-for="comment in pendingComments" :key="comment.id" class="comment-row">
              <div class="comment-content">{{ comment.content }}</div>
              <div class="comment-meta">
                <span>{{ comment.article?.title || `文章 #${comment.articleId}` }}</span>
                <span>{{ formatDate(comment.createdAt) }}</span>
              </div>
              <div class="comment-actions">
                <button class="action-btn approve" @click="approveComment(comment.id)">通过</button>
                <button class="action-btn reject" @click="rejectComment(comment.id)">拒绝</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Top articles -->
        <div class="panel">
          <div class="panel-header">
            <h2 class="panel-title">热门文章</h2>
          </div>
          <div class="panel-body">
            <div v-if="topArticles.length === 0" class="empty-text">暂无数据</div>
            <div v-for="(article, index) in topArticles" :key="article.id" class="top-article">
              <span class="rank">{{ index + 1 }}</span>
              <div class="article-info">
                <span class="article-title">{{ article.title }}</span>
                <span class="article-stats">{{ article.viewCount }} 次阅读 · {{ article.likeCount }} 赞</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import Layout from '../components/Layout.vue'
import { stats, comments } from '../api'

const statsData = ref({})
const pendingCommentsList = ref([])
const topArticles = ref([])

const statCards = computed(() => [
  {
    label: '文章总数',
    value: statsData.value.articles?.total || 0,
    gradient: 'linear-gradient(135deg, #c44536, #e8b4a8)',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'
  },
  {
    label: '分类数量',
    value: statsData.value.categories || 0,
    gradient: 'linear-gradient(135deg, #c9a961, #e8d8a0)',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>'
  },
  {
    label: '评论总数',
    value: statsData.value.comments?.total || 0,
    gradient: 'linear-gradient(135deg, #3d6b5e, #7dbfae)',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'
  },
  {
    label: '项目数量',
    value: statsData.value.projects?.total || 0,
    gradient: 'linear-gradient(135deg, #4a5c6a, #8fa3b0)',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>'
  }
])

const pendingComments = computed(() => pendingCommentsList.value)

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

const fetchStats = async () => {
  try {
    const res = await stats.get()
    statsData.value = res.data
  } catch (err) {
    console.error('Failed to fetch stats:', err)
  }
}

const fetchPendingComments = async () => {
  try {
    const res = await comments.list({ status: 'pending', limit: 5 })
    pendingCommentsList.value = res.data.comments || []
  } catch (err) {
    console.error('Failed to fetch comments:', err)
  }
}

const fetchTopArticles = async () => {
  try {
    const res = await stats.getTopArticles()
    topArticles.value = res.data || []
  } catch (err) {
    console.error('Failed to fetch top articles:', err)
  }
}

const approveComment = async (id) => {
  try {
    await comments.update(id, { status: 'approved' })
    ElMessage.success('评论已通过')
    await fetchPendingComments()
    await fetchStats()
  } catch (err) {
    ElMessage.error('操作失败')
  }
}

const rejectComment = async (id) => {
  try {
    await comments.update(id, { status: 'rejected' })
    ElMessage.success('评论已拒绝')
    await fetchPendingComments()
    await fetchStats()
  } catch (err) {
    ElMessage.error('操作失败')
  }
}

onMounted(async () => {
  await Promise.all([fetchStats(), fetchPendingComments(), fetchTopArticles()])
})
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid #e5dfd5;
  transition: all 0.2s;
}

.stat-card:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  transform: translateY(-2px);
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-value {
  display: block;
  font-family: 'Fraunces', serif;
  font-size: 2rem;
  font-weight: 700;
  color: #1c1b1a;
  line-height: 1;
}

.stat-label {
  font-size: 0.8rem;
  color: #8b857c;
  margin-top: 0.25rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.panel {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e5dfd5;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5dfd5;
}

.panel-title {
  font-family: 'Fraunces', serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1c1b1a;
}

.panel-link {
  font-size: 0.8rem;
  color: #c44536;
  font-weight: 500;
}

.panel-body {
  padding: 1rem 1.5rem;
}

.empty-text {
  text-align: center;
  color: #8b857c;
  padding: 2rem 0;
  font-size: 0.85rem;
}

.comment-row {
  padding: 0.875rem 0;
  border-bottom: 1px solid #f3efe8;
}

.comment-row:last-child {
  border-bottom: none;
}

.comment-content {
  font-size: 0.875rem;
  color: #3d3a36;
  margin-bottom: 0.4rem;
  line-height: 1.5;
}

.comment-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #8b857c;
  margin-bottom: 0.5rem;
}

.comment-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.25rem 0.75rem;
  border: none;
  border-radius: 6px;
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.approve {
  background: #e8f5e9;
  color: #2e7d32;
}

.action-btn.approve:hover {
  background: #2e7d32;
  color: #fff;
}

.action-btn.reject {
  background: #fbe9e7;
  color: #c44536;
}

.action-btn.reject:hover {
  background: #c44536;
  color: #fff;
}

.top-article {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3efe8;
}

.top-article:last-child {
  border-bottom: none;
}

.rank {
  font-family: 'Fraunces', serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: #c44536;
  min-width: 24px;
}

.article-info {
  display: flex;
  flex-direction: column;
}

.article-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1c1b1a;
  margin-bottom: 0.15rem;
}

.article-stats {
  font-size: 0.75rem;
  color: #8b857c;
}

@media (max-width: 968px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
