<template>
  <div class="projectDetails container-xxl">
    <div class="project" v-if="project">
      <h1>Проект "{{ project.title }}"</h1>
      <div class="project">
        <dl class="row">
          <dt class="col-sm-3">ID</dt>
          <dd class="col-sm-9">
            {{ project.id }}
          </dd>
          <dt class="col-sm-3">№ в 1С</dt>
          <dd class="col-sm-9">
            {{ project.id_1C }}
          </dd>
          <dt class="col-sm-3">Название</dt>
          <dd class="col-sm-9">
            {{ project.title }}
          </dd>
          <dt class="col-sm-3">Описание</dt>
          <dd class="col-sm-9">
            {{ project.description }}
          </dd>
          <dt class="col-sm-3">Инициатор</dt>
          <dd class="col-sm-9">
            {{ project.ownerEmail }}
          </dd>
          <dt class="col-sm-3">Адрес</dt>
          <dd class="col-sm-9">
            {{ project.city }}
          </dd>
          <dt class="col-sm-3">Дата создания</dt>
          <dd class="col-sm-9">
            {{ project.createdAt }}
          </dd>
        </dl>
      </div>
      <div class="update-buttons">
        <button
          type="button"
          class="btn btn-primary float-right me-right"
          @click="updateProject"
        >
          Редактировать проект
        </button>
        <button
          type="button"
          class="btn btn-danger float-right me-right"
          @click="deleteProject"
        >
          Удалить проект
        </button>
      </div>
      <br />
      <h2>Задачи к проекту</h2>
      <div class="add-task text-right me-right">
        <button
          type="button"
          class="btn btn-primary float-right me-right"
          @click="addTask"
        >
          Новая задача
        </button>
      </div>
      <br />
      <div class="table-responsive-md" v-if="tasks != null">
        <table class="table table-sm table-striped table-bordered table-hover">
          <thead class="table-light">
            <th>ID</th>
            <th>Инициатор</th>
            <th>Система</th>
            <th>Сложность</th>
            <th>Исполнитель</th>
            <th>Статус</th>
            <th>Дата создания</th>
            <th></th>
          </thead>
          <tbody class="table-striped">
            <tr v-for="task in tasks" :key="task.id">
              <td class="task">{{ task.id }}</td>
              <td>{{ task.ownerEmail }}</td>
              <td>{{ task.system }}</td>
              <td>{{ task.complexity }}</td>
              <td>{{ task.performerId }}</td>
              <td>{{ task.status }}</td>
              <td>{{ task.createdAt }}</td>
              <td>
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="
                    this.$router.push({
                      name: 'taskdetails',
                      params: { id: task.id },
                    })
                  "
                >
                  Открыть
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>Loading...</div>
    </div>

    <div v-else>Loading...</div>
  </div>
</template>

<script>
const baseURL = "http://localhost:8080/api/v1";
export default {
  name: "ProjectDetails",
  data() {
    return {
      project: [],
      tasks: [],
    };
  },
  methods: {
    async getDataById() {
      const id = this.$route.params.id;
      if (id) {
        try {
          const projectRes = await fetch(`${baseURL}/project/${id}`, {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              Authorization: localStorage.Authorization,
            },
            credentials: "include",
            body: null,
          });
          if (!projectRes.ok) {
            const message = `An error has occured: ${projectRes.status} - ${projectRes.statusText}`;
            throw new Error(message);
          }
          const projectData = await projectRes.json();
          this.project = projectData;
          this.project.createdAt = new Date(
            projectData.createdAt
          ).toLocaleDateString("ru-RU");
        } catch (err) {
          this.project = err.message;
        }
        //
        try {
          const taskRes = await fetch(`${baseURL}/task`, {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              Authorization: localStorage.Authorization,
            },
            credentials: "include",
            body: null,
          });
          if (!taskRes.ok) {
            if (taskRes.status == 401) {
              console.log("401 Error: You should login");
              this.$router.push("/login");
            }
            const message = `An error has occured: ${taskRes.status} - ${taskRes.statusText}`;
            console.log(message);
          }
          const taskData = await taskRes.json();

          taskData.forEach((taskInTaskData) => {
            if (Number(taskInTaskData.projectId) == Number(id)) {
              this.tasks.push(taskInTaskData);
            }
          });
          //this.tasks = taskData;

          if (this.tasks != null) {
            this.tasks.forEach((task) => {
              task.createdAt = new Date(task.createdAt).toLocaleDateString(
                "ru-RU"
              );
              if (task.performerId == null) {
                task.performerId = "Не назначен";
              }
            });
          }
        } catch (err) {
          this.tasks = err.message;
        }
        //
      }
    },
    async updateProject() {
      const id = this.$route.params.id;
      await this.$router.push(`/project/${id}/edit`);
    },
    async deleteProject() {
      const areYouSure = confirm("Вы уверены, что хотите удалить проект?");
      if (areYouSure) {
        const id = this.$route.params.id;
        if (id) {
          try {
            const deleteProjectRes = await fetch(`${baseURL}/project/${id}`, {
              method: "DELETE",
              headers: {
                "Content-type": "application/json",
                Authorization: localStorage.Authorization,
              },
              credentials: "include",
              body: null,
            });
            if (!deleteProjectRes.ok) {
              if (projectRes.status == 401) {
                console.log("401: Unauthorized / Авторизуйтесь");
                this.$router.push("/login");
              }
              if (projectRes.status == 403) {
                console.log("403: Forbidden / Доступ запрещён");
              }
              const message = `An error has occured: ${deleteProjectRes.status} - ${deleteProjectRes.statusText}`;
              console.log(message);
            }
            console.log(`Проект ${id} удален`);
            await alert("Проект удален");
            await this.$router.push("/project");
          } catch (err) {
            this.project = err.message;
          }
        }
      }
    },
    async addTask() {
      const id = this.$route.params.id;
      await this.$router.push(`/project/${id}/newtask`);
    },
  },
  created: function () {
    this.getDataById();
  },
};
</script>

<style>
</style>