window.addEventListener('load', main);

let navigator = null;
let generate_summary_button = null;
let context_description_input = null;

// Once the summary of the context description is generated
let context_description_summary = null;
let summary_accurate_div = null;
let summary_accurate_yes_button = null;
let summary_accurate_no_button = null;

// When the answer to 'Does this summary accurately reflect your system?' is 'No'
let edit_description_message = null;

// Once the risk analysis is generated
let risk_analysis = null;

function main() {
    navigator = document.querySelector("#coras-navigator");
    
    generate_summary_button = document.querySelector("#generate-summary-button");
    generate_summary_button.addEventListener("click", onGenerateSummaryButtonClick);
    
    context_description_input = document.querySelector("#context-description-input");
}

function setEnabledStateOfElements(state, list) {
    for (element in list) {
        if (element == null) {
            continue;
        }
        element.disabled = state;
    }
}

function insertAfter(newElement, existingElement) {
    if (existingElement == null) {
        console.log("ERROR: Tried to insert node after null");
        return;
    }

    existingElement.parentNode.insertBefore(newElement, existingElement.nextSibling);
}

function newElement({element_type, innerHTML="", id="", classes=[], type="", children=[]}) {
    let element = document.createElement(element_type);
    element.innerHTML = innerHTML;
    element.id = id;
    classes.forEach((class_name) => { element.classList.add(class_name); });
    element.type = type;
    children.forEach((child) => { element.appendChild(child); });
    return element;
}

function onGenerateSummaryButtonClick() {
    setEnabledStateOfElements(true, [generate_summary_button, context_description_input]);
    fetch('/generate_summary', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ 
            'context-description': context_description_input.value
        })
    }).then(function (response) {
        if (response.ok) {
            response.json().then(function (response_json) {
                onContextDescriptionSummaryReceived(response_json);
                setEnabledStateOfElements(false, [generate_summary_button, context_description_input]);
            });
        } else {
            throw Error("Something went wrong");
        }
    }).catch(function (error) {
        console.log(error);
        setEnabledStateOfElements(false, [generate_summary_button, context_description_input]);
    });
}

function onContextDescriptionSummaryReceived(summary_json) {
    if (context_description_summary == null) {
        navigator.appendChild(newElement({
            element_type: "p", 
            innerHTML: "Here is a summary of the context description you provided: "
        }));
        context_description_summary = newElement({  
            element_type: "p",
            classes: ["generated-text"]
        });
        navigator.appendChild(context_description_summary);
        navigator.appendChild(newElement({
            element_type: "p",
            innerHTML: "Does this summary accurately reflect your system?"
        }));
        summary_accurate_yes_button = newElement({
            element_type: "button",
            innerHTML: "Yes, proceed to the risk analysis"
        });
        summary_accurate_yes_button.addEventListener("click", onSummaryAccurateYesButtonClick);
        summary_accurate_no_button = newElement({
            element_type: "button",
            innerHTML: "No"
        });
        summary_accurate_no_button.addEventListener("click", onSummaryAccurateNoButtonClick);
        summary_accurate_div = newElement({
            element_type: "div",
            classes: ["action-buttons"],
            children: [summary_accurate_yes_button, summary_accurate_no_button]
        });
        navigator.appendChild(summary_accurate_div);
    }
    
    let summary = summary_json['summary'];
    context_description_summary.innerHTML = summary;
}

function onSummaryAccurateYesButtonClick() {
    if (edit_description_message != null) {
        edit_description_message.style.display = 'none';
    }

    fetch('/perform_analysis', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
            'context-description': context_description_summary.value
        })
    }).then(function (response) {
        if (response.ok) {
            response.json().then(function (response_json) {
                onRiskAssessmentAnalysisReceived(response_json);
            });
        } else {
            throw Error("Something went wrong");
        }
    }).catch(function (error) {
        console.log(error);
    });
}

function onSummaryAccurateNoButtonClick() {
    if (edit_description_message == null) {
        edit_description_message = newElement({
            element_type: "p",
            innerHTML: "Please edit the context description of your system."
        });
        insertAfter(edit_description_message, summary_accurate_div);
    }

    edit_description_message.style.display = 'block';    
}

function onRiskAssessmentAnalysisReceived(response_json) {
    if (risk_analysis == null) {
        navigator.appendChild(newElement({
            element_type: "p",
            innerHTML: "Risk assessment:"
        }));
        risk_analysis = newElement({
            element_type: "p",
            classes: ["generated-text"]
        });
        navigator.appendChild(risk_analysis);
        navigator.appendChild(newElement({
            element_type: "div",
            classes: ["coras-model-container"]
        }));
    }

    let text_of_analysis = response_json['analysis'];
    let coras_json = response_json['coras'];
    risk_analysis.innerHTML = text_of_analysis;
}

