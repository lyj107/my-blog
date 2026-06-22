<template>
  <Layout>
    <div class="projects-page">
      <div class="toolbar">
        <p class="page-desc">管理展示在博客上的项目作品。</p>
        <el-button type="primary" @click="openCreate">+ 创建项目</el-button>
      </div>

      <div class="table-card">
        <el-table :data="projectsList" stripe>
          <el-table-column prop="name" label="项目名称" width="180" />
          <el-table-column prop="description" label="描述" min-width="250" show-overflow-tooltip />
          <el-table-column prop="techStack" label="技术栈" width="200" show-overflow-tooltip />
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" size="small">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template #default="{ row }">
              <el-button size="small" text @click="openEdit(row)">编辑</el-button>
              <el-button size="small" text type="danger" @click="deleteProject(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-dialog v-model="showModal" :title="editingId ? '编辑项目' : '创建项目'" width="560px">
        <el-form :model="form" label-position="top">
          <el-form-item label="项目名称">
            <el-input v-model="form.name" placeholder="请输入项目名称" />
          </el-form-item>
          <el-form-item label="项目描述">
            <el-input type="textarea" v-model="form.description" placeholder="请输入项目描述" :rows="3" />
          </el-form-item>
          <div class="form-row">
            <el-form-item label="封面图片 URL" style="flex: 1">
              <el-input v-model="form.coverImage" placeholder="https://..." />
            </el-form-item>
            <el-form-item label="状态" style="width: 160px">
              <el-select v-model="form.status" style="width: 100%">
                <el-option label="进行中" value="active" />
                <el-option label="已完成" value="completed" />
                <el-option label="开发中" value="in_progress" />
              </el-select>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item label="演示地址" style="flex: 1">
              <el-input v-model="form.demoUrl" placeholder="https://..." />
            </el-form-item>
            <el-form-item label="GitHub 地址" style="flex: 1">
              <el-input v-model="form.githubUrl" placeholder="https://github.com/..." />
            </el-form-item>
          </div>
          <el-form-item label="技术栈（逗号分隔）">
            <el-input v-model="form.techStack" placeholder="Vue3, Node.js, Express" />
          </el-form-item>
          <el-form-item label="排序序号">
            <el-input-number v-model="form.sortOrder" :min="0" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showModal = false">取消</el-button>
          <el-button type="primary" @click="saveProject">确定</el-button>
        </template>
      </el-dialog>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Layout from '../components/Layout.vue'
import { projects } from '../api'

const projectsList = ref([])
const showModal = ref(false)
const editingId = ref(null)

const form = reactive({
  name: '',
  description: '',
  coverImage: '',
  demoUrl: '',
  githubUrl: '',
  techStack: '',
  status: 'active',
  sortOrder: 0
})

const getStatusText = (status) => {
  const map = { active: '进行中', completed: '已完成', in_progress: '开发中' }
  return map[status] || status
}

const getStatusType = (status) => {
  const map = { active: 'success', completed: 'primary', in_progress: 'warning' }
  return map[status] || 'default'
}

const fetchProjects = async () => {
  try {
    const res = await projects.list()
    projectsList.value = res.data || []
  } catch (err) {
    console.error('Failed to fetch projects:', err)
  }
}

const resetForm = () => {
  form.name = ''
  form.description = ''
  form.coverImage = ''
  form.demoUrl = ''
  form.githubUrl = ''
  form.techStack = ''
  form.status = 'active'
  form.sortOrder = 0
  editingId.value = null
}

const openCreate = () => {
  resetForm()
  showModal.value = true
}

const openEdit = (project) => {
  editingId.value = project.id
  form.name = project.name
  form.description = project.description || ''
  form.coverImage = project.coverImage || ''
  form.demoUrl = project.demoUrl || ''
  form.githubUrl = project.githubUrl || ''
  form.techStack = project.techStack || ''
  form.status = project.status
  form.sortOrder = project.sortOrder || 0
  showModal.value = true
}

const saveProject = async () => {
  if (!form.name) {
    ElMessage.warning('请填写项目名称')
    return
  }
  try {
    if (editingId.value) {
      await projects.update(editingId.value, form)
      ElMessage.success('项目更新成功')
    } else {
      await projects.create(form)
      ElMessage.success('项目创建成功')
    }
    showModal.value = false
    resetForm()
    fetchProjects()
  } catch (err) {
    ElMessage.error(err.response?.data?.message || '操作失败')
  }
}

const deleteProject = async (id) => {
  try {
    await ElMessageBox.confirm('确认删除该项目？', '提示', { type: 'warning' })
    await projects.delete(id)
    ElMessage.success('删除成功')
    fetchProjects()
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  fetchProjects()
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

.form-row {
  display: flex;
  gap: 1rem;
}
</style>
