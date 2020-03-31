
import { base } from "./Static";

class APIBuilder {
	constructor(path, options) {
		this.path = path;
		this.options = options;
	}

	withTimeout(millis)  {
		this.controller = new AbortController();
		this.timeout = millis;
		this.options = { ...this.options, signal: this.controller.signal };
		return this;
	}

	body(payload) {
		this.options = { ...this.options, body: payload };
		return this;
	}

	async send() {
		if (this.controller) {
			setTimeout(() => this.controller.abort(), this.timeout - 10);  
		}

		const response = await fetch(new URL(this.path, base), this.options);
		return response.json();
	}
}

const get = (path, options = {}) => new APIBuilder(path, { method: "GET", ...options });
const post = (path, options = {}) => new APIBuilder(path, { method: "POST", ...options });


export default { get, post };