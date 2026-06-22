<template>
  <Layout>
    <div class="categories-page">
      <div class="toolbar">
        <p class="page-desc">管理文章分类，合理分类有助于读者浏览。</p>
        <el-button type="primary" @click="openCreate">+ 添加分类</el-button>
      </div>

      <div class="table-card">
        <el-table :data="categoriesList" stripe>
          <el-table-column prop="name" label="名称" width="180" />
          <el-table-column prop="description" label="描述" min-width="250" show-overflow-tooltip />
          <el-table-column prop="articleCount" label="文章数" width="90" align="center" />
          <el-table-column prop="sortOrder" label="排序" width="80" align="center" />
          <el-table-column label="操作" width="140">
            <template #default="{ row }">
              <el-button size="small" text @click="openEdit(row)">编辑</el-button>
              <el-button size="small" text type="danger" @click="deleteCategory(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-dialog v-model="showModal" :title="editingCategory ? '编辑分类' : '添加分类'" width="480px">
        <el-form :model="form" label-position="top">
          <el-form-item label="分类名称">
            <el-input v-model="form.name" placeholder="请输入分类名称" />
          </el-form-item>
          <el-form-item label="分类描述">
            <el-input type="textarea" v-model="form.description" placeholder="请输入分类描述" :rows="3" />
          </el-form-item>
          <el-form-item label="排序序号">
            <el-input-number v-model="form.sortOrder" :min="0" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showModal = false">取消</el-button>
          <el-button type="primary" @click="saveCategory">确定</el-button>
        </template>
      </el-dialog>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Layout from '../components/Layout.vue'
import { categories } from '../api'

const categoriesList = ref([])
const showModal = ref(false)
const editingCategory = ref(null)

const form = reactive({
  name: '',
  description: '',
  sortOrder: 0
})

const fetchCategories = async () => {
  try {
    const res = await categories.list()
    categoriesList.value = res.data || []
  } catch (err) {
    console.error('Failed to fetch categories:', err)
  }
}

const openCreate = () => {
  editingCategory.value = null
  form.name = ''
  form.description = ''
  form.sortOrder = 0
  showModal.value = true
}

const openEdit = (category) => {
  editingCategory.value = category
  form.name = category.name
  form.description = category.description || ''
  form.sortOrder = category.sortOrder || 0
  showModal.value = true
}

const saveCategory = async () => {
  if (!form.name) {
    ElMessage.warning('请输入分类名称')
    return
  }
  try {
    if (editingCategory.value) {
      await categories.update(editingCategory.value.id, form)
      ElMessage.success('分类更新成功')
    } else {
      await categories.create(form)
      ElMessage.success('分类创建成功')
    }
    showModal.value = false
    fetchCategories()
  } catch (err) {
    ElMessage.error(err.response?.data?.message || '操作失败')
  }
}

const deleteCategory = async (id) => {
  try {
    await ElMessageBox.confirm('确认删除该分类？', '提示', { type: 'warning' })
    await categories.delete(id)
    ElMessage.success('删除成功')
    fetchCategories()
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error(err.response?.data?.message || '删除失败')
    }
  }
}

onMounted(() => {
  fetchCategories()
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
