### 1. Configuración inicial
``` Javascript
// URL de la API
const API_URL = 'https://jsonplaceholder.typicode.com/todos';

// Variables globales
let tasks = [];
let currentTaskId = null;
```
Explicación sencilla: Aquí estamos preparando nuestro "espacio de trabajo". Primero, guardamos la dirección de la API que vamos a usar, como si fuera la dirección de una tienda donde pediremos información. Luego, creamos dos "cajas vacías":
- tasks: una caja donde guardaremos todas nuestras tareas
- currentTaskId: un espacio para recordar qué tarea estamos editando (si no estamos editando ninguna, está vacío o "null")
### 2. Referencias a elementos HTML
``` Javascript
// Referencias a elementos del DOM
const taskForm = document.getElementById('task-form');
const titleInput = document.getElementById('title');
// ... más referencias

```
Explicación sencilla: Aquí estamos conectando nuestro JavaScript con el HTML. Es como crear "controles remotos" para diferentes partes de nuestra página web. Cada variable será un control que nos permitirá cambiar algo en la página:
- taskForm controla el formulario completo
- titleInput controla el campo donde escribimos el título de la tarea
- Y así con cada elemento que necesitamos manipular
### 3. Operaciones CRUD
#### CREATE - Crear una tarea
``` javascript
// CREATE - Crear una nueva tarea
async function createTask(title, completed) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({
                title: title,
                completed: completed === 'true',
                userId: 1
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        const newTask = await response.json();
        showStatus('Tarea creada correctamente (simulado)', 'success');

        // En JSONPlaceholder las operaciones son simuladas,
        // así que agregamos manualmente el elemento a nuestra lista
        newTask.id = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
        tasks.push(newTask);
        displayTasks();

        return newTask;
    } catch (error) {
        showStatus('Error al crear la tarea: ' + error.message, 'error');
    }
}

```
Explicación sencilla: Esta función es como enviar una carta para pedir un nuevo producto:
1. async function: Le decimos a JavaScript que esta función necesita esperar respuestas
2. fetch(API_URL, {method: 'POST', ...}): Enviamos una carta a la API diciendo "quiero añadir algo nuevo"
3. body: JSON.stringify({...}): En la carta incluimos los detalles de la tarea (título, si está completada)
4. await response.json(): Esperamos y leemos la respuesta
5. newTask.id = ...: Como JSONPlaceholder solo simula guardar la tarea, le asignamos nosotros un ID
6. tasks.push(newTask): Guardamos la nueva tarea en nuestra lista
7. displayTasks(): Actualizamos lo que se ve en pantalla
8. try/catch: Es como un plan B - si algo falla, mostramos un mensaje de error
#### READ - Leer tareas
``` javascript
// READ - Obtener todas las tareas
async function fetchTasks() {
    try {
        loadingDiv.style.display = 'block';
        tasksTable.classList.add('hidden');

        // Limitamos a 10 tareas para simplificar
        const response = await fetch(`${API_URL}?_limit=10`);
        tasks = await response.json();

        displayTasks();
    } catch (error) {
        showStatus('Error al cargar tareas: ' + error.message, 'error');
    } finally {
        loadingDiv.style.display = 'none';
        tasksTable.classList.remove('hidden');
    }
}

```
Explicación sencilla: Esta función es como pedir un catálogo de productos:
1. loadingDiv.style.display = 'block': Mostramos un mensaje de "cargando..." mientras esperamos
2. tasksTable.classList.add('hidden'): Ocultamos la tabla mientras cargamos
3. fetch( ${API_URL}?_limit=10 ): Pedimos a la API solo las primeras 10 tareas
4. tasks = await response.json(): Guardamos las tareas que nos envía la API
5. displayTasks(): Mostramos las tareas en la pantalla
6. finally: Al final, pase lo que pase, ocultamos el mensaje de carga y mostramos la tabla
#### UPDATE - Actualizar una tarea
``` javascript
// UPDATE - Actualizar una tarea existente
async function updateTask(id, title, completed) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                id: id,
                title: title,
                completed: completed === 'true',
                userId: 1
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        const updatedTask = await response.json();
        showStatus('Tarea actualizada correctamente (simulado)', 'success');

        // Actualizamos la tarea en nuestra lista local
        const index = tasks.findIndex(task => task.id == id);
        if (index !== -1) {
            tasks[index] = updatedTask;
            displayTasks();
        }

        return updatedTask;
    } catch (error) {
        showStatus('Error al actualizar la tarea: ' + error.message, 'error');
    }
}

```
Explicación sencilla: Esta función es como enviar un formulario para modificar un producto que ya existe:
1. fetch(`${API_URL}/${id}`, {method: 'PUT', ...}): Enviamos los nuevos datos a la API específicamente para la tarea con ese ID
2. body: JSON.stringify({...}): Incluimos todos los detalles actualizados
3. const index = tasks.findIndex(...): Buscamos en nuestra lista local la tarea que estamos actualizando
4. tasks[index] = updatedTask: Reemplazamos la tarea vieja por la actualizada
5. displayTasks(): Actualizamos lo que se ve en pantalla
#### DELETE - Eliminar una tarea
```javascript
// DELETE - Eliminar una tarea
async function deleteTask(id) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });

        showStatus('Tarea eliminada correctamente (simulado)', 'success');

        // Eliminamos la tarea de nuestra lista local
        tasks = tasks.filter(task => task.id != id);
        displayTasks();
    } catch (error) {
        showStatus('Error al eliminar la tarea: ' + error.message, 'error');
    }
}

```
Explicación sencilla: Esta función es como enviar una solicitud para eliminar un producto:
1. fetch(`${API_URL}/${id}`, {method: 'DELETE'}): Le decimos a la API que queremos borrar la tarea con ese ID
2. tasks = tasks.filter(task => task.id != id): Filtramos nuestra lista local para quitar la tarea eliminada
3. displayTasks(): Actualizamos la pantalla para reflejar los cambios
### 4. Funciones de apoyo
#### Mostrar tareas en pantalla
``` javascript
// Función para mostrar las tareas en la tabla
function displayTasks() {
    tasksList.innerHTML = '';

    tasks.forEach(task => {
        const row = document.createElement('tr');
        row.className = 'border-b hover:bg-gray-50';

        // Estado con código de color
        const statusClass = task.completed
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800';

        const statusText = task.completed ? 'Completado' : 'Pendiente';

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
    document.querySelectorAll('.edit').forEach(button => {
        button.addEventListener('click', handleEdit);
    });

    document.querySelectorAll('.delete').forEach(button => {
        button.addEventListener('click', handleDelete);
    });
}

```
Explicación sencilla: Esta función es como poner productos en un escaparate:
1. tasksList.innerHTML = '': Primero limpiamos el escaparate (la tabla)
2. tasks.forEach(task => {...}): Para cada tarea en nuestra lista...
3. Creamos una nueva fila ( tr) para la tabla
4. Añadimos clases de Tailwind para el estilo
5. Elegimos colores según el estado (verde para completado, amarillo para pendiente)
6. Rellenamos la fila con los datos de la tarea
7. Añadimos botones para editar y eliminar
8. tasksList.appendChild(row): Ponemos la fila en la tabla
9. Al final, hacemos que los botones "escuchen" cuando alguien haga clic
#### Mostrar mensajes de estado
``` javascript
// Función para mostrar mensajes de estado
function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.classList.remove('hidden', 'bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800');

    if (type === 'success') {
        statusDiv.classList.add('bg-green-100', 'text-green-800');
    } else {
        statusDiv.classList.add('bg-red-100', 'text-red-800');
    }

    setTimeout(() => {
        statusDiv.classList.add('hidden');
    }, 3000);
}

```
Explicación sencilla: Esta función es como mostrar un anuncio temporal:
1. statusDiv.textContent = message: Ponemos el mensaje que queremos mostrar
2. Quitamos todas las clases de color anteriores
3. Según el tipo de mensaje (éxito o error), elegimos un color (verde o rojo)
4. setTimeout(() => {...}, 3000): Configuramos un temporizador para que el mensaje desaparezca después de 3 segundos
### 5. Manejadores de eventos
``` javascript
// Manejar envío del formulario (crear)
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await createTask(titleInput.value, completedSelect.value);
    taskForm.reset();
});

// Manejar actualización de una tarea
updateBtn.addEventListener('click', async () => {
    await updateTask(currentTaskId, titleInput.value, completedSelect.value);
    resetForm();
});

// Manejar cancelación de edición
cancelBtn.addEventListener('click', resetForm);

```
Explicación sencilla: Aquí configuramos los "botones" para que hagan cosas cuando los presionamos:
1. taskForm.addEventListener('submit', ...): Cuando enviamos el formulario...
	- e.preventDefault(): Evitamos que la página se recargue
	- Llamamos a la función para crear una tarea
	- Limpiamos el formulario
