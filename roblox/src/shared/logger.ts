import { config, LogLevel } from "./config";

const severity: Record<LogLevel, number> = {
	debug: 0,
	info: 1,
	warn: 2,
	error: 3,
};

export class Logger {
	constructor(private readonly scope: string) {}

	debug(message: string) {
		this.write("debug", message);
	}

	info(message: string) {
		this.write("info", message);
	}

	warn(message: string) {
		this.write("warn", message);
	}

	error(message: string) {
		this.write("error", message);
	}

	private write(level: LogLevel, message: string) {
		if (severity[level] < severity[config.log.level]) return;
		const line = `[${level}] [${this.scope}] ${message}`;
		if (level === "warn" || level === "error") {
			warn(line);
		} else {
			print(line);
		}
	}
}
