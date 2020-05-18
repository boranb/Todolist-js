// Tüm elementleri seçme
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");


eventListeners();

function eventListeners() { // tüm event listenerlar

    form.addEventListener("submit", addTodo); // form gönderildiğinde çalışacak event
    document.addEventListener("DOMContentLoaded", loadAllTodosToUI); // sayfa yüklendiğinde çalışacak event
    secondCardBody.addEventListener("click", deleteTodo);
    filter.addEventListener("keyup", filterTodos);
    clearButton.addEventListener("click", clearAllTodos);
}


function clearAllTodos(e) {
    if (confirm("Tümünü silmek istediğinize emin misiniz ?\nBu işlem geri alınamaz!")) {
        // Arayüzden todoları temizleme
        // todoList.innerHTML = ""; // Yavaş
        while (todoList.firstElementChild != null) {
            todoList.removeChild(todoList.firstElementChild);
        }
        localStorage.removeItem("todos");
    }
}

function filterTodos(e) {
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(listItem => {
        const text = listItem.textContent.toLowerCase();

        if (text.indexOf(filterValue) === -1) {

            //bulunamadıysa
            listItem.setAttribute("style", "display : none !important"); // bulunmayan list item'ların display özellikleri none oldu.
        } else {

            // bulunduysa
            listItem.setAttribute("style", "display : block"); // bulunan list item'ların display özellikleri block oldu.
        }
    });
}

function deleteTodo(e) {
    if (e.target.className === "fa fa-remove") {

        let agree = confirm("Bu içeriği silmek istediğinizden emin misiniz ?\nBu işlem geri alınamaz!");
        if (agree) {

            e.target.parentElement.parentElement.remove();
            deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
            showAlert("success", "Başarılı!  Todo silindi.");
        }
    }
}

function deleteTodoFromStorage(deleteTodo) {
    let todos = getTodosFromStorage();

    todos.forEach(function(todo, index) {
        if (todo === deleteTodo) {
            todos.splice(index, 1); // Arrayden değeri silme.
        }
    });
    localStorage.setItem("todos", JSON.stringify(todos));
}

function loadAllTodosToUI() { // localStorage'daki değerleri tekrar tabloya yazdırma
    let todos = getTodosFromStorage();

    // todos.forEach(function(todo) {
    //     addTodoToUI(todo);
    // });

    todos.forEach(todo => {
        addTodoToUI(todo);
    });

}

function addTodo(e) {
    const newTodo = todoInput.value.trim(); // string değeri alma

    if (newTodo === "") {
        /*
            <div class="alert alert-danger" role="alert">
                    <h4 class="alert-heading">Hata!</h4>
                    <p>Lütfen geçerli bir giriş yapınız.</p>
            </div>        
        */
        showAlert("danger", "Hata!  Lütfen geçerli bir giriş yapınız.");
    } else {
        addTodoToUI(newTodo); // string değeri gönderdiğimiz fonksiyon
        showAlert("success", "Başarılı!  Todo eklendi.")
        addTodoToStorage(newTodo);
    }

    e.preventDefault();
}


function getTodosFromStorage() { // storage'dan todo ları alma
    let todos;

    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));

    }
    return todos;
}


function addTodoToStorage(newTodo) {
    let todos = getTodosFromStorage();

    todos.push(newTodo);

    localStorage.setItem("todos", JSON.stringify(todos));
}


function showAlert(type, message) {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    console.log(alert);

    firstCardBody.appendChild(alert);

    // setTimeOut metotdu

    window.setTimeout(function() {
        alert.remove();
    }, 1500);

}

function addTodoToUI(newTodo) { // string değeri list item olarak UI a ekleme

    /* <li class="list-group-item d-flex justify-content-between">
                        Todo 1
                        <a href="#" class="delete-item">
                            <i class="fa fa-remove"></i>
                        </a>
                    </li> 
                    */



    // list item oluşturma
    const listItem = document.createElement("li");

    // link oluşturma
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class='fa fa-remove'></i>"

    listItem.className = "list-group-item d-flex justify-content-between";

    // text node ekleme
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);
    // list item'ı ul'ye ekleme (todoList'e);
    todoList.appendChild(listItem);
    // input'u temizleme
    todoInput.value = "";

}