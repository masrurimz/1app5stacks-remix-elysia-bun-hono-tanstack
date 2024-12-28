import swagger from "@elysiajs/swagger";
import { Elysia, error, t } from "elysia";
import { note } from "./note";
import { user } from "./user";
import { opentelemetry } from "@elysiajs/opentelemetry";

const app = new Elysia()
	.use(opentelemetry())
	.use(swagger())
	.onError(({ error, code }) => {
		if (code === "NOT_FOUND") return "Not Found :(";

		console.error(error);
	})
	.get("/", ({ path }) => "Hello Elysia from " + path)
	.get("/hello", "Do you miss me?")
	.use(note)
	.use(user)
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