2. updateBtn.addEventListener('click', ...): Cuando hacemos clic en "Actualizar"...
	- Llamamos a la función para actualizar la tarea
	- Reseteamos el formulario a su estado normal
3. cancelBtn.addEventListener('click', resetForm): Si hacemos clic en "Cancelar", volvemos al estado normal
#### Funciones de manejo
``` javascript
// Manejar clic en botón editar
function handleEdit(e) {
    const taskId = e.target.getAttribute('data-id');
    const task = tasks.find(t => t.id == taskId);

    if (task) {
        // Cambiar el formulario al modo edición
        titleInput.value = task.title;
        completedSelect.value = task.completed.toString();
        currentTaskId = task.id;

        // Mostrar botones de actualizar y cancelar, ocultar botón de agregar
        submitBtn.style.display = 'none';
        updateBtn.style.display = 'inline-block';
        cancelBtn.style.display = 'inline-block';
    }
}

// Manejar clic en botón eliminar
function handleDelete(e) {
    const taskId = e.target.getAttribute('data-id');
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
        deleteTask(taskId);
    }
}

// Función para resetear el formulario al modo de creación
function resetForm() {
    taskForm.reset();
    currentTaskId = null;
    submitBtn.style.display = 'inline-block';
    updateBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
}

```
Explicación sencilla:
1. handleEdit: Cuando hacemos clic en "Editar"...
	- Buscamos la tarea que queremos editar
	- Llenamos el formulario con los datos de esa tarea
	- Cambiamos los botones (ocultamos "Agregar", mostramos "Actualizar" y "Cancelar")
	- Guardamos el ID de la tarea que estamos editando
