// ==========================================
// 1. SELEÇÃO DOS ELEMENTOS DO DOM
// ==========================================
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');

// Estado em memória (Array de objetos: { id, text, completed })
let tasks = [];

// ==========================================
// 2. PERSISTÊNCIA DE DADOS COM LOCALSTORAGE
// ==========================================

/**
 * Salva o array de tarefas no LocalStorage.
 * Por que usamos JSON.stringify?
 * O LocalStorage aceita APENAS texto (strings). O JSON.stringify converte
 * o nosso array de objetos em formato de texto JSON legível para o navegador.
 */
function saveTasksToLocalStorage() {
  localStorage.setItem('todo_tasks_data', JSON.stringify(tasks));
}

/**
 * Carrega os dados salvos do LocalStorage.
 * Por que usamos JSON.parse?
 * Ele faz a operação inversa: lê a string JSON e a reconverte em um Array 
 * de Objetos nativo do JavaScript para que possamos usar métodos como .push, .map, .filter.
 */
function loadTasksFromLocalStorage() {
  const savedData = localStorage.getItem('todo_tasks_data');
  if (savedData) {
    tasks = JSON.parse(savedData);
  }
}

// ==========================================
// 3. RENDERIZAÇÃO DA INTERFACE (DOM)
// ==========================================

/**
 * Atualiza visualmente o DOM com base no array 'tasks'.
 */
function renderTasks() {
  // Limpa o conteúdo atual da <ul> para redesenhar a lista sem duplicar itens
  todoList.innerHTML = '';

  // Alterna a mensagem de lista vazia
  if (tasks.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
  }

  tasks.forEach((task) => {
    // document.createElement: Cria um novo elemento HTML na memória antes de inseri-lo na página
    const li = document.createElement('li');
    li.classList.add('todo-item');

    // classList.toggle: Adiciona ou remove a classe 'completed' com base no valor booleano (task.completed)
    li.classList.toggle('completed', task.completed);

    // Cria o span com o texto da tarefa
    const spanText = document.createElement('span');
    spanText.classList.add('todo-text');
    spanText.textContent = task.text;

    // Contêiner dos botões de ação
    const actionsContainer = document.createElement('div');
    actionsContainer.classList.add('todo-actions');

    // Botão Concluir / Desfazer
    const completeBtn = document.createElement('button');
    completeBtn.classList.add('btn-action', 'btn-complete');
    completeBtn.textContent = task.completed ? 'Desfazer' : 'Concluir';
    
    completeBtn.addEventListener('click', () => {
      toggleTaskCompletion(task.id);
    });

    // Botão Excluir
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn-action', 'btn-delete');
    deleteBtn.textContent = 'Excluir';
    
    deleteBtn.addEventListener('click', () => {
      deleteTask(task.id);
    });

    // appendChild: Conecta os elementos filhos dentro de seus respectivos elementos pais
    actionsContainer.appendChild(completeBtn);
    actionsContainer.appendChild(deleteBtn);

    li.appendChild(spanText);
    li.appendChild(actionsContainer);

    // Insere o <li> completo dentro da <ul> do HTML
    todoList.appendChild(li);
  });
}

// ==========================================
// 4. REGRAS DE NEGÓCIO (MANIPULAÇÃO DO ESTADO)
// ==========================================

/**
 * Adiciona uma nova tarefa
 */
function addTask(text) {
  const newTask = {
    id: Date.now(), // Gera um ID único simples usando timestamp
    text: text,
    completed: false
  };

  tasks.push(newTask);
  saveTasksToLocalStorage(); // Persiste no LocalStorage
  renderTasks();              // Atualiza o DOM
}

/**
 * Alterna entre concluída e pendente
 */
function toggleTaskCompletion(taskId) {
  tasks = tasks.map((task) => {
    if (task.id === taskId) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });

  saveTasksToLocalStorage();
  renderTasks();
}

/**
 * Remove a tarefa pelo ID
 */
function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasksToLocalStorage();
  renderTasks();
}

// ==========================================
// 5. EVENTOS E INICIALIZAÇÃO
// ==========================================

todoForm.addEventListener('submit', (event) => {
  // event.preventDefault(): Evita que a página recarregue ao submeter o formulário
  event.preventDefault();

  // .trim(): Remove espaços em branco nas pontas para evitar tarefas como "   "
  const taskText = todoInput.value.trim();

  // Validação de campo vazio
  if (taskText === '') {
    alert('Por favor, digite uma tarefa antes de adicionar!');
    todoInput.focus();
    return;
  }

  addTask(taskText);

  // Limpa o input e devolve o cursor para o campo
  todoInput.value = '';
  todoInput.focus();
});

// Ao terminar de carregar o HTML da página: carrega dados e renderiza
document.addEventListener('DOMContentLoaded', () => {
  loadTasksFromLocalStorage();
  renderTasks();
});