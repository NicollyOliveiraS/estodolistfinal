if (!window.__estodolist_init) {
  window.__estodolist_init = true;

  let campoNovaTarefa;
  let botaoAdicionar;
  let listaTarefas;
  let campoPesquisa;
  let botoesFiltro;

  let tarefas = [];

  function carregarTarefasSalvas() {
    const salvas = localStorage.getItem('tarefas');
    if (salvas) {
      tarefas = JSON.parse(salvas);
      exibirTarefas(tarefas);
    }
  }

  function salvarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
  }

  function adicionarTarefa() {
    const texto = campoNovaTarefa.value.trim();
    if (texto === '') {
      alert('Digite uma tarefa antes de adicionar!');
      return;
    }

    const novaTarefa = {
      id: Date.now(),
      texto: texto,
      concluida: false
    };

    tarefas.push(novaTarefa);
    salvarTarefas();
    exibirTarefas(tarefas);
    campoNovaTarefa.value = '';
    campoNovaTarefa.focus();
  }

  function exibirTarefas(lista) {
    listaTarefas.innerHTML = '';

    for (let tarefa of lista) {
      const item = document.createElement('li');
      item.className =
        'flex justify-between items-center p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100 transition';

      if (tarefa.concluida) {
        item.classList.add('task-done');
      }

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'form-checkbox mr-3';
      checkbox.checked = tarefa.concluida;
      checkbox.onchange = function () {
        alternarConclusao(tarefa.id);
      };

      const textoTarefa = document.createElement('span');
      textoTarefa.textContent = tarefa.texto;
      textoTarefa.className = 'flex-grow cursor-pointer';
      textoTarefa.onclick = function () {
        alternarConclusao(tarefa.id);
      };

      const botoes = document.createElement('div');
      botoes.className = 'flex space-x-2';

      const botaoEditar = document.createElement('button');
      botaoEditar.textContent = '✏️';
      botaoEditar.className = 'px-2 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded';
      botaoEditar.onclick = function () {
        editarTarefa(tarefa.id);
      };

      const botaoExcluir = document.createElement('button');
      botaoExcluir.textContent = '🗑️';
      botaoExcluir.className = 'px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded';
      botaoExcluir.onclick = function () {
        excluirTarefa(tarefa.id);
      };

      botoes.appendChild(botaoEditar);
      botoes.appendChild(botaoExcluir);

      const left = document.createElement('div');
      left.className = 'flex items-center flex-grow';
      left.appendChild(checkbox);
      left.appendChild(textoTarefa);

      item.appendChild(left);
      item.appendChild(botoes);
      listaTarefas.appendChild(item);
    }

    atualizarEstatisticas();
  }

  function alternarConclusao(id) {
    tarefas = tarefas.map(t =>
      t.id === id ? { ...t, concluida: !t.concluida } : t
    );
    salvarTarefas();
    exibirTarefas(tarefas);
  }

  function editarTarefa(id) {
    const novaDescricao = prompt('Edite a tarefa:');
    if (!novaDescricao || novaDescricao.trim() === '') return;

    tarefas = tarefas.map(t =>
      t.id === id ? { ...t, texto: novaDescricao.trim() } : t
    );
    salvarTarefas();
    exibirTarefas(tarefas);
  }

  function excluirTarefa(id) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      tarefas = tarefas.filter(t => t.id !== id);
      salvarTarefas();
      exibirTarefas(tarefas);
    }
  }

  function pesquisarTarefas() {
    const termo = campoPesquisa.value.toLowerCase();
    const filtradas = tarefas.filter(t =>
      t.texto.toLowerCase().includes(termo)
    );
    exibirTarefas(filtradas);
  }

  function filtrarTarefas(tipo) {
    let filtradas = [];
    if (tipo === 'todos') filtradas = tarefas;
    else if (tipo === 'ativos' || tipo === 'pendentes')
      filtradas = tarefas.filter(t => !t.concluida);
    else if (tipo === 'concluidos' || tipo === 'concluidas')
      filtradas = tarefas.filter(t => t.concluida);
    exibirTarefas(filtradas);
  }

  function atualizarEstatisticas() {
    const total = tarefas.length;
    const concluidas = tarefas.filter(t => t.concluida).length;
    document.getElementById('total-tarefas').textContent = `Total: ${total} tarefas`;
    document.getElementById('tarefas-concluidas').textContent = `Concluídas: ${concluidas}`;
  }

  document.addEventListener('DOMContentLoaded', function () {
    campoNovaTarefa = document.getElementById('nova-tarefa-input');
    botaoAdicionar = document.getElementById('adicionar-btn');
    listaTarefas = document.getElementById('lista-de-tarefas');
    campoPesquisa = document.getElementById('pesquisa-input');
    botoesFiltro = document.querySelectorAll('.filter-btn');

    botaoAdicionar.addEventListener('click', adicionarTarefa);
    campoNovaTarefa.addEventListener('keydown', e => {
      if (e.key === 'Enter') adicionarTarefa();
    });

    campoPesquisa.addEventListener('input', pesquisarTarefas);

    botoesFiltro.forEach(btn => {
      btn.addEventListener('click', () => filtrarTarefas(btn.dataset.filter));
    });

    carregarTarefasSalvas();
  });
}
