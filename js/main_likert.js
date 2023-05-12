$(document).ready(function () {
    const colorizeBoxes = true;
    const colorizePerMethod = true;
    const showReferences = true;
    const shuffleMethods = true;
    const showGoldLabels = true;
    const pageSize = 10;
    
    const instructions = [
        `For each text box, provide a Validity rating (1-3 stars).`,
        `For each text box, provide a Naturalness rating (1-5 stars).`,
        `Your decisions are saved automatically as you make changes.`,
        `When finished, click "Download" to save your annotation as a JSON file.`,
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
            let savedValidity = null;
            let savedNaturalness = null;
            if (window.localStorage) {
                const savedData = localStorage.getItem(`example-${exampleIndex}`);
                if (savedData) {
                    const parsedData = JSON.parse(savedData);
                    savedMethods = parsedData.methods;
                    savedValidity = parsedData.validity;
                    savedNaturalness = parsedData.naturalness;
                }
            }

            var methodsNames = Object.keys(example);
            methodsNames = removeItemFromArray(methodsNames, "reference");
            methodsNames = removeItemFromArray(methodsNames, "gold_label");
            methodsNames = removeItemFromArray(methodsNames, "contrast_label");
            if(shuffleMethods){
                methodsNames = shuffleArray(methodsNames);
            }

            const numMethods = methodsNames.length;
            const methodsValidity = Array(numMethods).fill().map((_, i) => 2);
            const methodsNaturalness = Array(numMethods).fill().map((_, i) => 3);
            
            const randomizedMethods = savedMethods || methodsNames;
            const randomizedValidity = savedValidity || methodsValidity;
            const randomizedNaturalness = savedNaturalness || methodsNaturalness;

            let className = "methodAnon";
            let exampleHtml = ``;
            if(showReferences){
                exampleHtml += `<div class="container reference"><div class="p-2 rounded">`
                if(showGoldLabels) {
                    gold_label = example['gold_label'] || 'Reference';
                    exampleHtml += `<span class="badge bg-secondary text-light text-uppercase">${gold_label}</span><br /> `
                }
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
                
                exampleHtml += `
                    <li class="list-group-item ${className}" data-method="${method}">
                        <div class="row">
                            <div class="col">
                                ${example[method]}
                            </div>
                            <div class="col-auto text-right" >
                                <div class="validity-rating text-muted">
                                    <label>Validity: </label>
                                    <input 
                                        type="range" 
                                        id="validity-${exampleIndex}-${method}" 
                                        name="validity-${exampleIndex}-${method}" 
                                        min="1" 
                                        max="3"
                                        value="${randomizedValidity[idx]}"
                                    >
                                    <span class="range-value">${randomizedValidity[idx]}</span>
                                </div>
                                <div class="naturalness-rating">
                                    <label>Naturalness: </label>
                                    <input 
                                        type="range" 
                                        id="naturalness-${exampleIndex}-${method}" 
                                        name="naturalness-${exampleIndex}-${method}" 
                                        min="1" 
                                        max="5"
                                        value="${randomizedNaturalness[idx]}"
                                    >
                                    <span class="range-value">${randomizedNaturalness[idx]}</span>
                                </div>
                            </div>
                        </div>
                    </li>`;

            });
            exampleHtml += `</ul></div>`;
            exampleContainer.append(exampleHtml);

            let validityRatings = randomizedMethods.map(method => {
                return $('#validity-'+exampleIndex+'-'+method).val();
            });
            let naturalnessRatings = randomizedMethods.map(method => {
                return $('#naturalness-'+exampleIndex+'-'+method).val();
            });
            handleRating(exampleIndex, randomizedMethods, validityRatings, naturalnessRatings);
        });

        $(".example .list-group-item input[type='range']").on("input", function (e) {
            const rating = $(this).val();
            $(this).siblings(".range-value").text(rating);
        });

        $(".example .list-group-item input[type='range']").on("change", function (e) {
            let example = $(this).closest(".list-group");
            let exampleIndex = example.data("example-index");
            let methods = example.find('.list-group-item').map(function(){
                return $(this).data('method');
            }).get();
            let validityRatings = methods.map(method => {
                return $('#validity-'+exampleIndex+'-'+method).val();
            });
            let naturalnessRatings = methods.map(method => {
                return $('#naturalness-'+exampleIndex+'-'+method).val();
            });
            console.log(collectedData);
            handleRating(exampleIndex, methods, validityRatings, naturalnessRatings);
        });

    }

    function handleRating(exampleIndex, methods, validity, naturalness) {
        const data = {
            exampleIndex: exampleIndex,
            methods: methods,
            validity: validity,
            naturalness: naturalness,
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