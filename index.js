const DEFAULT_NUM_COMPONENTS = 2;

const addButton = document.getElementById("add-component-btn");
const removeButtons = document.getElementsByClassName("remove-component-btn");
const closeModalButton = document.getElementById("close-modal-button");
const form = document.getElementById("gpa-form");

// TODO: Add letter grades.

const handleFormSubmission = (e) => {
    if (e.preventDefault) e.preventDefault();

    let totalWeight = 0;
    let theoryTotalWeight = 0;
    let labTotalWeight = 0;
    let theoryComponents = [];
    let labComponents = [];

    const componentBlocks = document.getElementsByClassName("component-block");
    Array.from(componentBlocks).forEach((component) => {
        const name =
            component.getElementsByClassName("component-name")[0].value;
        const type =
            component.getElementsByClassName("component-type")[0].value;
        const weight = parseFloat(
            component.getElementsByClassName("weight")[0].value
        );
        const mark = parseFloat(
            component.getElementsByClassName("mark")[0].value
        );

        totalWeight += weight;

        if (type === "Theory") {
            theoryTotalWeight += weight;
            theoryComponents.push({ name, weight, mark });
        } else if (type === "Lab") {
            labTotalWeight += weight;
            labComponents.push({ name, weight, mark });
        } else {
            alert("An error occured.");
            return;
        }
    });

    if (totalWeight > 100) {
        alert("The total weighting exceeds 100.");
        return;
    }

    if (totalWeight < 100) {
        alert("The total weighting needs to be 100.");
    }

    let roundedTheoryMark = 0;
    let roundedLabMark = 0;
    let roundedTotalMark = 0;

    try {
        // Calculate Theory Mark
        let theoryAccumulator = 0;
        theoryComponents.forEach((comp) => {
            theoryAccumulator += comp.weight * (comp.mark / 100.0);
        });
        const unroundedTheoryMark = parseFloat(
            (theoryAccumulator / theoryTotalWeight) * 100.0
        );
        roundedTheoryMark =
            Math.round((unroundedTheoryMark + Number.EPSILON) * 100) / 100;
        console.log("Theory mark rounded:", roundedTheoryMark);

        // Calculate Lab Mark
        let labAccumulator = 0;
        labComponents.forEach((comp) => {
            labAccumulator += comp.weight * (comp.mark / 100.0);
        });
        const unroundedLabMark = parseFloat(
            (labAccumulator / labTotalWeight) * 100.0
        );
        roundedLabMark =
            Math.round((unroundedLabMark + Number.EPSILON) * 100) / 100;
        console.log("Lab mark rounded:", roundedLabMark);

        // Calculate total mark
        const totalAccumulator = theoryAccumulator + labAccumulator;
        const unroundedTotalMark = parseFloat(
            (totalAccumulator / totalWeight) * 100.0
        );
        roundedTotalMark =
            Math.round((unroundedTotalMark + Number.EPSILON) * 100) / 100;
        console.log("Overall mark rounded:", roundedTotalMark);
    } catch (ex) {
        alert("Error occurred when calculating grade.");
    }

    const resultsSection = document.getElementById("mark-results-section");
    let para;

    if (
        roundedTheoryMark &&
        typeof roundedTheoryMark === "number" &&
        roundedTheoryMark > 0
    ) {
        para = document.createElement("p");
        para.classList.add("results-text", "text-sm", "text-gray-500");
        const text = document.createTextNode(
            `Your theory mark is ${roundedTheoryMark}%.`
        );
        para.appendChild(text);
        resultsSection.appendChild(para);
    }

    if (
        roundedLabMark &&
        typeof roundedLabMark === "number" &&
        roundedLabMark > 0
    ) {
        para = document.createElement("p");
        para.classList.add("results-text", "text-sm", "text-gray-500");
        const text = document.createTextNode(
            `Your lab mark is ${roundedLabMark}%.`
        );
        para.appendChild(text);
        resultsSection.appendChild(para);
    }

    if (
        roundedTotalMark &&
        typeof roundedTotalMark === "number" &&
        roundedTotalMark > 0
    ) {
        para = document.createElement("p");
        para.classList.add("results-text", "text-sm", "text-gray-500");
        const text = document.createTextNode(
            `Your overrall mark in the course is ${roundedTotalMark}%.`
        );
        para.appendChild(text);
        resultsSection.appendChild(para);
    }

    // Open modal for results.
    const resultsModal = document.getElementById("results-modal");
    resultsModal.classList.remove("hidden");

    return false; // You must return false to prevent the default form behavior
};

const handleRemoveButtonClick = (e) => {
    if (e.preventDefault) e.preventDefault();
    const componentBlocks = document.getElementsByClassName("component-block");
    if (componentBlocks.length <= 1) return;
    const componentBlock = e.target.parentElement.parentElement;
    componentBlock.remove();
};

const handleAddNewComponentClick = (e) => {
    if (e.preventDefault) e.preventDefault();
    const componentBlocks = document.getElementsByClassName("component-block");
    const lastComponentBlock = componentBlocks[componentBlocks.length - 1];
    const blockClone = lastComponentBlock.cloneNode(true);
    const removeBtn = blockClone.getElementsByClassName(
        "remove-component-btn"
    )[0];
    removeBtn.addEventListener("click", handleRemoveButtonClick);
    lastComponentBlock.after(blockClone);
};

const handleCloseModalClick = (e) => {
    // Close modal for results.
    const resultsModal = document.getElementById("results-modal");
    resultsModal.classList.add("hidden");

    // Remove previous results.
    const resultsSection = document.getElementById("mark-results-section");
    while (resultsSection.firstChild) {
        resultsSection.removeChild(resultsSection.lastChild);
    }
};

form.addEventListener("submit", handleFormSubmission);
addButton.addEventListener("click", handleAddNewComponentClick);
closeModalButton.addEventListener("click", handleCloseModalClick);
Array.from(removeButtons).forEach((removeButton) => {
    removeButton.addEventListener("click", handleRemoveButtonClick);
});

for (let i = 0; i < DEFAULT_NUM_COMPONENTS; i++) {
    addButton.click();
}
