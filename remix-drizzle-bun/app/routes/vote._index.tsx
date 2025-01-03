import type {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData, useNavigation } from "@remix-run/react";
import { PokemonSprite } from "~/components/features/pokemon/sprite";
import { getRandomPokemonPair, voteForPokemon } from "~/models/pokemon.server";
import { cn } from "~/utils/misc";

export async function loader({ request }: LoaderFunctionArgs) {
	const pokemonPair = await getRandomPokemonPair();
	return json({ pokemonPair });
}

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const votedForId = Number(formData.get("votedForId"));
	const votedAgainstId = Number(formData.get("votedAgainstId"));

	await voteForPokemon({ votedForId, votedAgainstId });
	return json({ success: true });
}

export default function VotePage() {
	const navigation = useNavigation();

	return (
		<div className="flex min-h-[80vh] items-center justify-center gap-16">
			{navigation.state === "loading" ? <VoteFallback /> : <Content />}
		</div>
	);
}

function Content() {
	const fetcher = useFetcher();
	const { pokemonPair } = useLoaderData<typeof loader>();
	const navigation = useNavigation();
	const [pokemonOne, pokemonTwo] = pokemonPair;
	const isVoting =
		fetcher.state === "submitting" || navigation.state === "loading";

	return (
		<>
			{/* Pokemon One */}
			<div className="flex flex-col items-center gap-4">
				<PokemonSprite dexId={pokemonOne.id} className="w-64 h-64" />
				<div className="text-center">
					<span className="text-lg text-gray-500">#{pokemonOne.id}</span>
					<h2 className="text-2xl font-bold capitalize">{pokemonOne.name}</h2>
					<fetcher.Form method="post">
						<input type="hidden" name="votedForId" value={pokemonOne.id} />
						<input type="hidden" name="votedAgainstId" value={pokemonTwo.id} />
						<button
							disabled={isVoting}
							className={cn(
								"px-8 py-3 text-lg font-semibold text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-blue-300",
								isVoting && "opacity-50 cursor-not-allowed",
							)}
						>
							Vote
						</button>
					</fetcher.Form>
				</div>
			</div>

			{/* Pokemon Two */}
			<div className="flex flex-col items-center gap-4">
				<PokemonSprite dexId={pokemonTwo.id} className="w-64 h-64" />
				<div className="text-center">
					<span className="text-lg text-gray-500">#{pokemonTwo.id}</span>
					<h2 className="text-2xl font-bold capitalize">{pokemonTwo.name}</h2>
					<fetcher.Form method="post">
						<input type="hidden" name="votedForId" value={pokemonTwo.id} />
						<input type="hidden" name="votedAgainstId" value={pokemonOne.id} />
						<button
							disabled={isVoting}
							className="px-8 py-3 text-lg font-semibold text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
						>
							Vote
						</button>
					</fetcher.Form>
				</div>
			</div>
		</>
	);
}

export function VoteFallback() {
	return (
		<>
			{[1, 2].map((i) => (
				<div key={i} className="flex flex-col items-center gap-4">
					<div className="w-64 h-64 rounded-lg animate-pulse bg-gray-800/10" />
					<div className="flex flex-col items-center justify-center space-y-2 text-center">
						<div className="w-16 h-6 rounded animate-pulse bg-gray-800/10" />
						<div className="w-32 h-8 rounded animate-pulse bg-gray-800/10" />
						<div className="w-24 h-12 rounded animate-pulse bg-gray-800/10" />
					</div>
				</div>
			))}
		</>
	);
}

export const meta: MetaFunction = () => {
	return [{ title: "Roundest (Remix + Drizzle + Bun Stack Version)" }];
};
