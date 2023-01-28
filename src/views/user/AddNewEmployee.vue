<template>
  <div class="add-new-employee container-xxl">
    <h1>Новая учетная запись пользователя</h1>
    <div class="employee" v-if="positions">
    <form @submit.prevent="submit" class="row g-3">
          <div class="col-md-3">
            <label for="inputLastName" class="form-label">Фамилия</label>
            <input
              type="text"
              class="form-control"
              id="inputLastName"
              placeholder="Например, Иванов"
              v-model="employee.lastName"
            />
          </div>
          <div class="col-12">
            <label for="inputFirstName" class="form-label">Имя</label>
            <input
              type="text"
              class="form-control"
              id="inputFirstName"
              placeholder="Например, Иван"
              v-model="employee.firstName"
            />
          </div>
          <div class="col-12">
            <label for="inputEmail" class="form-label">Email</label>
            <input
              type="text"
              class="form-control"
              id="inputEmail"
              placeholder="Например, ivanov@email.com"
              v-model="employee.email"
            />
            </div>
            <div class="col-12">
            <label for="inputPassword" class="form-label">Password</label>
            <input
              type="text"
              class="form-control"
              id="inputPassword"
              placeholder=""
              v-model="employee.password"
            />
            <div class="col-3">
            <label for="inputPhone" class="form-label">Телефон</label>
            <input
              type="text"
              class="form-control"
              id="inputPhone"
              placeholder="Например, +79876543210"
              v-model="employee.phone"
            />
          </div>
          <div class="col-1">
            <label for="inputCompanyName" class="form-label">Компания</label>
            <input
              type="text"
              class="form-control"
              id="inputCompanyName"
              placeholder="Например, МонтажСервис"
              v-model="employee.companyTitle"
            />
          </div>
          </div>
          <div class="col-3">
            <label for="inputPositionTitle" class="form-label">Должность</label>
            <select class="form-select form-select-lg mb-3" id="inputPositionTitle" v-model="selectedPosition">
              <option v-for="(position, key) in positions" :key="key">{{ position }}</option>
            </select>
          </div>
          <div class="col-12">
            <button type="submit" class="btn btn-primary">
              Сохранить
            </button>
          </div>
    </form> 
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<script>
const baseURL = "http://localhost:8080/api/v1";
export default {
  data() {
    return {
      employee: {
        "id" : null,
        "email" : "newemployee@luis.ru",
        "password" : null,
        "securityRole" : null,
        "firstName" : "",
        "lastName" : "",
        "companyId" : 1,
        "companyTitle" : "ЛУИС+",
        "phone" : "", 
        "accessStatus" : "ACTIVE",
        "position" : null,
        "positionTitle" : ""
      },
      positions: {},
      selectedPosition: "",
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
    async submit() {
      function getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
      };

      this.employee.position = getKeyByValue(this.positions, this.selectedPosition);
      this.employee.securityRole = this.employee.position;
      try {
        const submitRes = await fetch(`${baseURL}/employee`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: localStorage.Authorization,
        },
        credentials: "include",
        body: JSON.stringify(this.employee),
      });
      if (!submitRes.ok) {
          if (submitRes.status == 401) {
            console.log('401 Error: You should login');
            this.$router.push('/login');
          }
          const message = `An error has occured: ${submitRes.status} - ${submitRes.statusText}`;
          console.log(message);
          alert(message);
        } else {
          alert('Пользователь создан');
        }
        const submitData = await submitRes.json();
        
      } catch (err) {
        this.submit = err.message;
      };
      await this.$router.push(`/employee`);
    }
  },
  created: function () {
    this.getEmployeePositions();
  },

}
</script>

<style>

</style>