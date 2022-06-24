import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Logout from '@/views/Logout.vue'
import TasksList from '@/views/task/TasksList.vue'
import TaskDetails from '@/views/task/TaskDetails.vue'
import ProjectsList from '@/views/project/ProjectsList.vue'
import AddNewProject from '@/views/project/AddNewProject.vue'
import ProjectDetails from '@/views/project/ProjectDetails.vue'
import EditProjectDetails from '@/views/project/EditProjectDetails.vue'


const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: Login },
  { path: '/logout', name: 'logout', component: Logout },
  { path: '/task', name: 'tasklist', component: TasksList },
  { path: '/task/:id', name: 'taskdetails', component: TaskDetails },
  { path: '/project', name: 'projectlist', component: ProjectsList },
  { path: '/project/new', name: 'addnewproject', component: AddNewProject },
  { path: '/project/:id', name: 'projectdetails', component: ProjectDetails },
 { path: '/project/:id/edit', name: 'editprojectdetails', component: EditProjectDetails }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
