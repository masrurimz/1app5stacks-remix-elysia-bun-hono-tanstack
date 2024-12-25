import { eq, or } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/db/db.server";
import { votes, type Pokemon, type Vote } from "~/db/schema";

export type { Pokemon, Vote };

const voteSchema = z
	.object({
		votedForId: z.number(),
		votedAgainstId: z.number(),
	})
	.refine((data) => data.votedForId !== data.votedAgainstId, {
		message: "Cannot vote for and against the same Pokemon",
	});

function getTwoRandomNumbers(max: number) {
	const first = Math.floor(Math.random() * max) + 1;
	let second;
	do {
		second = Math.floor(Math.random() * max) + 1;
	} while (second === first);
	return [first, second] as const;
}

export async function getRandomPokemonPair(): Promise<[Pokemon, Pokemon]> {
	const [firstId, secondId] = getTwoRandomNumbers(1025);

	const pair = await db.query.pokemon.findMany({
		where: (pokemon) => or(eq(pokemon.id, firstId), eq(pokemon.id, secondId)),
	});

	return [pair[0]!, pair[1]!];
}

export async function voteForPokemon(
	input: z.infer<typeof voteSchema>,
): Promise<Vote> {
	const validatedData = voteSchema.parse(input);

	return db
		.insert(votes)
		.values({
			id: crypto.randomUUID(),
			...validatedData,
			createdAt: new Date().toISOString(),
		})
		.returning()
		.get();
}

export async function getPokemonResults() {
	const votesPerPokemon = await db.query.pokemon.findMany({
		columns: {
			id: true,
			name: true,
		},
		with: {
			votesAgainst: true,
			votesFor: true,
		},
	});

	return votesPerPokemon
		.map((pokemon) => {
			const upVotes = pokemon.votesFor.length ?? 0;
			const downVotes = pokemon.votesAgainst.length ?? 0;
			const totalVotes = upVotes + downVotes;

			return {
				dexId: pokemon.id,
				name: pokemon.name,
				upVotes,
				downVotes,
				winPercentage: totalVotes > 0 ? (upVotes / totalVotes) * 100 : 0,
			};
		})
		.sort((a, b) => {
			if (b.winPercentage !== a.winPercentage) {
				return b.winPercentage - a.winPercentage;
			}
			return b.upVotes - a.upVotes;
		});
}
