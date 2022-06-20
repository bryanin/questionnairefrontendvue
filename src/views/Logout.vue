<template>
  <div class="login container-xxl">
    <div class="logout">
      <h1>Вы действительно хотите выйти?</h1>
      <form @submit.prevent="submit">
        <h1 class="h3 mb-3 fw-normal">Выйти?</h1>
        <button class="w-100 btn btn-lg btn-primary" type="submit">
          Выйти
        </button>
        <p class="mt-5 mb-3 text-muted">
          Нужна помощь? Пишите на support@questionnaire.ru
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
export default {
  name: "Logout",
  setup() {
    const router = useRouter();
    const submit = async () => {
      localStorage.removeItem("Authorization");
      await router.push("/");
    };

    return {
      submit,
    };
  },
};
</script>