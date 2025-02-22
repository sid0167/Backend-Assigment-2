document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", function() {
            const taskElement = this.parentElement;
            const taskId = taskElement.getAttribute("data-id");

            fetch("/delete-task", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: taskId })
            }).then(response => response.json())
              .then(data => {
                  if (data.success) {
                      taskElement.style.opacity = "0";
                      setTimeout(() => taskElement.remove(), 300);
                  }
              });
        });
    });

    document.querySelectorAll(".toggle-btn").forEach(button => {
        button.addEventListener("click", function() {
            const taskElement = this.parentElement;
            const taskId = taskElement.getAttribute("data-id");

            fetch("/toggle-task", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: taskId })
            }).then(() => {
                taskElement.classList.toggle("completed");
            });
        });
    });

    document.querySelectorAll(".edit-btn").forEach(button => {
        button.addEventListener("click", function() {
            const taskElement = this.parentElement;
            const taskId = taskElement.getAttribute("data-id");
            const newText = prompt("Edit your task:", taskElement.querySelector(".task-text").innerText);

            if (newText) {
                fetch("/edit-task", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: taskId, newText })
                }).then(() => {
                    taskElement.querySelector(".task-text").innerText = newText;
                });
            }
        });
    });

    document.getElementById("clear-tasks").addEventListener("click", () => {
        fetch("/clear-tasks", { method: "POST" }).then(() => {
            document.getElementById("task-list").innerHTML = "";
        });
    });
});
