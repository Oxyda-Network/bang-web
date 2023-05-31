import { CARDS_ENGLISH } from "./English/Cards";
import { GAME_STRINGS_ENGLISH } from "./English/GameStrings";
import { LABELS_ENGLISH } from "./English/Labels";
import { CARDS_ITALIAN } from "./Italian/Cards";
import { GAME_STRINGS_ITALIAN } from "./Italian/GameStrings";
import { LABELS_ITALIAN } from "./Italian/Labels";

export type CardRegistry = Record<string, string>;
export type LabelRegistry = Record<string, Record<string, string>>;
export type GameStringRegistry = Record<string, (...formatArgs: JSX.Element[]) => JSX.Element>;

export type Registry = [CardRegistry, LabelRegistry, GameStringRegistry];
export type RegistryMap = Record<string, Registry>;

export const REGISTRIES: RegistryMap = {
    'it-IT': [CARDS_ITALIAN, LABELS_ITALIAN, GAME_STRINGS_ITALIAN],
    'en': [CARDS_ENGLISH, LABELS_ENGLISH, GAME_STRINGS_ENGLISH]
};