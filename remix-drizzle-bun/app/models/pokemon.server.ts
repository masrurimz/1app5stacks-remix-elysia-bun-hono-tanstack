import { eq, or, sql, desc } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/db/db.server";
import { pokemon, votes, type Pokemon, type Vote } from "~/db/schema";

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
	const results = await db
		.select({
			dexId: pokemon.id,
			name: pokemon.name,
			upVotes: sql<number>`count(distinct ${votes.id}) filter (where ${votes.votedForId} = ${pokemon.id})`,
			downVotes: sql<number>`count(distinct ${votes.id}) filter (where ${votes.votedAgainstId} = ${pokemon.id})`,
			winPercentage: sql<number>`
        case 
          when (count(${votes.id}) filter (where ${votes.votedForId} = ${pokemon.id} or ${votes.votedAgainstId} = ${pokemon.id})) = 0 then 0
          else CAST(count(${votes.id}) filter (where ${votes.votedForId} = ${pokemon.id}) AS FLOAT) * 100.0 / 
               count(${votes.id}) filter (where ${votes.votedForId} = ${pokemon.id} or ${votes.votedAgainstId} = ${pokemon.id})
        end
      `,
		})
		.from(pokemon)
		.leftJoin(
			votes,
			or(
				eq(votes.votedForId, pokemon.id),
				eq(votes.votedAgainstId, pokemon.id),
			),
		)
		.groupBy(pokemon.id, pokemon.name)
		.orderBy(
			desc(sql`case 
        when (count(${votes.id}) filter (where ${votes.votedForId} = ${pokemon.id} or ${votes.votedAgainstId} = ${pokemon.id})) = 0 then 0
        else CAST(count(${votes.id}) filter (where ${votes.votedForId} = ${pokemon.id}) AS FLOAT) * 100.0 / 
             count(${votes.id}) filter (where ${votes.votedForId} = ${pokemon.id} or ${votes.votedAgainstId} = ${pokemon.id})
      end`),
			desc(
				sql`count(distinct ${votes.id}) filter (where ${votes.votedForId} = ${pokemon.id})`,
			),
		);

	return results;
}
