/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from "./routes/__root";
import { Route as PokemonImport } from "./routes/pokemon";
import { Route as CountElysiaImport } from "./routes/count-elysia";
import { Route as IndexImport } from "./routes/index";
import { Route as PokemonIndexImport } from "./routes/pokemon.index";
import { Route as PokemonResultsImport } from "./routes/pokemon.results";

// Create/Update Routes

const PokemonRoute = PokemonImport.update({
	id: "/pokemon",
	path: "/pokemon",
	getParentRoute: () => rootRoute,
} as any);

const CountElysiaRoute = CountElysiaImport.update({
	id: "/count-elysia",
	path: "/count-elysia",
	getParentRoute: () => rootRoute,
} as any);

const IndexRoute = IndexImport.update({
	id: "/",
	path: "/",
	getParentRoute: () => rootRoute,
} as any);

const PokemonIndexRoute = PokemonIndexImport.update({
	id: "/",
	path: "/",
	getParentRoute: () => PokemonRoute,
} as any);

const PokemonResultsRoute = PokemonResultsImport.update({
	id: "/results",
	path: "/results",
	getParentRoute: () => PokemonRoute,
} as any);

// Populate the FileRoutesByPath interface

declare module "@tanstack/react-router" {
	interface FileRoutesByPath {
		"/": {
			id: "/";
			path: "/";
			fullPath: "/";
			preLoaderRoute: typeof IndexImport;
			parentRoute: typeof rootRoute;
		};
		"/count-elysia": {
			id: "/count-elysia";
			path: "/count-elysia";
			fullPath: "/count-elysia";
			preLoaderRoute: typeof CountElysiaImport;
			parentRoute: typeof rootRoute;
		};
		"/pokemon": {
			id: "/pokemon";
			path: "/pokemon";
			fullPath: "/pokemon";
			preLoaderRoute: typeof PokemonImport;
			parentRoute: typeof rootRoute;
		};
		"/pokemon/results": {
			id: "/pokemon/results";
			path: "/results";
			fullPath: "/pokemon/results";
			preLoaderRoute: typeof PokemonResultsImport;
			parentRoute: typeof PokemonImport;
		};
		"/pokemon/": {
			id: "/pokemon/";
			path: "/";
			fullPath: "/pokemon/";
			preLoaderRoute: typeof PokemonIndexImport;
			parentRoute: typeof PokemonImport;
		};
	}
}

// Create and export the route tree

interface PokemonRouteChildren {
	PokemonResultsRoute: typeof PokemonResultsRoute;
	PokemonIndexRoute: typeof PokemonIndexRoute;
}

const PokemonRouteChildren: PokemonRouteChildren = {
	PokemonResultsRoute: PokemonResultsRoute,
	PokemonIndexRoute: PokemonIndexRoute,
};

const PokemonRouteWithChildren =
	PokemonRoute._addFileChildren(PokemonRouteChildren);

export interface FileRoutesByFullPath {
	"/": typeof IndexRoute;
	"/count-elysia": typeof CountElysiaRoute;
	"/pokemon": typeof PokemonRouteWithChildren;
	"/pokemon/results": typeof PokemonResultsRoute;
	"/pokemon/": typeof PokemonIndexRoute;
}

export interface FileRoutesByTo {
	"/": typeof IndexRoute;
	"/count-elysia": typeof CountElysiaRoute;
	"/pokemon/results": typeof PokemonResultsRoute;
	"/pokemon": typeof PokemonIndexRoute;
}

export interface FileRoutesById {
	__root__: typeof rootRoute;
	"/": typeof IndexRoute;
	"/count-elysia": typeof CountElysiaRoute;
	"/pokemon": typeof PokemonRouteWithChildren;
	"/pokemon/results": typeof PokemonResultsRoute;
	"/pokemon/": typeof PokemonIndexRoute;
}

export interface FileRouteTypes {
	fileRoutesByFullPath: FileRoutesByFullPath;
	fullPaths:
		| "/"
		| "/count-elysia"
		| "/pokemon"
		| "/pokemon/results"
		| "/pokemon/";
	fileRoutesByTo: FileRoutesByTo;
	to: "/" | "/count-elysia" | "/pokemon/results" | "/pokemon";
	id:
		| "__root__"
		| "/"
		| "/count-elysia"
		| "/pokemon"
		| "/pokemon/results"
		| "/pokemon/";
	fileRoutesById: FileRoutesById;
}

export interface RootRouteChildren {
	IndexRoute: typeof IndexRoute;
	CountElysiaRoute: typeof CountElysiaRoute;
	PokemonRoute: typeof PokemonRouteWithChildren;
}

const rootRouteChildren: RootRouteChildren = {
	IndexRoute: IndexRoute,
	CountElysiaRoute: CountElysiaRoute,
	PokemonRoute: PokemonRouteWithChildren,
};

export const routeTree = rootRoute
	._addFileChildren(rootRouteChildren)
	._addFileTypes<FileRouteTypes>();

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/count-elysia",
        "/pokemon"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/count-elysia": {
      "filePath": "count-elysia.tsx"
    },
    "/pokemon": {
      "filePath": "pokemon.tsx",
      "children": [
        "/pokemon/results",
        "/pokemon/"
      ]
    },
    "/pokemon/results": {
      "filePath": "pokemon.results.tsx",
      "parent": "/pokemon"
    },
    "/pokemon/": {
      "filePath": "pokemon.index.tsx",
      "parent": "/pokemon"
    }
  }
}
ROUTE_MANIFEST_END */
