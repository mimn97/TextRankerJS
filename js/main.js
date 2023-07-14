$(document).ready(function () {
    let useDraggableInterface = $('#interface-type').val() === "draggable";
    // const useDraggableInterface = true;

    const colorizeBoxes = true;
    const colorizePerMethod = true;
    const showReferences = true;
    const shuffleMethods = true;
    const showGoldLabels = false;
    const pageSize = 5;
    
    const instructions_draggable = [
        `Reorder the text boxes by dragging and dropping to rank them.`,
        `Your rankings are saved automatically as you make changes.`,
        `When finished, click "Download" to save your rankings as a JSON file.`,
    ];
    const instructions_inputtable = [
        `Set the ranking of each text with integers (e.g., 1-N) – ties are allowed.`,
        `Your rankings are saved automatically as you make changes.`,
        `When finished, click "Download" to save your rankings as a JSON file.`,
    ];
    
    let collectedData = [];
    let currentPage = 1;
    
    const hash = window.location.hash;
    const pageRegex = /page=(\d+)/;
    if (hash && pageRegex.test(hash)) {
        const match = hash.match(pageRegex);
        currentPage = parseInt(match[1]);
    }

    function renderInstructions() {
        if(useDraggableInterface) {
            var instructions = instructions_draggable;
        }
        else {
            var instructions = instructions_inputtable;
        }
        const instructionsContainer = $("#instructions");
        instructionsContainer.empty();
        instHtml = ``;
        instructions.forEach((instruction, index) => {
            instHtml += `<li>${instruction}</li>`;
        });
        instructionsContainer.append(instHtml);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function removeItemFromArray(array, item){
        let index = array.indexOf(item);
        if (index !== -1) {
            array.splice(index, 1);
        }
        return array;
    }

    function renderExamples() {
        const start = (currentPage - 1) * pageSize;
        const end = currentPage * pageSize;
        const currentExamples = examples.slice(start, end);
        let numMethods = 0;

        const exampleContainer = $("#example-container");
        exampleContainer.empty();

        currentExamples.forEach((example, index) => {
            const exampleIndex = start + index;
            
            let savedMethods = null;
            let savedRanking = null;
            if (window.localStorage) {
                const savedData = localStorage.getItem(`example-${exampleIndex}`);
                if (savedData) {
                    const parsedData = JSON.parse(savedData);
                    savedMethods = parsedData.methods;
                    savedRanking = parsedData.ranking;
                }
            }
            var methodsNames = Object.keys(example);
            methodsNames = removeItemFromArray(methodsNames, "instruction");
            methodsNames = removeItemFromArray(methodsNames, "reference");
            methodsNames = removeItemFromArray(methodsNames, "gold_label");
            methodsNames = removeItemFromArray(methodsNames, "contrast_label");

            const numMethods = methodsNames.length;
            const methodsRanking = Array(numMethods).fill().map((_, i) => i+1);
            if(shuffleMethods){
                methodsNames = shuffleArray(methodsNames);
            }
            const randomizedMethods = savedMethods || methodsNames;
            const randomizedRanking = savedRanking || methodsRanking;
           

            let className = "methodAnon";
            let exampleHtml = ``;
            if(showReferences){
                exampleHtml += `<div class="container instruction"><div class="p-2 rounded">`
                exampleHtml += `<span class="badge bg-secondary text-light text-uppercase">Instruction</span><br /> `
                if(showGoldLabels) {
                    gold_label = example['gold_label'] || 'Reference';
                    exampleHtml += `<span class="badge bg-secondary text-light text-uppercase">${gold_label}</span><br /> `
                }
                exampleHtml += `${example['instruction']}</div></div> <br />`;
                exampleHtml += `<div class="container reference"><div class="p-2 rounded">`
                exampleHtml += `<span class="badge bg-secondary text-light text-uppercase">Reference</span><br /> `
                exampleHtml += `${example['reference']}</div></div>`;
            }
            exampleHtml += `<div class="container example">`;
            exampleHtml += `<ul class="list-group sortable" data-example-index="${exampleIndex}">`;
            randomizedMethods.forEach((method, idx) => {
                if(colorizeBoxes){
                    if(colorizePerMethod){
                        className = method;
                    }
                    else{
                        className = "method" + idx;
                    }
                }
                if(useDraggableInterface) {
                    exampleHtml += `
                        <li class="list-group-item ${className}" data-method="${method}">
                            <div class="row">
                            <div class="col-xs-auto"><span class="rank-number badge rounded-pill text-light">${idx + 1}</span></div>
                            <div class="col">${example[method]}</div>
                            </div>
                        </li>`;
                }
                else {
                    exampleHtml += `
                    <li class="list-group-item ${className}" data-method="${method}">
                        <div class="row">
                        <div class="col-xs-auto">
                        <input type="text" class="form-control form-control-sm rank-number-input rounded text-light" value="${randomizedRanking[idx]}" />
                        </div>
                        <div class="col">${example[method]}</div>
                        </div>
                    </li>`;
                }
            });
            exampleHtml += `</ul></div>`;
            exampleContainer.append(exampleHtml);

            handleRanking(exampleIndex, randomizedMethods, randomizedRanking);
        });


        if(useDraggableInterface) {
            $(".sortable").sortable({
                stop: function (event, ui) {
                    const exampleIndex = $(this).data("example-index");
                    $(this).find('span').each(function(idx){
                        $(this).html(idx + 1);
                    });
                    let methods = $(this).find('.list-group-item').map(function(){
                        return $(this).data('method');
                    }).get();
                    let ranking = $(this).find('.rank-number').map(function(){
                        return parseInt($(this).html());
                    }).get();
                    handleRanking(exampleIndex, methods, ranking);
                },
            });
        }
        else {
            $(".example .rank-number-input").on("change", function (e) {
                let val = parseInt($(this).val());
                let example = $(this).closest(".list-group");
                let exampleIndex = example.data("example-index");
                let methods = example.find('.list-group-item').map(function(){
                    return $(this).data('method');
                }).get();
                let ranking = example.find('.rank-number-input').map(function(){
                    return $(this).val();
                }).get();
                
                if(val < 1 || val > methods.length){
                    $(this).css("border", "2px solid #E66465");
                }
                else{
                    $(this).css("border", "0px");
                    handleRanking(exampleIndex, methods, ranking);
                }
            });
        }
    }

    function handleRanking(exampleIndex, methods, ranking) {
        const data = {
            exampleIndex: exampleIndex,
            methods: methods,
            ranking: ranking,
            timestamp: new Date().toISOString(),
        };
        collectedData[exampleIndex] = data;

        // Save data to a local file asynchronously
        if (window.localStorage) {
            const key = `example-${exampleIndex}`;
            const value = JSON.stringify(data);
            localStorage.setItem(key, value);
        } else {
            console.error("Local storage is not supported by your browser.");
        }
    }

    function saveToFile() {
        const jsonData = JSON.stringify(collectedData);
        const blob = new Blob([jsonData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "annotation_data.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function renderPagination() {
        const totalPages = Math.ceil(examples.length / pageSize);
        const pagination = $("#pagination");
        pagination.empty();

        for (let i = 1; i <= totalPages; i++) {
            const pageItem = $(`<li class="page-item"><a class="page-link" href="#page=${i}">${i}</a></li>`);
            if (i === currentPage) {
                pageItem.addClass("active");
            }
            pagination.append(pageItem);
        }

        $(".page-link").on("click", function (e) {
            e.preventDefault();
            currentPage = parseInt($(this).text());
            renderExamples();
            renderPagination();
            window.location.hash = `page=${currentPage}`;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function clearStorage() {
        const confirmed = confirm("Are you sure you want to clear the local storage? This action cannot be undone.");
        if (confirmed && window.localStorage) {
            localStorage.clear();
        }
    }

    function init() {
        renderInstructions();
        renderExamples();
        renderPagination();

        // Initialize event listeners for ranking and pagination...
        $("#save-button").on("click", saveToFile);
        $("#clear-storage-button").on("click", clearStorage);
    }

    init();
});