<template>
  <div class="projects container-xxl">
    <h1>Проекты</h1>
    <div class="add-project text-right me-right">
      <button type="button" class="btn btn-primary float-right me-right" @click="addProject">Новый проект</button>
    </div>
    <div class="search">
      <input
        type="text"
        id="project_search"
        v-model="filter"
        @input="filterProjects"
        placeholder="Поиск по всем столбцам"
      />
    </div>
    <div class="table-responsive-md" v-if="projects">
      <table class="table table-sm table-striped table-bordered table-hover">
        <thead class="table-light">
          <th>ID</th>
          <th>№ в 1С</th>
          <th>Название</th>
          <th>Описание</th>
          <th>Инициатор</th>
          <th>Адрес</th>
          <th>Дата создания</th>
          <th></th>
        </thead>
        <tbody class="table-striped">
          <tr v-for="project in projects" :key="project.id">
            <td class="project">{{ project.id }}</td>
            <td>{{ project.id_1C }}</td>
            <td>{{ project.title }}</td>
            <td>{{ project.description }}</td>
            <td>{{ project.ownerEmail }}</td>
            <td>{{ project.city }}</td>
            <td>{{ project.createdAt }}</td>
            <td>
              <button
                type="button"
                class="btn btn-secondary"
                @click="
                  this.$router.push({
                    name: 'projectdetails',
                    params: { id: project.id },
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
</template>
<script>
const baseURL = "http://localhost:8080/api/v1";
export default {
  name: "ProjectsList",
  data() {
    return {
      projects: null,
      users: null,
      filter: "",
      filteredProjects: [],
      
    };
  },
  methods: {
    async getAllData() {
      try {
        const projectRes = await fetch(`${baseURL}/project`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: localStorage.Authorization,
          },
          credentials: "include",
          body: null,
        });
        if (!projectRes.ok) {
          if (projectRes.status == 401) {
            console.log('401 Error: You should login');
            this.$router.push('/login');
          }
          const message = `An error has occured: ${projectRes.status} - ${projectRes.statusText}`;
          console.log(message);
        }
        const projectData = await projectRes.json();
        this.projects = projectData;
        this.projects.forEach((project) => {
          project.createdAt = new Date(project.createdAt).toLocaleDateString(
            "ru-RU"
          );
        }
        );
        
      } catch (err) {
        this.projects = err.message;
      }
    },

    async filterProjects() {
      this.filteredProjects = [];
      let all_project_TDs = document.querySelectorAll("td.project");
      this.projects.forEach((project) => {
        const idModified = project.id.toString().toLowerCase();
        const id1CModified = project.id_1C.toString().toLowerCase();
        const titleModified = project.title.toLowerCase();
        const descriptionModified = project.description.toLowerCase();
        const ownerEmailModified =
          project.ownerEmail.toLowerCase();
        const addressModified = project.city.toLowerCase();
        const createdAtModified = project.createdAt.toLowerCase();
        const searchTerm = this.filter.toLowerCase();
        if (
          idModified.includes(searchTerm) ||
          id1CModified.includes(searchTerm) ||
          titleModified.includes(searchTerm) ||
          descriptionModified.includes(searchTerm) ||
          ownerEmailModified.includes(searchTerm) ||
          addressModified.includes(searchTerm) ||
          createdAtModified.includes(searchTerm) ||
          searchTerm == ""
        ) {
          this.filteredProjects.push(project);
        }
      });

      if (this.filteredProjects != null) {
        let filteredProjectIDs = [];
        this.filteredProjects.forEach((filteredProject) => {
            filteredProjectIDs.push(filteredProject.id.toString());
        });

        [...all_project_TDs].forEach((projectTD) => {
            if (!filteredProjectIDs.includes(projectTD.innerHTML)) {
              projectTD.parentElement.classList.add("hidden-element");
            } else {
              projectTD.parentElement.classList.remove("hidden-element");
            }
        });
      }
    },
    async addProject() {
      await this.$router.push('/project/new');
    }

  },
  created: function () {
    this.getAllData();
  },
};
</script>
<style>
.hidden-element {
  display: none;
}
.search {
  margin: 10px;
  text-align: center;
}
#project_search {
  width: 50%;
}
.highlight {
  background-color: yellow;
}

</style>