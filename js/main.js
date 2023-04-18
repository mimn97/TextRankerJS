$(document).ready(function () {
    const pageSize = 10;
    let currentPage = 1;
    let collectedData = [];

   function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function getMethodsNames(example){
        const numMethods = Object.keys(example).length;
        const baseMethod = "method";
        const methodsNames = [];
        for (let i = 0; i < numMethods; i++) {
          const letter = String.fromCharCode("A".charCodeAt(0) + i);
          methodsNames.push(baseMethod + letter);
        }
        return methodsNames;
    }

    function renderExamples() {
        const start = (currentPage - 1) * pageSize;
        const end = currentPage * pageSize;
        const currentExamples = examples.slice(start, end);

        const exampleContainer = $("#example-container");
        exampleContainer.empty();

        currentExamples.forEach((example, index) => {
            const exampleIndex = start + index;
            
            let savedRanking = null;
                if (window.localStorage) {
                const savedData = localStorage.getItem(`example-${exampleIndex}`);
                if (savedData) {
                    savedRanking = JSON.parse(savedData).ranking;
                }
            }

            const methodsNames = getMethodsNames(example);
            const randomizedMethods = savedRanking || shuffleArray(methodsNames);

            let exampleHtml = `<div class="container example">`;
            exampleHtml += `<ul class="list-group sortable" data-example-index="${exampleIndex}">`;
            randomizedMethods.forEach((method, idx) => {
                exampleHtml += `
                    <li class="list-group-item ${method}" data-method="${method}">
                        ${example[method]}
                    </li>`;
            });
            exampleHtml += `</ul></div>`;

            exampleContainer.append(exampleHtml);
            handleRanking(exampleIndex, randomizedMethods);
        });

        $(".sortable").sortable({
            stop: function (event, ui) {
                const exampleIndex = $(this).data("example-index");
                const ranking = $(this).sortable("toArray", { attribute: "data-method" });
                handleRanking(exampleIndex, ranking);
            },
        });
    }

    function handleRanking(exampleIndex, ranking) {
        const data = {
            exampleIndex: exampleIndex,
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
            const pageItem = $(`<li class="page-item"><a class="page-link" href="#">${i}</a></li>`);
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
        });
    }

    function init() {
        renderExamples();
        renderPagination();
        // Initialize event listeners for ranking and pagination...
    }

    $("#save-button").on("click", saveToFile);

    init();
});

