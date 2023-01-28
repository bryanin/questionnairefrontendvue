<template>
  <div class="projectDetails container-xxl">
    <div class="project" v-if="project">
      <h1 class="title">Проект "{{ project.title }}"</h1>
      <div class="project">
        <div class="form-check form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            id="flexSwitchCheckDefault"
            :checked="projectStatus"
            @click="changeStatus"
          />
          <label class="form-check-label" for="flexSwitchCheckDefault">
            Вкл./выкл.
          </label>
        </div>
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
            {{ project.ownerLastName }} {{ project.ownerFirstName }}
          </dd>
          <dt class="col-sm-3">Адрес</dt>
          <dd class="col-sm-9">
            {{ project.addressPostalCodeToString }}, {{ project.addressCountryToString }},
            {{ project.addressRegionToString }}, {{ project.addressCityToString }},
            {{ project.addressSettlementToString }}, {{ project.addressStreetToString }},
            {{ project.addressHouseToString }}, {{ project.addressBlockToString }}
          </dd>
          <dt class="col-sm-3">Дата создания</dt>
          <dd class="col-sm-9">
            {{ project.createdAt }}
          </dd>
          <dt class="col-sm-3">Статус</dt>
          <dd class="col-sm-9">
            {{ project.status }}
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

      <h3>Задачи к проекту</h3>
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
              <td>{{ task.ownerLastName }} {{ task.ownerFirstName }}</td>
              <td>{{ task.securitySystemDescription }}</td>
              <td>{{ task.complexityDescription }}</td>
              <div v-if="task.performerId">
                <td>{{ task.performerLastName }} {{ task.performerFirstName }}</td>
              </div>
              <div v-else>Не назначен</div>
              <td>{{ task.statusDescription }}</td>
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

    <h3>Прикрепленные файлы</h3>
    <div class="project-files text-right me-right">
      <div class="table-responsive-md" v-if="project != null">
        <table class="table table-sm table-striped table-bordered table-hover">
          <thead class="table-light">
            <th>Задача</th>
            <th>Ссылка</th>
          </thead>
          <tbody class="table-striped">
            <tr v-for="item in project.projectFiles" :key="item.id">
              <td>{{ item.taskId }}</td>
              <td>{{ item.filePath }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <h3>Связанные компании</h3>
    <div class="project-files text-right me-right">
      <div class="table-responsive-md" v-if="project != null">
        <table class="table table-sm table-striped table-bordered table-hover">
          <thead class="table-light">
            <th>Компания</th>
            <th>Роль в проекте</th>
          </thead>
          <tbody class="table-striped">
            <tr v-for="item in this.project.projectPartners" :key="item.id">
              <td>{{ item.companyTitleShort }}</td>
              <td>{{ item.partnerRole }}</td>
            </tr>
          </tbody>
        </table>
        <div>
          <button
            type="button"
            class="btn btn-primary float-right me-right"
            @click="updateProjectPartners"
          >
            Удалить проект
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const baseURL = "http://localhost:8080/api/v1";
export default {
  name: "ProjectDetails",
  data() {
    return {
      project: null,
      tasks: [],
      projectStatus: false,
    };
  },
  methods: {
    async getProjectById() {
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

          // this.project.createdAt = new Date(
          //   projectData.createdAt
          // ).toLocaleDateString("ru-RU");

          if (this.project.status == "ACTIVE") {
            this.projectStatus = true;
          } else {
            this.projectStatus = false;
          }

          this.getTasks();
          this.getProjectFiles();
          this.getProjectPartners();
        } catch (err) {
          this.project = err.message;
        }
      }
    },
    async getTasks() {
      const id = this.$route.params.id;
      try {
        const taskRes = await fetch(`${baseURL}/project/${id}/task`, {
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

        this.tasks = taskData;
        //console.log(this.tasks);
        // if (this.tasks != null) {
        //   this.tasks.forEach((task) => {
        //     task.createdAt = new Date(task.createdAt).toLocaleDateString(
        //       "ru-RU"
        //     );
        //     if (task.performerId == null) {
        //       task.performerId = "Не назначен";
        //     }
        //   });
        // }
      } catch (err) {
        this.tasks = err.message;
      }
    },
    async getProjectFiles() {
      const id = this.$route.params.id;
      try {
        const projectFilesRes = await fetch(`${baseURL}/project/${id}/files`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: localStorage.Authorization,
          },
          credentials: "include",
          body: null,
        });
        if (!projectFilesRes.ok) {
          const message = `An error has occured: ${projectFilesRes.status} - ${projectFilesRes.statusText}`;
          throw new Error(message);
        }
        const projectFilesData = await projectFilesRes.json();
        this.project.projectFiles = projectFilesData;
      } catch (err) {
        this.project = err.message;
      }
    },
    async getProjectPartners() {
      const id = this.$route.params.id;
      try {
        const projectPartnersRes = await fetch(
          `${baseURL}/project/${id}/partners`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              Authorization: localStorage.Authorization,
            },
            credentials: "include",
            body: null,
          }
        );
        if (!projectPartnersRes.ok) {
          const message = `An error has occured: ${projectPartnersRes.status} - ${projectPartnersRes.statusText}`;
          throw new Error(message);
        }
        const projectPartnersData = await projectPartnersRes.json();

        this.project.projectPartners = projectPartnersData;
      } catch (err) {
        this.project = err.message;
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
    async updateProjectPartners() {
      //
    },
    async changeStatus() {
      let areYouSure = true;
      if (this.projectStatus == true && this.tasks.length > 0) {
        areYouSure = confirm(
          'Вы собираетесь перенести проект в архив. Есть несколько связанных с проектом задач. В случае переноса в архив все эти задачи станут неактивными. Вы уверены?'
        );
      }
      if (areYouSure) {
        this.projectStatus = !this.projectStatus;
        if (this.project.status == "ACTIVE") {
          this.project.status = "ARCHIVED";
        } else {
          this.project.status = "ACTIVE";
        }
        // this.project.createdAt = new Date(this.project.createdAt);
        const id = this.$route.params.id;
        try {
          const projectRes = await fetch(`${baseURL}/project/${id}`, {
            method: "PATCH",
            headers: {
              "Content-type": "application/json",
              Authorization: localStorage.Authorization,
            },
            credentials: "include",
            body: JSON.stringify(this.project),
          });
          if (!projectRes.ok) {
            const message = `An error has occured: ${projectRes.status} - ${projectRes.statusText}`;
            throw new Error(message);
          }
        } catch (err) {
          this.project = err.message;
        }
        this.getProjectById();
        //this.$router.push("/project");
      } else {
        this.projectStatus = true;
        console.log("this.projectStatus = " + this.project.status);
      }
    },
  },
  created: function () {
    this.getProjectById();
  },
};
</script>

<style>
.title {
  text-align: center;
}
.form-switch {
  float: right;
}
</style>