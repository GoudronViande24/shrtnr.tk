const config = {
	no_ref: "off", // Control the HTTP referrer header, if you want to create an anonymous link that will hide the HTTP Referer header, please set to "on" .
	theme: "default", // Homepage theme, use the empty value for default theme. To use urlcool theme, please fill with "theme/urlcool" .
	cors: "on", // Allow Cross-origin resource sharing for API requests.
	unique_link: false, // If it is true, the same long url will be shorten into the same short url
	custom_link: false, // Allow users to customize the short url.
}

let response_header = {
	"content-type": "text/html;charset=UTF-8"
}

if (config.cors == "on") {
	response_header = {
		"content-type": "text/html;charset=UTF-8",
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "POST",
	}
}

async function randomString(len) {
	len = len || 6;
	let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
	let maxPos = $chars.length;
	let result = '';
	for (i = 0; i < len; i++) {
		result += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return result;
}

async function sha512(url) {
	url = new TextEncoder().encode(url)

	const url_digest = await crypto.subtle.digest(
		{
			name: "SHA-512",
		},
		url, // The data you want to hash as an ArrayBuffer
	)
	const hashArray = Array.from(new Uint8Array(url_digest)); // convert buffer to byte array
	const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
	return hashHex
}
async function checkURL(URL) {
	let str = URL;
	let Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
	let objExp = new RegExp(Expression);
	if (objExp.test(str) == true) {
		if (str[0] == 'h')
			return true;
		else
			return false;
	} else {
		return false;
	}
}
async function save_url(URL) {
	let random_key = await randomString()
	let is_exist = await LINKS.get(random_key)
	if (is_exist == null)
		return await LINKS.put(random_key, URL), random_key
	else
		save_url(URL)
}
async function is_url_exist(url_sha512) {
	let is_exist = await LINKS.get(url_sha512)
	if (is_exist == null) {
		return false
	} else {
		return is_exist
	}
}
async function handleRequest(request) {
	if (request.method === "POST") {
		let req = await request.json()
		if (!await checkURL(req["url"])) {
			return new Response(`{"status":500,"key":": Error: Url illegal."}`, {
				headers: response_header,
			})
		}
		let stat, random_key
		if (config.unique_link) {
			let url_sha512 = await sha512(req["url"])
			let url_key = await is_url_exist(url_sha512)
			if (url_key) {
				random_key = url_key
			} else {
				stat, random_key = await save_url(req["url"])
				if (typeof (stat) == "undefined") {
					// console.log(await LINKS.put(url_sha512, random_key))
				}
			}
		} else {
			stat, random_key = await save_url(req["url"])
		}
		if (typeof (stat) == "undefined") {
			console.log("https://shrtnr.tk/" + random_key, "==>", req["url"]);
			return new Response(`{"status":200,"key":"${random_key}","url":"${req["url"]}","shortUrl":"https://shrtnr.tk/${random_key}"}`, {
				headers: response_header,
			})
		} else {
			return new Response(`{"status":200,"key":": Error: Reached the KV write limitation."}`, {
				headers: response_header,
			})
		}
	} else if (request.method === "OPTIONS") {
		return new Response(``, {
			headers: response_header,
		})

	}

	const requestURL = new URL(request.url)
	const path = requestURL.pathname.split("/")[1]
	if (!path) {

		const html = await fetch("https://static.shrtnr.tk/themes/" + config.theme + "/index.html");

		return new Response(await html.text(), {
			headers: {
				"content-type": "text/html;charset=UTF-8",
			}
		});
	}
	const value = await LINKS.get(path);

	const location = value
	if (location) {
		if (config.no_ref == "on") {
			let no_ref = await fetch("https://static.shrtnr.tk/no-ref.html");
			no_ref = await no_ref.text();
			no_ref = no_ref.replace(/{Replace}/gm, location);
			return new Response(no_ref, {
				headers: {
					"content-type": "text/html;charset=UTF-8",
				},
			})
		} else {
			return Response.redirect(location, 302)
		}

	}

	// If request not in kv, return 404
	let html404 = await fetch(`https://static.shrtnr.tk/themes/${config.theme}/404.html`);
	html404 = await html404.text();

	return new Response(html404, {
		headers: {
			"content-type": "text/html;charset=UTF-8",
		},
		status: 404
	})
}



addEventListener("fetch", async event => {
	event.respondWith(handleRequest(event.request))
})
