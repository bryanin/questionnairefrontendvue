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
            {{ project.ownerFirstName }} {{ project.ownerLastName }}
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
      project: null
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
          this.project.createdAt = new Date(projectData.createdAt).toLocaleDateString("ru-RU");
        } catch (err) {
          this.project = err.message;
        };
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