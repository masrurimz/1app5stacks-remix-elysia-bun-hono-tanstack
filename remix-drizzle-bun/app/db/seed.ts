import "dotenv/config";

import { createClient } from "@libsql/client/sqlite3";
import bcrypt from "bcryptjs";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

import { notes, passwords, pokemon, users } from "~/db/schema";

async function getAllPokemon() {
	const query = `
    query GetAllPokemon {
      pokemon_v2_pokemon(where: {id: {_lte: 1025}}) {
        id
        pokemon_v2_pokemonspecy {
          name
        }
      }
    }
  `;

	const response = await fetch("https://beta.pokeapi.co/graphql/v1beta", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ query }),
	});

	const data = (await response.json()).data as {
		pokemon_v2_pokemon: {
			id: number;
			pokemon_v2_pokemonspecy: {
				name: string;
			};
		}[];
	};

	return data.pokemon_v2_pokemon.map((pokemon) => ({
		id: pokemon.id,
		name: pokemon.pokemon_v2_pokemonspecy.name,
	}));
}

const client = createClient({
	url: process.env.DATABASE_URL,
	authToken: process.env.DATABASE_AUTH_TOKEN,
});

const db = drizzle(client);

async function seed() {
	await migrate(db, { migrationsFolder: "migrations" });

	let user = await db
		.insert(users)
		.values({ id: 1, email: "rachel@remix.run" })
		.returning()
		.get();

	let hash = bcrypt.hashSync("racheliscool", 10);
	await db.insert(passwords).values({ hash, userId: user.id });

	await db.insert(notes).values([
		{
			title: "My first note",
			body: "This is my first note",
			userId: user.id,
		},
		{
			title: "My second note",
			body: "This is my second note",
			userId: user.id,
		},
	]);

	// Seed Pokemon
	const allPokemon = await getAllPokemon();
	await db.insert(pokemon).values(allPokemon);

	console.log(`Created ${allPokemon.length} Pokemon`);
	console.log("Database has been seeded. 🌱");
	process.exit(0);
}

seed();
