function show_task() {
	const messageContainer = document.getElementById("task_page");
	messageContainer.innerHTML = `

	<br><h2>Task Session</h2>
	`
	document.getElementById('toy_page').style.display = "none";
    document.getElementById('task_page').style.display = "";
}

show_task();