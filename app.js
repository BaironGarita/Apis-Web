// URL de la API
const API_URL = "https://jsonplaceholder.typicode.com/todos";

// Variables globales
let tasks = [];
let currentTaskId = null;

// Referencias a elementos del DOM
const taskForm = document.getElementById("task-form");
const titleInput = document.getElementById("title");
const completedSelect = document.getElementById("completed");
const submitBtn = document.getElementById("submit-btn");
const updateBtn = document.getElementById("update-btn");
const cancelBtn = document.getElementById("cancel-btn");
const tasksList = document.getElementById("tasks-list");
const tasksTable = document.getElementById("tasks-table");
const loadingDiv = document.getElementById("loading");
const statusDiv = document.getElementById("status");

// Funciones principales del CRUD

// CREATE - Crear una nueva tarea
async function createTask(title, completed) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        title: title,
        completed: completed === "true",
        userId: 1,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    const newTask = await response.json();
    showStatus("Tarea creada correctamente (simulado)", "success");

    // En JSONPlaceholder las operaciones son simuladas,
    // así que agregamos manualmente el elemento a nuestra lista
    newTask.id = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
    tasks.push(newTask);
    displayTasks();

    return newTask;
  } catch (error) {
    showStatus("Error al crear la tarea: " + error.message, "error");
  }
}

// READ - Obtener todas las tareas
async function fetchTasks() {
  try {
    loadingDiv.style.display = "block";
    tasksTable.classList.add("hidden");

    // Limitamos a 10 tareas para simplificar
    const response = await fetch(`${API_URL}?_limit=10`);
    tasks = await response.json();

    displayTasks();
  } catch (error) {
    showStatus("Error al cargar tareas: " + error.message, "error");
  } finally {
    loadingDiv.style.display = "none";
    tasksTable.classList.remove("hidden");
  }
}

// UPDATE - Actualizar una tarea existente
async function updateTask(id, title, completed) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        id,
        title,
        completed: !completed,
        userId: 1,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    const updatedTask = await response.json();
    showStatus("Tarea actualizada correctamente (simulado)", "success");

    // Actualizamos la tarea en nuestra lista local
    const index = tasks.findIndex((task) => task.id == id);
    if (index !== -1) {
      tasks[index] = updatedTask;
      displayTasks();
    }

    return updatedTask;
  } catch (error) {
    showStatus("Error al actualizar la tarea: " + error.message, "error");
  }
}

// DELETE - Eliminar una tarea
async function deleteTask(id) {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    showStatus("Tarea eliminada correctamente (simulado)", "success");

    // Eliminamos la tarea de nuestra lista local
    tasks = tasks.filter((task) => task.id != id);
    displayTasks();
  } catch (error) {
    showStatus("Error al eliminar la tarea: " + error.message, "error");
  }
}

// Función para mostrar las tareas en la tabla
function displayTasks() {
  tasksList.innerHTML = "";

  tasks.forEach((task) => {
    const row = document.createElement("tr");
    row.className = "border-b hover:bg-gray-50";

    // Estado con código de color
    const statusClass = task.completed
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";

    const statusText = task.completed ? "Completado" : "Pendiente";

    row.innerHTML = `
            <td class="px-4 py-3">${task.id}</td>
            <td class="px-4 py-3">${task.title}</td>
            <td class="px-4 py-3">
                <span class="px-2 py-1 rounded-full text-xs font-medium ${statusClass}">
                    ${statusText}
                </span>
            </td>
            <td class="px-4 py-3">
                <div class="flex space-x-2">
                    <button class="edit bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors" 
                        data-id="${task.id}">
                        Editar
                    </button>
                    <button class="delete bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors" 
                        data-id="${task.id}">
                        Eliminar
                    </button>
                </div>
            </td>
        `;
    tasksList.appendChild(row);
  });

  // Añadir event listeners a los botones de acción
  document.querySelectorAll(".edit").forEach((button) => {
    button.addEventListener("click", handleEdit);
  });

  document.querySelectorAll(".delete").forEach((button) => {
    button.addEventListener("click", handleDelete);
  });
}

// Función para mostrar mensajes de estado
function showStatus(message, type) {
  statusDiv.textContent = message;
  statusDiv.classList.remove(
    "hidden",
    "bg-green-100",
    "text-green-800",
    "bg-red-100",
    "text-red-800"
  );

  if (type === "success") {
    statusDiv.classList.add("bg-green-100", "text-green-800");
  } else {
    statusDiv.classList.add("bg-red-100", "text-red-800");
  }

  setTimeout(() => {
    statusDiv.classList.add("hidden");
  }, 3000);
}

// Manejadores de eventos

// Manejar envío del formulario (crear)
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  await createTask(titleInput.value, completedSelect.value);
  taskForm.reset();
});

// Manejar actualización de una tarea
updateBtn.addEventListener("click", async () => {
  await updateTask(currentTaskId, titleInput.value, completedSelect.value);
  resetForm();
});

// Manejar cancelación de edición
cancelBtn.addEventListener("click", resetForm);

// Manejar clic en botón editar
function handleEdit(e) {
  const taskId = e.target.getAttribute("data-id");
  const task = tasks.find((t) => t.id == taskId);

  if (task) {
    // Cambiar el formulario al modo edición
    titleInput.value = task.title;
    completedSelect.value = task.completed.toString();
    currentTaskId = task.id;

    // Mostrar botones de actualizar y cancelar, ocultar botón de agregar
    submitBtn.style.display = "none";
    updateBtn.style.display = "inline-block";
    cancelBtn.style.display = "inline-block";
  }
}

// Manejar clic en botón eliminar
function handleDelete(e) {
  const taskId = e.target.getAttribute("data-id");
  if (confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
    deleteTask(taskId);
  }
}

// Función para resetear el formulario al modo de creación
function resetForm() {
  taskForm.reset();
  currentTaskId = null;
  submitBtn.style.display = "inline-block";
  updateBtn.style.display = "none";
  cancelBtn.style.display = "none";
}

// Cargar tareas al iniciar la aplicación
document.addEventListener("DOMContentLoaded", fetchTasks);
