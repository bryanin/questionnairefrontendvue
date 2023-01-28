<template>
  <div class="employeeDetails container-xxl">
    <div class="employee" v-if="employee">
      <h1>{{ employee.lastName }} {{ employee.firstName }}</h1>
      <div class="employee">
        <form @submit.prevent="onSubmit" class="row g-3">
          <div class="col-md-6">
            <label for="inputLastName" class="form-label">Фамилия</label>
            <input
              type="text"
              class="form-control"
              id="inputLastName"
              placeholder="Например, Иванов"
              v-model="employee.lastName"
            />
          </div>
          <div class="col-md-6">
            <label for="inputFirstName" class="form-label">Имя</label>
            <input
              type="text"
              class="form-control"
              id="inputFirstName"
              placeholder="Например, Иван"
              v-model="employee.firstName"
            />
          </div>
          <div class="col-md-6">
            <label for="inputEmail" class="form-label">Email</label>
            <input
              type="text"
              class="form-control"
              id="inputEmail"
              placeholder="Например, ivanov@email.com"
              v-model="employee.email"
            />
            </div>
            <div class="col-md-6">
            <label for="inputPhone" class="form-label">Телефон</label>
            <input
              type="text"
              class="form-control"
              id="inputPhone"
              placeholder="Например, +79876543210"
              v-model="employee.phone"
            />
          </div>
          <div class="col-md-6">
            <label for="inputPositionTitle" class="form-label">Должность</label>
            <select id="inputPositionTitle" v-model="employee.positionTitle">
              <option v-for="(position, key) in positions" :key="key">{{ position }}</option>
            </select>
          </div>
          <div class="col-md-6">
            <label for="inputAccessStatus" class="form-label">Статус</label>
            <select id="inputAccessStatus" v-model="employee.accessStatus">
              <option value="ACTIVE" selected>Действующий</option>
              <option value="BANNED">Заблокирован</option>
            </select>
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
const baseURL = "http://localhost:8080/api/v1";
export default {
  name: "EditEmployeeDetails",
  data() {
    return {
      employee: null,
      positions: {},
    };
  },
  methods: {
    async getEmployeePositions() {
      try {
        const positionRes = await fetch(`${baseURL}/employee/position`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: localStorage.Authorization,
          },
          credentials: "include",
          body: null,
        });
        if (!positionRes.ok) {
          if (positionRes.status == 401) {
            console.log('401 Error: You should login');
            this.$router.push('/login');
          }
          const message = `An error has occured: ${positionRes.status} - ${positionRes.statusText}`;
          console.log(message);
        }
        const positionData = await positionRes.json();
        this.positions = positionData;
      } catch (err) {
        this.positions = err.message;
      };
    },
    async getDataById() {
      const baseURL = "http://localhost:8080/api/v1";
      const id = this.$route.params.id;
      if (id) {
        try {
          const employeeRes = await fetch(`${baseURL}/employee/${id}`, {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              Authorization: localStorage.Authorization,
            },
            credentials: "include",
            body: null,
          });
          if (!employeeRes.ok) {
            const message = `An error has occured: ${employeeRes.status} - ${employeeRes.statusText}`;
            throw new Error(message);
          }
          const employeeData = await employeeRes.json();
          this.employee = employeeData;
        } catch (err) {
          this.employee = err.message;
        }
      }
    },
    async submit() {
      const baseURL = "http://localhost:8080/api/v1";
      const id = this.$route.params.id;
      function getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
      }
      this.employee.position = getKeyByValue(this.positions, this.employee.positionTitle);
      this.employee.securityRole = this.employee.position;
      if (id) {
        try {
          const employeeRes = await fetch(`${baseURL}/employee/${id}`, {
            method: "PATCH",
            headers: {
              "Content-type": "application/json",
              Authorization: localStorage.Authorization,
            },
            credentials: "include",
            body: JSON.stringify(this.employee),
          });
          if (!employeeRes.ok) {
            const message = `An error has occured: ${employeeRes.status} - ${employeeRes.statusText}`;
            throw new Error(message);
          }
        } catch (err) {
          this.employee = err.message;
        }
        this.$router.push('/employee');
      }
    },
  },
  created: function () {
    this.getEmployeePositions();
    this.getDataById();
  },
};
</script>

<style>
</style>