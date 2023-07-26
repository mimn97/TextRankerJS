function show_toy() {
	const messageContainer = document.getElementById("toy_page");
	messageContainer.innerHTML = `

	<br><h2>Toy Session</h2>
	`

	document.getElementById('toy_page').style.display = ""
}

function show_task_page(){
	document.getElementById('toy_page').style.display = "none";
	document.getElementById('task_page').style.display = "";
}

show_toy();