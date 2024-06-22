var optionButtons;
var nextQnButton;

document.addEventListener("DOMContentLoaded", function (event) {
	optionButtons = document.querySelectorAll(".option");
	nextQnButton = document.querySelector("#next-qn-button");

	initQn();
});

// ========== QUESTION UTILITIES ==========

function initQn() {
	console.log("=== Initialising question ===");

	resetOptions();
	$ajaxUtils.sendGetRequest("data/source.json", function(responseArray) {
		var randQnObj = fetchRandQn(responseArray);

		console.log(`Fetched random question: #${randQnObj.qnNum}`);

		displayQn(randQnObj);

		enableOptions();

		console.log("Waiting for input...");
	});

	nextQnButton.disabled = true;
	nextQnButton.addEventListener("click", initQn);
}

function fetchRandQn(responseArray) {
	if (!responseArray) {
		console.error("Error: Failed to fetch or parse question data.");
		return;
	} else {
		var randQnIdx = Math.floor(Math.random() * responseArray.length);
		return responseArray[randQnIdx];
	}
}

function displayQn (qnObj) {
	var { qnNum, sentence, wordToTest, options, correctAns } = qnObj;

	document.querySelector("#qn-number").textContent = `#${qnNum}`;

	var wordToTestIdx = sentence.indexOf(wordToTest);

	// Display formatted sentence
	document.querySelector("#sentence").innerHTML =
		`<p>${sentence.substring(0, wordToTestIdx)}<strong>${wordToTest}</strong>
        ${sentence.substring(wordToTestIdx + wordToTest.length)}</p>`;

	console.log("Sentence displayed");

	assignOptionsRandomly(options, correctAns);
};

function shuffle(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
};

// ========== ANSWER HANDLERS ==========

function correctAnsHandler() {
	console.log(`CORRECT ANS CLICKED!: ${this.textContent}`);

	this.classList.add("greenBorder");


	// displayExplanation();
	disableOptions();
	nextQnButton.disabled = false;
	console.log("Waiting for input...");
};

function wrongAnsHandler() {
	console.log(`WRONG ANS CLICKED!: ${this.textContent}`);

	this.classList.add("redBorder");

	document.querySelector(".correctAns").classList.add("greenBorder");

	// displayExplanation();
	disableOptions();
	nextQnButton.disabled = false;
	console.log("Waiting for input...");
};

// function displayExplanation() {
// 	// to add later
// };

// ========== OPTION UTILITIES ==========

function assignOptionsRandomly(options, correctAns) {
	shuffle(options);

	optionButtons.forEach((button, idx) => {
		var option = options[idx];
		button.textContent = option;

		if (option === correctAns) {
			// Correct option
			button.classList.add("correctAns");
			button.addEventListener("click", correctAnsHandler);
		} else {
			// Wrong option
			button.classList.add("wrongAns");
			button.addEventListener("click", wrongAnsHandler);
		}
	});

	console.log(`Options (${options}) randomly assigned and displayed`);
}

function enableOptions() {
	optionButtons.forEach(button => {
		button.disabled = false;
		button.classList.add("option-enabled");
	});

	console.log("Options enabled");
};

function disableOptions() {
	optionButtons.forEach(button => {
		button.disabled = true;
		button.classList.remove("option-enabled");
	});

	console.log("Options disabled");
};

function resetOptions() {
	optionButtons.forEach((button) => {
		button.classList = 'option';
		button.removeEventListener("click", correctAnsHandler);
		button.removeEventListener("click", wrongAnsHandler);
		button.textContent = "";
	});

	console.log("Options reset");
}