const host = "https://api.service.com/v1";

function objectToQueryString(obj) {
	return Object.keys(obj).map(key => key + "=" + obj[key]).join("&");
}

function generateErrorResponse(message) {
	return { error: message	};
}

async function request(url, params, method = "GET") {
	const options = { method };
	if (params) {
		if (method === "GET") {
			url += "?" + objectToQueryString(params);
		} else {
			options.body = JSON.stringify(params);
		}
	}

	const response = await fetch(new URL(url, host), options);
	if (response.status !== 200) {
		return generateErrorResponse("Server return with unexpected status code");
	} else {
		return await response.json();
	}
}



export function post(url, params) {
	return request(url, params, "POST");
}

export function get(url, params) {
	return request(url, params);
}

export function put(url, params) {
	return request(url, params, "PUT");
}

export function remove(url, params) {
	return request(url, params, "DELETE");
}
