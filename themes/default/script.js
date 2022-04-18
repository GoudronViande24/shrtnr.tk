let res;
const searchButton = document.getElementById("searchbtn");
const form = document.getElementById("form");
const result = document.getElementById("result");
const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
const copyButton = document.getElementById("copy");

form.addEventListener("submit", shorten);
copyButton.addEventListener("click", copyUrl)

/**
 * Shorten a URL
 */
function shorten() {
	if (document.getElementById("text").value == "") {
		return alert("URL cannot be empty!");
	}

	searchButton.disabled = true;
	searchButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Please wait...';

	fetch("https://shrtnr.tk", {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ url: document.getElementById("text").value })
	}).then((response) => {
		return response.json();
	}).then((myJson) => {
		res = myJson;
		searchButton.disabled = false;
		searchButton.innerHTML = 'Shorten it!';
		if (res.key !== "" && res.shortUrl !== "") result.innerHTML = res.shortUrl;
		modal.show();
	}).catch((err) => {
		alert("Unknow error. Please retry!");
		console.log(err);
		searchButton.disabled = false;
		searchButton.innerHTML = 'Shorten it!';
	});
}

/**
 * Copy the result to clipboard
 * @param {string} id - The ID where the result is stored
 * @param {*} attr 
 */
function copyUrl() {
	const text = document.getElementById(result);

	text.select();
	text.setSelectionRange(0, 99999); // Mobile devices
	
	navigator.clipboard.writeText(text.value);
}

// Activate popovers
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map((popoverTriggerEl) => {
	return new bootstrap.Popover(popoverTriggerEl);
});

console.log("https://github.com/GoudronViande24/shrtnr.tk/");