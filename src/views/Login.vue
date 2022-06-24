<template>
  <div class="login container-xxl text-center form-signin">
    <form @submit.prevent="submit">
      <h1 class="h3 mb-3 fw-normal">Добро пожаловать</h1>
      <div class="form-floating">
        <input
          v-model="data.email"
          type="email"
          class="form-control"
          id="floatingInput"
          placeholder="name@example.com"
        />
      </div>
      <div class="form-floating">
        <input
          v-model="data.password"
          type="password"
          class="form-control"
          id="floatingPassword"
          placeholder="Password"
        />
      </div>
      <button class="w-100 btn btn-lg btn-primary" type="submit">
        Войти
      </button>
      <p class="mt-5 mb-3 text-muted">
        Нужна помощь? Пишите на support@questionnaire.ru
      </p>
    </form>
  </div>
</template>

<script>
import { reactive } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "Login",
  setup() {
    const data = reactive({
      email: "",
      password: "",
    });

    const router = useRouter();

    const submit = async () => {
      await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((jwt) => {
          localStorage.setItem("Authorization", jwt.token);
          console.log(`Authorization = ${jwt.token}`);
        });
      
      await router.push("/");
    };

    return {
      data,
      submit,
    };
  },
};
</script>
<style>
.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}
</style>