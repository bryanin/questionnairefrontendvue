import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Logout from '@/views/Logout.vue'
import TasksList from '@/views/task/TasksList.vue'
import AddNewTask from '@/views/task/AddNewTask.vue'
import TaskDetails from '@/views/task/TaskDetails.vue'
import EditTaskDetails from '@/views/task/EditTaskDetails.vue'
import ProjectsList from '@/views/project/ProjectsList.vue'
import AddNewProject from '@/views/project/AddNewProject.vue'
import ProjectDetails from '@/views/project/ProjectDetails.vue'
import EditProjectDetails from '@/views/project/EditProjectDetails.vue'
import EmployeesList from '@/views/user/EmployeesList.vue'
import EmployeeDetails from '@/views/user/EmployeeDetails.vue'
import EditEmployeeDetails from '@/views/user/EditEmployeeDetails.vue'
import AddNewEmployee from '@/views/user/AddNewEmployee.vue'


const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: Login },
  { path: '/logout', name: 'logout', component: Logout },
  { path: '/task', name: 'tasklist', component: TasksList },
  { path: '/task/:id', name: 'taskdetails', component: TaskDetails },
  { path: '/task/:id/edit', name: 'edittaskdetails', component: EditTaskDetails },
  { path: '/project', name: 'projectlist', component: ProjectsList },
  { path: '/project/new', name: 'addnewproject', component: AddNewProject },
  { path: '/project/:id', name: 'projectdetails', component: ProjectDetails },
  { path: '/project/:id/edit', name: 'editprojectdetails', component: EditProjectDetails },
  { path: '/project/:id/newtask', name: 'addnewtask', component: AddNewTask },
  { path: '/employee', name: 'employeelist', component: EmployeesList },
  { path: '/employee/:id', name: 'employeedetails', component: EmployeeDetails },
  { path: '/employee/:id/edit', name: 'editemployeedetails', component: EditEmployeeDetails },
  { path: '/employee/new', name: 'addnewemployee', component: AddNewEmployee },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
