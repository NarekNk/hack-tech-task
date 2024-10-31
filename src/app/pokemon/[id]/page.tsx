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
import { useParams, useRouter } from "next/navigation";
import { GeneraType, PokemonInfo, SpriteType } from "./types";
import { redirect } from "next/navigation";

import styles from "./page.module.css";

export default function SpecificPokemonPage() {
  const params = useParams();
  const router = useRouter();

  const [pokemonInfo, setPokemonInfo] = useState<PokemonInfo | null>(null);
  const [imageType, setImageType] = useState<keyof SpriteType>("front_default");

  const [description, setDescription] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const onImageTypeChange = (type: keyof SpriteType) => {
    setImageType(type);
  };

  useEffect(() => {
    if (!params || !params.id) {
      return;
    }

    const fetchAdditionalInfo = async (name: string) => {
      try {
        const data = await pokemonService.getPokemonDescription({
          name: name,
        });

        setDescription(data?.flavor_text_entries?.[0]?.flavor_text);
        setAdditionalInfo(
          `This Pokémon belongs to the ${
            data.genera.find((g: GeneraType) => g.language.name === "en").genus
          } category.`
        );
      } catch (error) {
        console.error(error);
        setDescription("");
        setAdditionalInfo("");
      }
    };

    const fetchInfo = async () => {
      try {
        const data = await pokemonService.getPokemonInfo({
          id: String(params.id),
        });

        fetchAdditionalInfo(data.name);

        setPokemonInfo(data);
      } catch (error) {
        console.error(error);
        setPokemonInfo(null);
        redirect("/pokemon");
      }
    };
    fetchInfo();
  }, [params]);

  const goBack = () => {
    router.back();
  };

  return (
    <div>
      <main className={styles.content}>
        <Button onClick={goBack}>Back to list</Button>
        {!pokemonInfo ? (
          <div>Loading...</div>
        ) : (
          <Box className={styles.pokemonInfo}>
            <Typography variant="h4">{pokemonInfo.name} Info</Typography>
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

            <Box mb={3}>
              <Typography variant="h6">Stats</Typography>

              <Box>
                {pokemonInfo.stats.map((stat) => (
                  <Box
                    key={stat.stat.name}
                    display="flex"
                    justifyContent="space-between"
                  >
                    <Typography variant="body1">{stat.stat.name}</Typography>
                    <Typography variant="body1">
                      {stat.base_stat}/100
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {description && additionalInfo && (
              <Box>
                <Typography variant="h6">Description</Typography>

                <Typography variant="body1">{description}</Typography>
                <Typography variant="body2">{additionalInfo}</Typography>
              </Box>
            )}
          </Box>
        )}
      </main>
    </div>
  );
}
