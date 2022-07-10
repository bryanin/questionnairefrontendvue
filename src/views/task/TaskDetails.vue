<template>
  <div class="taskDetails container-xxl">
    <div class="task" v-if="task">
      <h1>Задача "{{ task.id }}"</h1>
      <div class="task">
        <dl class="row">
          <dt class="col-sm-3">ID</dt>
          <dd class="col-sm-9">
            {{ task.id }}
          </dd>
          <dt class="col-sm-3">№ проекта</dt>
          <dd class="col-sm-9">
            {{ task.projectId }}
          </dd>
          <dt class="col-sm-3">Инициатор</dt>
          <dd class="col-sm-9">
            {{ task.ownerEmail }}
          </dd>
          <!-- <dt class="col-sm-3">Система</dt>
          <dd class="col-sm-9">
            {{ task.system }}
          </dd> -->
          <dt class="col-sm-3">Сложность</dt>
          <dd class="col-sm-9">
            {{ task.complexity }}
          </dd>
          <dt class="col-sm-3">Исполнитель</dt>
          <dd class="col-sm-9">
            {{ task.performerId }}
          </dd>
          <dt class="col-sm-3">Статус задачи</dt>
          <dd class="col-sm-9">
            {{ task.status }}
          </dd>
          <dt class="col-sm-3">Дата создания</dt>
          <dd class="col-sm-9">
            {{ task.createdAt }}
          </dd>
          <!-- <dt class="col-sm-3">Описание</dt>
          <dd class="col-sm-9">
            {{ JSON.parse(task.content) }}
          </dd> -->
        </dl>
      </div>
      <div class="update-buttons">
        <button
          type="button"
          class="btn btn-primary float-right me-right"
          @click="updateTask"
        >
          Редактировать задачу
        </button>
        <button
          type="button"
          class="btn btn-danger float-right me-right"
          @click="deleteTask"
        >
          Удалить задачу
        </button>
      </div>
    </div>

    <div v-else>Loading...</div>
  </div>
</template>

<script>
const baseURL = "http://localhost:8080/api/v1";
export default {
  name: "taskDetails",
  data() {
    return {
      task: null,
    };
  },
  methods: {
    async getDataById() {
      const id = this.$route.params.id;
      if (id) {
        try {
          const taskRes = await fetch(`${baseURL}/task/${id}`, {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              Authorization: localStorage.Authorization,
            },
            credentials: "include",
            body: null,
          });
          if (!taskRes.ok) {
            const message = `An error has occured: ${taskRes.status} - ${taskRes.statusText}`;
            throw new Error(message);
          }
          const taskData = await taskRes.json();
          this.task = taskData;
          this.task.createdAt = new Date(
            taskData.createdAt
          ).toLocaleDateString("ru-RU");
        } catch (err) {
          this.task = err.message;
        }
      }
    },
    async updateTask() {
      const id = this.$route.params.id;
      await this.$router.push(`/task/${id}/edit`);
    },
    async deleteTask() {
      const areYouSure = confirm("Вы уверены, что хотите удалить задачу?");
      if (areYouSure) {
        const id = this.$route.params.id;
        if (id) {
          try {
            const deleteTaskRes = await fetch(`${baseURL}/task/${id}`, {
              method: "DELETE",
              headers: {
                "Content-type": "application/json",
                Authorization: localStorage.Authorization,
              },
              credentials: "include",
              body: null,
            });
            if (!deleteTaskRes.ok) {
              if (taskRes.status == 401) {
                console.log("401: Unauthorized / Авторизуйтесь");
                this.$router.push("/login");
              }
              if (taskRes.status == 403) {
                console.log("403: Forbidden / Доступ запрещён");
              }
              const message = `An error has occured: ${deleteTaskRes.status} - ${deleteTaskRes.statusText}`;
              console.log(message);
            }
            console.log(`Задача ${id} удалена`);
            await alert("Задача удалена");
            await this.$router.push("/task");
          } catch (err) {
            this.task = err.message;
          }
        }
      }
    },
  },
  created: function () {
    this.getDataById();
  },
};
</script>

<style>
</style>