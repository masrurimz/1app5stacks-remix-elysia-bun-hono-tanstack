import {
	json,
	type LoaderFunctionArgs,
	type MetaFunction,
} from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { PokemonSprite } from "~/components/features/pokemon/sprite";
import { getPokemonResults } from "~/models/pokemon.server";

export async function loader({ request }: LoaderFunctionArgs) {
	const results = await getPokemonResults();
	return json({ results });
}

export default function ResultsPage() {
	const navigation = useNavigation();

	return (
		<div className="container px-4 py-8 mx-auto text-white">
			<div className="grid gap-4">
				{navigation.state === "loading" ? <ResultsFallback /> : <Content />}
			</div>
		</div>
	);
}

function Content() {
	const { results } = useLoaderData<typeof loader>();

	return (
		<>
			{results.map((pokemon, index) => (
				<div
					key={pokemon.dexId}
					className="flex items-center gap-6 p-6 transition-shadow rounded-lg shadow bg-gray-800/40 hover:shadow-md"
				>
					<div className="w-8 text-2xl font-bold text-gray-400">
						#{index + 1}
					</div>
					<PokemonSprite dexId={pokemon.dexId} className="w-20 h-20" />
					<div className="flex-grow">
						<div className="text-sm text-gray-400">#{pokemon.dexId}</div>
						<h2 className="text-xl font-semibold capitalize">{pokemon.name}</h2>
					</div>
					<div className="text-right">
						<div className="text-2xl font-bold text-blue-400">
							{pokemon.winPercentage.toFixed(1)}%
						</div>
						<div className="text-sm text-gray-400">
							{pokemon.upVotes}W - {pokemon.downVotes}L
						</div>
					</div>
				</div>
			))}
		</>
	);
}

function ResultsFallback() {
	return (
		<>
			{[...Array(10)].map((_, i) => (
				<div
					key={i}
					className="flex items-center gap-6 p-6 rounded-lg shadow animate-pulse bg-gray-800/40"
				>
					<div className="w-8 h-8 rounded bg-gray-700/40" />
					<div className="w-20 h-20 rounded bg-gray-700/40" />
					<div className="flex-grow">
						<div className="w-16 h-4 mb-2 rounded bg-gray-700/40" />
						<div className="w-32 h-6 rounded bg-gray-700/40" />
					</div>
					<div className="text-right">
						<div className="w-16 h-8 mb-2 rounded bg-gray-700/40" />
						<div className="w-24 h-4 rounded bg-gray-700/40" />
					</div>
				</div>
			))}
		</>
	);
}

export const meta: MetaFunction = () => {
	return [{ title: "Results (Remix + Drizzle + Bun Stack Version)" }];
};