2. handleDelete: Cuando hacemos clic en "Eliminar"...
	- Preguntamos al usuario si está seguro
	- Si dice que sí, eliminamos la tarea
3. resetForm: Esta función "limpia" el formulario...
	- Borra todos los campos
	- Olvidamos qué tarea estábamos editando
	- Restaura los botones originales (muestra "Agregar", oculta "Actualizar" y "Cancelar")
### 6. Iniciar la aplicación
``` javascript
// Cargar tareas al iniciar la aplicación
document.addEventListener('DOMContentLoaded', fetchTasks);

```
Explicación sencilla: Esta línea es como decir "cuando la página termine de cargar, busca las tareas". Esto asegura que nuestra aplicación comience mostrando las tareas existentes tan pronto como esté lista.
### Analogía final para tus estudiantes
Imagina que nuestra aplicación es como una tienda:
- El HTML es el edificio (la estructura)
- Tailwind CSS es la decoración (cómo se ve)
- JavaScript es el personal (lo que hace funcionar todo)
Dentro de JavaScript:
- Las variables globales son como el inventario y la memoria del personal
- Las funciones CRUD son como los procedimientos para:
	- Recibir nuevos productos (CREATE)
	- Mostrar productos en los estantes (READ)
	- Cambiar etiquetas de precio o descripción (UPDATE)
	- Quitar productos que ya no se venden (DELETE)
- Los "event listeners" son como las instrucciones que tiene el personal sobre qué hacer cuando un cliente pulsa un botón o llena un formulario
Todo esto trabaja junto para crear una aplicación que permite a los usuarios gestionar una lista de tareas de forma interactiva y visualmente agradable.
