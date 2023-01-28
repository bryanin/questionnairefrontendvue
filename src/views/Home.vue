<template>
  <div class="home container-xxl">
    <h1>Панель управления проектами и задачами на проектирование</h1>
    <div class="row row-cols-1 row-cols-md-2 g-4">
  <div class="col">
    <div class="card">
      <img src="../resourses/projects.jpg" class="card-img-top" alt="projects">
      <div class="card-body">
        <h5 class="card-title">Проекты</h5>
        <p class="card-text">За прошлую неделю было создано новых проектов: {{ quantityOfProjects[1] }}. Всего в базе проектов: {{ quantityOfProjects[0] }}.</p>
      </div>
    </div>
  </div>
  <div class="col">
    <div class="card">
      <img src="../resourses/tasks.jpg" class="card-img-top" alt="tasks">
      <div class="card-body">
        <h5 class="card-title">Задачи</h5>
        <p class="card-text">За прошлую неделю было созано новых задач: {{ quantityOfTasks[1] }}. Всего в базе задач: {{ quantityOfTasks[0] }}.</p>
      </div>
    </div>
  </div>
  
</div>
  </div>
</template>

<script>
const baseURL = "http://localhost:8080/api/v1";
export default {
  name: "Home",
  data() {
    return {
      quantityOfProjects: [],
      quantityOfTasks: []
    }
  },
  methods: {
    async getProjectsQuantity() {
      try {
            const projectsQuantityRes = await fetch(`${baseURL}/project/quantity`, {
              method: "GET",
              headers: {
                "Content-type": "application/json",
                Authorization: localStorage.Authorization,
              },
              credentials: "include",
              body: null,
            });
            if (!projectsQuantityRes.ok) {
              if (projectsQuantityRes.status == 401) {
                console.log("401: Unauthorized / Авторизуйтесь");
                this.$router.push("/login");
              }
              if (projectsQuantityRes.status == 403) {
                console.log("403: Forbidden / Доступ запрещён");
              }
              const message = `An error has occured: ${projectsQuantityRes.status} - ${projectsQuantityRes.statusText}`;
              console.log(message);
            } 
            const projectsQuantityResData = await projectsQuantityRes.json();
            this.quantityOfProjects = projectsQuantityResData;
            console.log(this.quantityOfProjects);
          } catch (err) {
            this.quantityOfProjects = err.message;
          }
    }
  },
  created: function () {
    this.getProjectsQuantity();
  },
};
</script>