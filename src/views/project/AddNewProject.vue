<template>
  <div class="add-new-project container-xxl">
    <h1>Новый проект</h1>
    <form @submit.prevent="onSubmit" class="row g-3">
          <div class="col-md-3">
            <label for="inputID1C" class="form-label">№ проекта 1С</label>
            <input
              type="text"
              class="form-control"
              id="inputID1C"
              placeholder="Например, 1С_0000015"
              v-model="project.id_1C"
            />
          </div>
          <div class="col-12">
            <label for="inputTitle" class="form-label">Наименование</label>
            <input
              type="text"
              class="form-control"
              id="inputTitle"
              placeholder="Например, Административно-офисное здание недалеко от м. Белорусская"
              v-model="project.title"
            />
          </div>
          <div class="col-12">
            <label for="inputDescription" class="form-label">Описание</label>
            <input
              type="text"
              class="form-control"
              id="inputDescription"
              placeholder="Например, Реконструкция здания. Заказчик ГАЗПРОМБАНК, подрядчик МонтажСервис. Реализация в 2023 году"
              v-model="project.description"
            />
          </div>
          <div class="col-1">
            <label for="inputAddressPostalCode" class="form-label">Индекс</label>
            <input
              type="text"
              class="form-control"
              id="inputAddressPostalCode"
              placeholder="Например, 125040"
              v-model="project.address.postalCode"
            />
          </div>
          <div class="col-3">
            <label for="inputAddressCountry" class="form-label">Страна</label>
            <input
              type="text"
              class="form-control"
              id="inputAddressCountry"
              placeholder="Например, Россия"
              v-model="project.address.country"
            />
          </div>
          <div class="col-3">
            <label for="inputAddressRegion" class="form-label">Обрасть / край / республика</label>
            <input
              type="text"
              class="form-control"
              id="inputAddressRegion"
              placeholder="Например, Московская"
              v-model="project.address.region"
            />
          </div>
          <div class="col-3">
            <label for="inputAddressCity" class="form-label">Город</label>
            <input
              type="text"
              class="form-control"
              id="inputAddressCity"
              placeholder="Например, Москва"
              v-model="project.address.city"
            />
          </div>
          <div class="col-3">
            <label for="inputAddressSettlement" class="form-label">Село / поселок / деревня</label>
            <input
              type="text"
              class="form-control"
              id="inputAddressSettlement"
              placeholder="-"
              v-model="project.address.settlement"
            />
          </div>
          <div class="col-3">
            <label for="inputAddressStreet" class="form-label">Улица</label>
            <input
              type="text"
              class="form-control"
              id="inputAddressStreet"
              placeholder="Например, 1-я Ямского Поля"
              v-model="project.address.street"
            />
          </div>
          <div class="col-1">
            <label for="inputAddressHouse" class="form-label">Дом</label>
            <input
              type="text"
              class="form-control"
              id="inputAddressHouse"
              placeholder="Например, 1"
              v-model="project.address.house"
            />
          </div>
          <div class="col-1">
            <label for="inputAddressBlock" class="form-label">Корпус</label>
            <input
              type="text"
              class="form-control"
              id="inputAddressBlock"
              placeholder="-"
              v-model="project.address.block"
            />
          </div>
          <div class="col-12">
            <button type="submit" class="btn btn-primary" @click="submit">
              Сохранить
            </button>
          </div>
        </form> 
  </div>
</template>

<script>
const baseURL = "http://localhost:8080/api/v1";
export default {
  data() {
    return {
      project: {
        "id" : null,
        "id_1C": "",
        "title": "",
        "description": "",
        "ownerEmail": "",
        "address": {
          "postalCode" : "",
          "country" : "",
          "region" : "",
          "city" : "",
          "settlement" : "",
          "street" : "",
          "house" : "",
          "block" : ""
        },
        "createdAt": null,
      },
    };
  },
  methods: {
    async submit() {
      this.project.ownerEmail = JSON.parse(atob(localStorage.Authorization.split('.')[1])).sub;
      this.project.status = "ARCHIVED";
      try {
          const projectRes = await fetch(`${baseURL}/project`, {
            method: "POST",
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
          await alert('Проект создан');
          this.$router.push('/project');
        } catch (err) {
          this.project = err.message;
        }
    },
  },
};
</script>

<style>
</style>