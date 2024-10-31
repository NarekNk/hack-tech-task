"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { pokemonService } from "components/services";
import Image from "next/image";
import { useParams } from "next/navigation";

import styles from "./page.module.css";
import Link from "next/link";

type StatType = {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
};

type SpriteType = {
  back_default: string | null;
  front_default: string | null;
};

type AbilityType = {
  ability: {
    name: string;
  };
};

type PokemonInfo = {
  sprites: SpriteType;
  height: number;
  weight: number;
  name: string;
  abilities: AbilityType[];
  stats: StatType[];
};

export default function SpecificPokemonPage() {
  const params = useParams();

  const [pokemonInfo, setPokemonInfo] = useState<PokemonInfo | null>(null);
  const [imageType, setImageType] = useState<keyof SpriteType>("front_default");

  const onImageTypeChange = (type: keyof SpriteType) => {
    setImageType(type);
  };

  useEffect(() => {
    if (!params || !params.id) {
      return;
    }

    const fetchInfo = async () => {
      try {
        const data = await pokemonService.getPokemonInfo({
          id: String(params.id),
        });
        setPokemonInfo(data);
      } catch (error) {
        console.error(error);
        setPokemonInfo(null);
      }
    };
    fetchInfo();
  }, [params]);

  return (
    <div>
      <main className={styles.content}>
        <Link href={"/pokemon"}>Back to list</Link>
        {!pokemonInfo ? (
          <div>Loading...</div>
        ) : (
          <Box className={styles.pokemonInfo}>
            <Typography variant="h5">{pokemonInfo.name} Info</Typography>
            <Box display="flex" gap={4} mb={3}>
              <Box>
                {pokemonInfo.sprites[imageType] && (
                  <Image
                    src={pokemonInfo.sprites[imageType]}
                    alt="Pokemon image"
                    width={200}
                    height={200}
                    priority
                  />
                )}
                <Box display="flex" gap={2}>
                  <Button
                    variant={
                      imageType === "front_default" ? "contained" : "outlined"
                    }
                    onClick={() => onImageTypeChange("front_default")}
                  >
                    Front Image
                  </Button>
                  <Button
                    variant={
                      imageType === "back_default" ? "contained" : "outlined"
                    }
                    onClick={() => onImageTypeChange("back_default")}
                  >
                    Back Image
                  </Button>
                </Box>
              </Box>
              <Box flex={1}>
                <Typography variant="body1">General Info</Typography>
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Height</TableCell>
                        <TableCell>{pokemonInfo.height} ft</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Weight</TableCell>
                        <TableCell>{pokemonInfo.weight} lbs</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Abilities</TableCell>
                        <TableCell>
                          <ul>
                            {pokemonInfo.abilities.map((ability) => (
                              <li key={ability.ability.name}>
                                {ability.ability.name}
                              </li>
                            ))}
                          </ul>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>

            <Box>
              <Typography variant="h6">Stats</Typography>

              <Box>
                {pokemonInfo.stats.map((stat) => (
                  <Box
                    key={stat.stat.name}
                    display="flex"
                    justifyContent="space-between"
                  >
                    <Typography variant="body1">
                      {stat.stat.name}/100
                    </Typography>
                    <Typography variant="body1">{stat.base_stat}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}
      </main>
      <footer></footer>
    </div>
  );
}
