<template>
  <div class="projectDetails container-xxl">
    <div class="project" v-if="project">
      <h1>Проект "{{ project.title }}"</h1>
      <div class="project">
        <form @submit.prevent="submit" class="row g-3">
          <div class="col-md-3">
            <label for="inputID1C" class="form-label">№ проекта 1С</label>
            <input
              type="text"
              class="form-control"
              id="inputID1C"
              placeholder="1C_000000"
              v-model="project.id_1C"
            />
          </div>
          <div class="col-12">
            <label for="inputTitle" class="form-label">Название</label>
            <input
              type="text"
              class="form-control"
              id="inputTitle"
              placeholder="Административно-офисное здание недалеко от м. Белорусская"
              v-model="project.title"
            />
          </div>
          <div class="col-12">
            <label for="inputDescription" class="form-label">Описание</label>
            <input
              type="text"
              class="form-control"
              id="inputDescription"
              placeholder="Реконструкция здания. Зааказчик Луис+, подрядчик МонтажСервис. Реализация в 2023 году"
              v-model="project.description"
            />
          </div>
          <div class="col-12">
            <label for="inputAddress2" class="form-label">Адрес</label>
            <input
              type="text"
              class="form-control"
              id="inputAddress2"
              placeholder="г. Москва, ул. 1-я Ямского Поля, д. 28, стр. 3"
              v-model="project.city"
            />
          </div>
          <div class="col-12">
            <button type="submit" class="btn btn-primary" @click="submit">
              Сохранить
            </button>
          </div>
        </form> 
      </div>
    </div>

    <div v-else>Loading...</div>
  </div>
</template>

<script>

export default {
  name: "EditProjectDetails",
  data() {
    return {
      project: null,
    };
  },
  methods: {
    async getDataById() {
      const baseURL = "http://localhost:8080/api/v1";
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
        } catch (err) {
          this.project = err.message;
        }
      }
    },
    async submit() {
      const baseURL = "http://localhost:8080/api/v1";
      const id = this.$route.params.id;
      if (id) {
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
        await this.$router.push('/project');
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