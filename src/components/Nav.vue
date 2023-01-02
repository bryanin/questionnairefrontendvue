<template>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark mb-4">
    <div class="container-xxl">
      <router-link class="navbar-brand" to="/">Панель управления</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarCollapse"
        aria-controls="navbarCollapse"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav me-auto mb-2 mb-md-0">
          <!-- <li class="nav-item">
            <router-link class="nav-link" to="/users">Users</router-link>
          </li> -->
          <li class="nav-item">
            <router-link class="nav-link" to="/project">Проекты</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/task">Задачи</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/employee">Сотрудники</router-link>
          </li>
        </ul>
        <ul class="navbar-nav me-right mb-2 mb-md-0" :key="jwt">
          <li class="nav-item"  v-if="!jwt">
            <router-link class="nav-link" to="/login">Войти</router-link>
          </li>
          <li class="nav-item"  v-else>
            <router-link class="nav-link" to="/logout">Выйти</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
    name: "Nav",
    data() {
      return {
        jwt: '',

      };
    },
methods: {
  async checkLogin() {
    if (localStorage.getItem('Authorization') == undefined || localStorage.getItem('Authorization') == null) {
        this.jwt = null;
      } else {
        this.jwt = localStorage.getItem('Authorization');
      }
  },
},
    created: function () {
      this.checkLogin();
    },
}
</script>

<style>

</style>