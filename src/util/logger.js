const isDevelopment = process.env.NODE_ENV === "development";

// Create a logger that only logs in development
class Logger {
	constructor(namespace) {
		this.namespace = namespace;
		this.context = null;
	}

	suffix(context) {
		this.context = context;
		return this;
	}

	get prefix() {
		const ns = this.namespace ? `[${this.namespace}]` : "";
		const ctx = this.context ? `[${this.context}]` : "";
		return `${ns} ${ctx} ::`.trim();
	}

	log(...args) {
		if (isDevelopment) {
			console.log(this.prefix, ...args);
		}
	}
	warn(...args) {
		if (isDevelopment) {
			console.warn(this.prefix, ...args);
		}
	}
	error(...args) {
		// We usually want to keep error logs in all environments
		console.error(this.prefix, ...args);
	}
	debug(...args) {
		if (isDevelopment) {
			console.debug(this.prefix, ...args);
		}
	}
	info(...args) {
		if (isDevelopment) {
			console.info(this.prefix, ...args);
		}
	}

	// Add a trace method for very verbose logs that you can enable/disable separately
	trace(...args) {
		if (
			isDevelopment &&
			localStorage.getItem("enableTraceLogging") === "true"
		) {
			console.log(`${this.prefix} [TRACE]`, ...args);
		}
	}
}

export default Logger;
