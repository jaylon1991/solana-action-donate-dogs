import { PublicKey, clusterApiUrl } from "@solana/web3.js";
import dotenv from "dotenv";
dotenv.config();

export const DEFAULT_SOL_ADDRESS: PublicKey = new PublicKey(
  process.env.RECIPIENT ?? "HYrj3mhi96aRjRuRkpq5QgP5JQeyh6HL6FaJJrEK9NPK" // donate wallet
);

export const DEFAULT_SOL_AMOUNT: number = process.env.DEFAULTAMOUNT
  ? parseFloat(process.env.DEFAULTAMOUNT)
  : 0.1;

export const DEFAULT_RPC =
process.env.RPC_URL_MAINNET ?? clusterApiUrl("mainnet-beta");

export const DEFAULT_TITLE = process.env.TITLE ?? "Donate SOL to save more dogs";

export const DEFAULT_AVATOR = process.env.AVATAR;

export const DEFAULT_DESCRIPTION =
  process.env.DESCRIPTION ?? "Let's gather together to save more dogs!";
