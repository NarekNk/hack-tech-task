"use client";
import { pokemonService } from "components/services";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { getPokemonImageUrl } from "./helpers";

import styles from "./page.module.css";
import { Pagination, Typography } from "@mui/material";
import Link from "next/link";

type Pokemon = {
  name: string;
  id: string;
  imageUrl: string;
  url: string;
};

const pageSize = 12;

export default function PokemonListPage() {
  const [pokemons, setPokemons] = useState<Pokemon[] | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const onPageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const fetchPokemons = useCallback(async () => {
    try {
      const data = await pokemonService.getPokemons({ page, pageSize });
      setPokemons(
        data.results.map((pokemon: Pokemon) => {
          const url = new URL(pokemon.url);
          const id = url.pathname.split("/").filter(Boolean).pop();
          return {
            name: pokemon.name,
            imageUrl: getPokemonImageUrl(Number(id)),
            id: id,
            url: pokemon.url,
          };
        })
      );
      setTotalPages(Math.ceil(data.count / pageSize));
    } catch (error) {
      setPage(1);
      setPokemons(null);
      setTotalPages(0);
      console.error(error);
    }
  }, [page]);

  useEffect(() => {
    fetchPokemons();
  }, [fetchPokemons]);

  return (
    <div>
      <header className={styles.pageHeader}>
        <Typography variant="h4">Pokemon List page</Typography>
      </header>
      <main className={styles.content}>
        {!pokemons ? (
          <Typography variant="h6">Loading pokemons...</Typography>
        ) : (
          <>
            <ul className={styles.pokemonList}>
              {pokemons.map((pokemon) => (
                <li key={pokemon.name}>
                  <Link
                    href={`/pokemon/${pokemon.id}`}
                    className={styles.pokemonListItem}
                  >
                    <Image
                      src={pokemon.imageUrl}
                      alt={pokemon.name}
                      width={100}
                      height={100}
                      loading="lazy"
                    />
                    {pokemon.name}
                  </Link>
                </li>
              ))}
            </ul>

            <Pagination
              count={totalPages}
              page={page}
              onChange={onPageChange}
            />
          </>
        )}
      </main>
      <footer></footer>
    </div>
  );
}
