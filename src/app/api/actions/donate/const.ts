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
  process.env.RPC_URL_DEVNET ?? clusterApiUrl("devnet");

export const DEFAULT_TITLE = process.env.TITLE ?? "Fork or Agree, that is the question";

export const DEFAULT_AVATOR = process.env.AVATAR;

export const DEFAULT_DESCRIPTION =
  process.env.DESCRIPTION ?? "Let's vote on your favorite topics";
