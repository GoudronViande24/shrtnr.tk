let res;
const searchButton = document.getElementById("searchbtn");
const form = document.getElementById("form");
const result = document.getElementById("result");

form.addEventListener("submit", shorten);

/**
 * Shorten a URL
 */
function shorten() {
	if (document.getElementById("text").value == "") {
		return alert("URL cannot be empty!");
	}

	searchButton.disabled = true;
	searchButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Please wait...';

	fetch(window.location.pathname, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ url: document.querySelector("#text").value })
	}).then((response) => {
		return response.json();
	}).then((myJson) => {
			res = myJson;
			searchButton.disabled = false;
			searchButton.innerHTML = ' Shorten it';
			if (res.key !== "")
				result.innerHTML = window.location.host + res.key;
			$('#exampleModal').modal('show')
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
function copyUrl(id = "result", attr) {
	let target = null;

	if (attr) {
		target = document.createElement('div');
		target.id = 'tempTarget';
		target.style.opacity = '0';
		if (id) {
			let curNode = document.querySelector('#' + id);
			target.innerText = curNode[attr];
		} else {
			target.innerText = attr;
		}
		document.body.appendChild(target);
	} else {
		target = document.querySelector('#' + id);
	}

	try {
		let range = document.createRange();
		range.selectNode(target);
		window.getSelection().removeAllRanges();
		window.getSelection().addRange(range);
		document.execCommand('copy');
		window.getSelection().removeAllRanges();
		console.log('Copy success');
	} catch (e) {
		console.log('Copy error');
	}

	if (attr) {
		// remove temp target
		target.parentElement.removeChild(target);
	}
}

// Activate popovers
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map((popoverTriggerEl) => {
  return new bootstrap.Popover(popoverTriggerEl);
});

console.log("https://github.com/GoudronViande24/shrtnr.tk/");