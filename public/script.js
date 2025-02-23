document.addEventListener("DOMContentLoaded", () => {
    const taskList = document.getElementById("task-list");

    taskList.addEventListener("click", (event) => {
        const taskElement = event.target.closest("li");
        if (!taskElement) return;

        const taskId = taskElement.getAttribute("data-id");

        if (event.target.classList.contains("delete-btn")) {
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
        }

        if (event.target.classList.contains("toggle-btn")) {
            fetch("/toggle-task", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: taskId })
            }).then(() => {
                taskElement.classList.toggle("completed");
            });
        }

        if (event.target.classList.contains("edit-btn")) {
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
        }
    });

    document.getElementById("clear-tasks").addEventListener("click", () => {
        fetch("/clear-tasks", { method: "POST" }).then(() => {
            taskList.innerHTML = "";
        });
    });
});
