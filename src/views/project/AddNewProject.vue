<template>
  <div class="add-new-project container-xxl">
    <h1>Новый проект</h1>
    <form @submit.prevent="submit" class="row g-3">
      <div class="col-md-3">
        <label for="inputID1C" class="form-label">№ проекта 1С</label>
        <input 
        type="text" 
        class="form-control" 
        id="inputID1C" 
        placeholder="1C_000000"
        v-model="data.id_1C"
        />
      </div>
      <div class="col-12">
        <label for="inputTitle" class="form-label">Название</label>
        <input 
        type="text" 
        class="form-control" 
        id="inputTitle" 
        placeholder="Административно-офисное здание недалеко от м. Белорусская"
        v-model="data.title"
        />
      </div>
      <div class="col-12">
        <label for="inputDescription" class="form-label">Описание</label>
        <input 
          type="text" 
          class="form-control" 
          id="inputDescription" 
          placeholder="Реконструкция здания. Зааказчик Луис+, подрядчик МонтажСервис. Реализация в 2023 году"
          v-model="data.description"
          />
      </div>
      <div class="col-12">
        <label for="inputAddress2" class="form-label">Адрес</label>
        <input
          type="text"
          class="form-control"
          id="inputAddress2"
          placeholder="г. Москва, ул. 1-я Ямского Поля, д. 28, стр. 3"
          v-model="data.city"
        />
      </div>
      <div class="col-12">
        <button type="submit" class="btn btn-primary">Сохранить</button>
      </div>
    </form>
  </div>
</template>

<script>
import { reactive } from "vue";
import { useRouter } from "vue-router";
export default {
  name: "AddNewProject",
  setup() {
    const data = reactive({
      id_1C: "",
      title: "",
      description: "",
      ownerEmail: "",
      city: "",
      createdAt: "",
    });

    const router = useRouter();
    
    const addEmail = (data) => {
      data.ownerEmail = JSON.parse(atob(localStorage.Authorization.split('.')[1])).sub;
      return JSON.stringify(data);
    };

    const submit = async () => {
      await fetch("http://localhost:8080/api/v1/project/", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: localStorage.Authorization,
        },
        credentials: "include",
        body: addEmail(data),
      }).catch(err => {
        console.log(err.message);
      });
      
      await alert('Проект создан');
      await router.push("/project");
    };

    

    return {
      data,
      addEmail,
      submit,
    };
  },
};
</script>

<style>
</style>