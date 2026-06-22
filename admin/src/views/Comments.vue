<template>
  <Layout>
    <div class="comments-page">
      <div class="toolbar">
        <div class="filters">
          <el-select v-model="statusFilter" placeholder="筛选状态" clearable @change="handleFilter" style="width: 160px">
            <el-option label="全部" value="" />
            <el-option label="待审核" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已拒绝" value="rejected" />
          </el-select>
        </div>
      </div>

      <div class="table-card">
        <el-table :data="commentsList" stripe>
          <el-table-column prop="content" label="评论内容" min-width="300" show-overflow-tooltip />
          <el-table-column label="文章" width="180" show-overflow-tooltip>
            <template #default="{ row }">
              {{ row.article?.title || `#${row.articleId}` }}
            </template>
          </el-table-column>
          <el-table-column label="用户" width="120">
            <template #default="{ row }">
              {{ row.user?.nickname || row.user?.username || row.guestName || '匿名' }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" size="small">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="时间" width="170">
            <template #default="{ row }">
              {{ formatDate(row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button v-if="row.status === 'pending'" size="small" text type="success" @click="approveComment(row.id)">通过</el-button>
              <el-button v-if="row.status === 'pending'" size="small" text type="warning" @click="rejectComment(row.id)">拒绝</el-button>
              <el-button size="small" text type="danger" @click="deleteComment(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-wrap">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            layout="prev, pager, next"
            @current-change="fetchComments"
          />
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Layout from '../components/Layout.vue'
import { comments } from '../api'

const commentsList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const statusFilter = ref('')

const getStatusText = (status) => {
  const map = { pending: '待审核', approved: '已通过', rejected: '已拒绝' }
  return map[status] || status
}

const getStatusType = (status) => {
  const map = { pending: 'warning', approved: 'success', rejected: 'danger' }
  return map[status] || 'default'
}

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const fetchComments = async () => {
  try {
    const params = { page: currentPage.value, limit: pageSize.value }
    if (statusFilter.value) params.status = statusFilter.value
    const res = await comments.list(params)
    commentsList.value = res.data.comments || []
    total.value = res.data.total || 0
  } catch (err) {
    console.error('Failed to fetch comments:', err)
  }
}

const handleFilter = () => {
  currentPage.value = 1
  fetchComments()
}

const approveComment = async (id) => {
  try {
    await comments.update(id, { status: 'approved' })
    ElMessage.success('评论已通过')
    fetchComments()
  } catch (err) {
    ElMessage.error('操作失败')
  }
}

const rejectComment = async (id) => {
  try {
    await comments.update(id, { status: 'rejected' })
    ElMessage.success('评论已拒绝')
    fetchComments()
  } catch (err) {
    ElMessage.error('操作失败')
  }
}

const deleteComment = async (id) => {
  try {
    await ElMessageBox.confirm('确认删除该评论？', '提示', { type: 'warning' })
    await comments.delete(id)
    ElMessage.success('删除成功')
    fetchComments()
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  fetchComments()
})
</script>

<style scoped>
.toolbar {
  margin-bottom: 1.25rem;
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
