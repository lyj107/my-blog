<template>
  <Layout>
    <div class="articles-page">
      <div class="toolbar">
        <div class="filters">
          <el-select v-model="statusFilter" placeholder="筛选状态" clearable @change="handleFilter">
            <el-option label="全部" value="" />
            <el-option label="已发布" value="published" />
            <el-option label="草稿" value="draft" />
            <el-option label="已归档" value="archived" />
          </el-select>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索文章标题或内容..."
            @keyup.enter="handleSearch"
            clearable
            @clear="handleSearch"
            style="width: 300px"
          />
          <el-button @click="handleSearch">搜索</el-button>
        </div>
        <el-button type="primary" @click="router.push('/articles/create')">
          + 新建文章
        </el-button>
      </div>

      <div class="table-card">
        <el-table :data="articlesList" stripe>
          <el-table-column prop="title" label="标题" min-width="250" show-overflow-tooltip />
          <el-table-column prop="category.name" label="分类" width="120" />
          <el-table-column prop="viewCount" label="阅读量" width="90" align="center" />
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" size="small">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" width="170">
            <template #default="{ row }">
              {{ formatDate(row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140" fixed="right">
            <template #default="{ row }">
              <el-button size="small" text @click="router.push(`/articles/edit/${row.id}`)">编辑</el-button>
              <el-button size="small" text type="danger" @click="deleteArticle(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-wrap">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            layout="prev, pager, next"
            @current-change="fetchArticles"
          />
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import Layout from '../components/Layout.vue'
import { articles } from '../api'

const router = useRouter()

const articlesList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const statusFilter = ref('')
const searchKeyword = ref('')

const getStatusText = (status) => {
  const map = { published: '已发布', draft: '草稿', archived: '已归档' }
  return map[status] || status
}

const getStatusType = (status) => {
  const map = { published: 'success', draft: 'warning', archived: 'info' }
  return map[status] || 'default'
}

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const fetchArticles = async () => {
  try {
    const params = { page: currentPage.value, limit: pageSize.value }
    // Always send status (even empty string) so admin can see all
    params.status = statusFilter.value
    if (searchKeyword.value) params.keyword = searchKeyword.value

    const res = await articles.list(params)
    articlesList.value = res.data.articles || []
    total.value = res.data.total || 0
  } catch (err) {
    console.error('Failed to fetch articles:', err)
  }
}

const handleFilter = () => {
  currentPage.value = 1
  fetchArticles()
}

const handleSearch = () => {
  currentPage.value = 1
  fetchArticles()
}

const deleteArticle = async (id) => {
  try {
    await ElMessageBox.confirm('确认删除该文章？此操作不可撤销。', '提示', {
      type: 'warning'
    })
    await articles.delete(id)
    ElMessage.success('删除成功')
    fetchArticles()
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  fetchArticles()
})
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.filters {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.table-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e5dfd5;
  overflow: hidden;
}

.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
}
</style>
