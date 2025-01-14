$(document).ready(function () {

    function show_instruction() {
		const messageContainer = document.getElementById("instruction_page");
		messageContainer.innerHTML = `
		<br><h2>Instructions</h2>
        <p>
        Thank you for participating in this study! Please read the instructions carefully. 
        </p>
        	<p>
        	In this study, you will be shown <b>a list of answers generated by different types of artificial intelligence (AI) models</b>,
			given an instruction question and a reference sentence generated by a human annotator.
        	</p>
			<p> For each instruction, your task is to <b>rank those AI-generated answers by your preference,</b> in terms of the following points:
			<ul>
				<li>(1) which answer sounds better reasonable with respect to the instruction question, and </li> 
				<li>(2) whether each answer aligns well with the reference sentence. (Please note that the reference answer is one possible answer to the instruction question.) </li>
			</ul>
			
    		<p> Here is a <b>toy example</b> to walk you through the entire system: 

			<figure class='text-center'>
				<img src="https://mimn97.github.io/TextRankerJS/instruction_fig1.svg" alt="Figure 1 - dkdk" width="" height="550">
				<figcaption>Figure 1 - The example interface of a task </figcaption>
			</figure>
			</p>
			<p>
			Figure 1 shows an example of tasks that we ask you to complete for the study. 
			Here, you are shown the <b style="color:#5389E3">“instruction”</b> about asking if women having mustaches are common or not, provided the <b style="color:green">“reference”</b> context for any LLM when generating its own answer. 
			Given the two sentences, you will see a stack of answers that have been generated by different LLM systems (labeled as <b>System A, B, etc.</b>). 
			Note that those answers are <b><i>draggable and droppable</i></b>. 
        	</p>

			<br>
			<p>
			<b style="color:blue">Next steps</b> are as follows: <br>
			<ol>
				<li> Read thoughtfully each of answers in the stack. </li>
				<li> Rank the quality of answer by each system from the top to the bottom, by <b style="color:red">dragging and dropping the system with most quality of answer to the top, 
				followed by the second most one, and so on. </b> Then, you will place the least to the bottom. 
				Note that you can always swap a former answer that have been rated with the latter one, if the latter sounds better. </li>
				<li> Drag and drop <b>the black bar</b> <b style="color:red">right below</b> the answer that aligns at least with the instruction and the reference. The bar works as a "threshold." </li>
				<li>After ranking all answers, then click to the <b style="color:blue">next page</b>. </li>

			</ol>
			</p>
			
			<p> Here are some examples you may attempt to rank the answers: </p>

			<p> 
			After reading System A that answers only no, if you think system B sounds better because it provides more thoughtful explanations with why it thinks so, 
			then you may <b>drag and drop the system B to the top</b>, swapping with the System A. <b>(Figure 2)</b>.
				<figure class='text-center'>
					<img src="https://mimn97.github.io/TextRankerJS/instruction_fig2.svg" alt="Figure 2 - dkdk" width="1100" height="550">
				<figcaption>Figure 2 - (Left) System A and B swapped with each other; (Right) Ranked System </figcaption>
				</figure>
			</p>
        	<br>

			<br>
			You will be given <b>five instruction sentences in total for this work </b>. 
			After finishing ranking all those five instructions at the last page, you will <b> click the submit button </b> that let you submit all your annotations. 
		
		<hr>
		<h3> Notes </h3>
		<p>Please keep in mind that there is no “answer” for every instruction in this study: you are asked to provide your own thoughts on ranking all those answers with your preference. </p>
		
		Click <b style="color:blue">Start Toy Tasks</b> below to start.
		<br><br>

		<button id="start_button" class="btn btn-primary" onclick="show_toy_page()">Start Toy Session</button>
		
		<hr/>`

        document.getElementById('instruction_page').style.display = "";
		document.getElementById('toy_page').style.display = "none";
		document.getElementById('task_page').style.display = "none";
    }

	show_instruction();

});

function show_toy_page(){
	document.getElementById('instruction_page').style.display = "none";
	document.getElementById('toy_page').style.display = "";
}