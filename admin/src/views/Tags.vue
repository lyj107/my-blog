<template>
  <Layout>
    <div class="tags-page">
      <div class="toolbar">
        <p class="page-desc">管理文章标签，标签用于更细粒度地组织内容。</p>
        <el-button type="primary" @click="openCreate">+ 添加标签</el-button>
      </div>

      <div class="table-card">
        <el-table :data="tagsList" stripe>
          <el-table-column prop="name" label="名称" width="200" />
          <el-table-column prop="slug" label="Slug" width="200" />
          <el-table-column prop="articleCount" label="文章数" width="100" align="center" />
          <el-table-column prop="createdAt" label="创建时间" width="180">
            <template #default="{ row }">
              {{ formatDate(row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template #default="{ row }">
              <el-button size="small" text @click="openEdit(row)">编辑</el-button>
              <el-button size="small" text type="danger" @click="deleteTag(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-dialog v-model="showModal" :title="editingTag ? '编辑标签' : '添加标签'" width="420px">
        <el-form :model="form" label-position="top">
          <el-form-item label="标签名称">
            <el-input v-model="form.name" placeholder="请输入标签名称" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showModal = false">取消</el-button>
          <el-button type="primary" @click="saveTag">确定</el-button>
        </template>
      </el-dialog>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Layout from '../components/Layout.vue'
import { tags } from '../api'

const tagsList = ref([])
const showModal = ref(false)
const editingTag = ref(null)

const form = reactive({
  name: ''
})

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const fetchTags = async () => {
  try {
    const res = await tags.list()
    tagsList.value = res.data || []
  } catch (err) {
    console.error('Failed to fetch tags:', err)
  }
}

const openCreate = () => {
  editingTag.value = null
  form.name = ''
  showModal.value = true
}

const openEdit = (tag) => {
  editingTag.value = tag
  form.name = tag.name
  showModal.value = true
}

const saveTag = async () => {
  if (!form.name) {
    ElMessage.warning('请输入标签名称')
    return
  }
  try {
    if (editingTag.value) {
      await tags.update(editingTag.value.id, form)
      ElMessage.success('标签更新成功')
    } else {
      await tags.create(form)
      ElMessage.success('标签创建成功')
    }
    showModal.value = false
    fetchTags()
  } catch (err) {
    ElMessage.error(err.response?.data?.message || '操作失败')
  }
}

const deleteTag = async (id) => {
  try {
    await ElMessageBox.confirm('确认删除该标签？', '提示', { type: 'warning' })
    await tags.delete(id)
    ElMessage.success('删除成功')
    fetchTags()
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error(err.response?.data?.message || '删除失败')
    }
  }
}

onMounted(() => {
  fetchTags()
})
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.page-desc {
  color: #8b857c;
  font-size: 0.85rem;
}

.table-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e5dfd5;
  overflow: hidden;
}
</style>
