const nome = document.getElementById("nome");
const email = document.getElementById("dados");
const idade = document.getElementById("idade");
const senha = document.getElementById("senha");
const senha2 = document.getElementById("senha2");

const botao = document.getElementById("btnCadastro");
const btnLimpar = document.getElementById("btnLimpar");
const btnCancelar = document.getElementById("btnCancelar");

let editandoIndex = null;

// ====== BLOQUEAR APENAS NÚMEROS NA IDADE ======
idade.addEventListener("input", () => {
    idade.value = idade.value.replace(/\D/g, "");
});

// ====== LIMPAR CAMPOS ======
function limparCampos(){
    nome.value = "";
    email.value = "";
    idade.value = "";
    senha.value = "";
    senha2.value = "";

    document.querySelectorAll(".erro-msg").forEach(e => e.remove());

    document.querySelectorAll("input").forEach(i => {
        i.classList.remove("valido", "invalido");
    });
}

// ====== MENSAGENS ======
function mostrarErro(input, mensagem) {

    input.classList.remove("valido");
    input.classList.add("invalido");

    let msg = input.nextElementSibling;

    if (!msg || !msg.classList.contains("erro-msg")) {
        msg = document.createElement("small");
        msg.classList.add("erro-msg");
        input.after(msg);
    }

    msg.innerText = mensagem;
}

function mostrarValido(input) {

    input.classList.remove("invalido");
    input.classList.add("valido");

    let msg = input.nextElementSibling;

    if (msg && msg.classList.contains("erro-msg")) {
        msg.remove();
    }
}

// ====== VALIDAÇÕES ======
function validarNome() {
    const valor = nome.value.trim();
    const regex = /^[A-Za-zÀ-ÿ]+(\s[A-Za-zÀ-ÿ]+)+$/;

    if (valor === "") return mostrarErro(nome,"Nome obrigatório"), false;
    if (valor.length < 5) return mostrarErro(nome,"Mínimo 5 caracteres"), false;
    if (!regex.test(valor)) return mostrarErro(nome,"Nome e sobrenome"), false;

    mostrarValido(nome);
    return true;
}

function validarEmail() {
    const valor = email.value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (valor === "") return mostrarErro(email,"Email obrigatório"), false;
    if (!regex.test(valor)) return mostrarErro(email,"Email inválido"), false;

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const duplicado = usuarios.find((u, i) => 
        u.email === valor && i !== editandoIndex
    );

    if (duplicado) return mostrarErro(email,"Email já existe"), false;

    mostrarValido(email);
    return true;
}

function validarIdade() {
    const valor = parseInt(idade.value);

    if (idade.value === "") return mostrarErro(idade,"Idade obrigatória"), false;
    if (isNaN(valor)) return mostrarErro(idade,"Só números"), false;
    if (valor < 18 || valor > 120) return mostrarErro(idade,"18 a 120"), false;

    mostrarValido(idade);
    return true;
}

function validarSenha() {
    const valor = senha.value;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (valor === "") return mostrarErro(senha,"Senha obrigatória"), false;
    if (!regex.test(valor)) return mostrarErro(senha,"Senha fraca"), false;

    mostrarValido(senha);
    return true;
}

function validarConfirmacao() {
    if (senha2.value === "") return mostrarErro(senha2,"Confirme senha"), false;
    if (senha2.value !== senha.value) return mostrarErro(senha2,"Senhas diferentes"), false;

    mostrarValido(senha2);
    return true;
}

// ====== LISTAR USUÁRIOS ======
function listarUsuarios() {

    const lista = document.getElementById("listaUsuarios");
    lista.innerHTML = "";

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    usuarios.forEach((user, index) => {

        const li = document.createElement("li");

        li.innerHTML = `
            <strong>${user.nome}</strong> - ${user.email} (${user.idade})
            <button onclick="editarUsuario(${index})">Editar</button>
            <button onclick="removerUsuario(${index})">Excluir</button>
        `;

        lista.appendChild(li);
    });
}

// ====== EDITAR ======
function editarUsuario(index){

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const user = usuarios[index];

    nome.value = user.nome;
    email.value = user.email;
    idade.value = user.idade;
    senha.value = user.senha;
    senha2.value = user.senha;

    editandoIndex = index;

    botao.innerText = "Atualizar";
    btnCancelar.style.display = "inline";
}

// ====== CANCELAR ======
btnCancelar.addEventListener("click", () => {
    editandoIndex = null;
    botao.innerText = "Cadastrar";
    btnCancelar.style.display = "none";
    limparCampos();
});

// ====== REMOVER ======
function removerUsuario(index){

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    usuarios.splice(index, 1);

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    listarUsuarios();
}

// ====== SALVAR ======
botao.addEventListener("click", function(e){

    e.preventDefault();

    const v1 = validarNome();
    const v2 = validarEmail();
    const v3 = validarIdade();
    const v4 = validarSenha();
    const v5 = validarConfirmacao();

    if(!(v1 && v2 && v3 && v4 && v5)) return;

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuario = {
        nome: nome.value,
        email: email.value,
        idade: idade.value,
        senha: senha.value
    };

    if(editandoIndex !== null){
        usuarios[editandoIndex] = usuario;
        alert("Usuário atualizado ✅");
    } else {
        usuarios.push(usuario);
        alert("Cadastro realizado ✅");
    }

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    editandoIndex = null;
    botao.innerText = "Cadastrar";
    btnCancelar.style.display = "none";

    limparCampos();
    listarUsuarios();
});

// ====== BOTÃO LIMPAR ======
btnLimpar.addEventListener("click", function(){
    limparCampos();
});

// ====== VALIDAÇÃO EM TEMPO REAL ======
nome.addEventListener("input", validarNome);
email.addEventListener("input", validarEmail);
idade.addEventListener("input", validarIdade);
senha.addEventListener("input", validarSenha);
senha2.addEventListener("input", validarConfirmacao);

// ====== CARREGAR LISTA ======
window.addEventListener("load", listarUsuarios);

// ====== GARANTIR FUNCIONAMENTO DOS BOTÕES DA LISTA ======
window.editarUsuario = editarUsuario;
window.removerUsuario = removerUsuario;