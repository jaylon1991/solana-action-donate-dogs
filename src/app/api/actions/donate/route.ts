import {
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
} from "@solana/actions";
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { FORK_AGREE_IDL } from './fork_agree_idl';
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  Keypair,
} from "@solana/web3.js";
import {
  DEFAULT_SOL_ADDRESS,
  DEFAULT_SOL_AMOUNT,
  DEFAULT_RPC,
  DEFAULT_TITLE,
  DEFAULT_AVATOR,
  DEFAULT_DESCRIPTION,
} from "./const";

export const GET = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const { toPubkey, amount } = validatedQueryParams(requestUrl);

    const baseHref = new URL(
      `/api/actions/donate?to=${toPubkey.toBase58()}`,
      requestUrl.origin
    ).toString();

    const baseHrefAgree = new URL(
      `/api/actions/donate?agree_chain_address`,
      requestUrl.origin
    ).toString();

    const baseHrefFork = new URL(
      `/api/actions/donate?fork_percentage`,
      requestUrl.origin
    ).toString();

    const baseHrefSign = new URL(
      `/api/actions/donate?sign`,
      requestUrl.origin
    ).toString();

    const payload: ActionGetResponse = {
      title: DEFAULT_TITLE,
      icon:
        DEFAULT_AVATOR ?? new URL("/dog.png", requestUrl.origin).toString(),
      description: DEFAULT_DESCRIPTION,
      label: "Transfer", // this value will be ignored since `links.actions` exists
      links: {
        actions: [
          // {
          //   label: `Send ${amount} SOL`, // button text
          //   href: `${baseHref}&amount=${amount}`,
          // },
          {
            label: "Fork",
            href: `${baseHrefFork}={fork_percentage}`,
            parameters: [
              {
                name: "fork_percentage",
                label: "Enter the percentage",
                required: true,
              },
            ],
          },
          {
            label: "Agree to Fork",
            href: `${baseHrefAgree}={agree_chain_address}`,
            parameters: [
              {
                name: "agree_chain_address",
                label: "Enter the address to agree",
                required: true,
              },
            ],
          },
          // {
          //   label: "Sign Proof",
          //   href: `${baseHrefSign}={sign_address}`,
          //   parameters: [
          //     {
          //       name: "sign_address",
          //       label: "Sign",
          //       required: true,
          //     },
          //   ],
          // },
        ],
      },
    };

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};

// DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
// THIS WILL ENSURE CORS WORKS FOR BLINKS
export const OPTIONS = GET;



export const POST = async (req: Request) => {
  const requestUrl = new URL(req.url);
  const action = requestUrl.searchParams.get("action");

  if (requestUrl.searchParams.has("fork_percentage")) {
    return handleFork(req);
  } else if (requestUrl.searchParams.has("agree_chain_address")) {
    return handleAgree(req);
  } else if (requestUrl.searchParams.has("sign")) {
    return handleSimpleSign(req);
  } else {
    return handleDonate(req);
  }
};

async function handleFork(req: Request) {
  try {
    const requestUrl = new URL(req.url);
    const body: ActionPostRequest = await req.json();

    // Use the provided account (wallet address) as the creator
    let creatorAccount: PublicKey;
    try {
      creatorAccount = new PublicKey(body.account);
    } catch (err) {
      return new Response('Invalid "account" provided', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const percentageStr = requestUrl.searchParams.get("fork_percentage");
    if (!percentageStr) {
      throw "Missing percentage parameter";
    }
    const percentage = parseInt(percentageStr);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      throw "Invalid percentage value. Must be between 0 and 100.";
    }

    const connection = new Connection(DEFAULT_RPC);

    const programId = new PublicKey(FORK_AGREE_IDL.address);
    
    // Hardcode the config address
    const configPubkey = new PublicKey('2mKdgzcBhoVjfAHnYHKw8vsc4djjQtLVL5tjiwre426C');

    // Generate a new keypair for the fork_chain account
    const forkChainKeypair = Keypair.generate();

    // Get the fork_chain instruction's discriminator from the IDL
    const forkChainInstructionInfo = FORK_AGREE_IDL.instructions.find(instr => instr.name === "fork_chain");
    if (!forkChainInstructionInfo) {
      throw new Error("Fork chain instruction not found in IDL");
    }
    const forkChainInstructionDiscriminator = Buffer.from(forkChainInstructionInfo.discriminator);

    // Create instruction data
    const instructionData = Buffer.concat([
      forkChainInstructionDiscriminator,
      Buffer.from([percentage]) // u8 percentage
    ]);

    // Create the instruction
    const forkChainInstruction = new TransactionInstruction({
      programId,
      keys: [
        { pubkey: configPubkey, isSigner: false, isWritable: true },
        { pubkey: forkChainKeypair.publicKey, isSigner: true, isWritable: true },
        { pubkey: creatorAccount, isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data: instructionData,
    });

    const transaction = new Transaction().add(forkChainInstruction);

    transaction.feePayer = creatorAccount;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: `Fork chain with ${percentage}% percentage`,
      },
      signers: [forkChainKeypair],
    });

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
}

async function handleAgree(req: Request) {
  try {
    const requestUrl = new URL(req.url);
    const body: ActionPostRequest = await req.json();

    // Use the provided account (wallet address)
    let agreeerAccount: PublicKey;
    try {
      agreeerAccount = new PublicKey(body.account);
    } catch (err) {
      return new Response('Invalid "account" provided', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const forkChainAddress = requestUrl.searchParams.get("agree_chain_address");
    if (!forkChainAddress) {
      throw "Missing fork_chain_address parameter";
    }

    const connection = new Connection(DEFAULT_RPC);

    const programId = new PublicKey(FORK_AGREE_IDL.address);
    const forkChainPubkey = new PublicKey(forkChainAddress);

    // Hardcode the config address
    const configPubkey = new PublicKey('2mKdgzcBhoVjfAHnYHKw8vsc4djjQtLVL5tjiwre426C');

    // Get the agree instruction's discriminator from the IDL
    const agreeInstructionInfo = FORK_AGREE_IDL.instructions.find(instr => instr.name === "agree");
    if (!agreeInstructionInfo) {
      throw new Error("Agree instruction not found in IDL");
    }
    const agreeInstructionDiscriminator = Buffer.from(agreeInstructionInfo.discriminator);

    // Create instruction data (no additional data needed for this instruction)
    const instructionData = agreeInstructionDiscriminator;

    // Create the instruction
    const agreeInstruction = new TransactionInstruction({
      programId,
      keys: [
        { pubkey: configPubkey, isSigner: false, isWritable: true },
        { pubkey: forkChainPubkey, isSigner: false, isWritable: true },
        { pubkey: agreeerAccount, isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data: instructionData,
    });

    const transaction = new Transaction().add(agreeInstruction);

    transaction.feePayer = agreeerAccount;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: `Agree to fork chain ${forkChainAddress}`,
      },
    });

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
}

async function handleSimpleSign(req: Request) {
  console.log("Entering handleSimpleSign function");
  try {
    const requestUrl = new URL(req.url);
    const body: ActionPostRequest = await req.json();
    console.log("Request body:", body);

    let signerAccount: PublicKey;
    try {
      signerAccount = new PublicKey(body.account);
      console.log("Signer account:", signerAccount.toBase58());
    } catch (err) {
      console.error("Invalid account provided:", err);
      return new Response('Invalid "account" provided', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const message = requestUrl.searchParams.get("sign_address") || "Hello, Solana!";
    console.log("Message to sign:", message);

    const connection = new Connection(DEFAULT_RPC);
    console.log("Connected to RPC:", DEFAULT_RPC);

    const programId = new PublicKey(FORK_AGREE_IDL.address);
    console.log("Program ID:", programId.toBase58());

    const simpleSignInstructionInfo = FORK_AGREE_IDL.instructions.find(instr => instr.name === "simplesign");
    if (!simpleSignInstructionInfo) {
      console.error("SimpleSign instruction not found in IDL");
      throw new Error("SimpleSign instruction not found in IDL");
    }
    console.log("SimpleSign instruction found in IDL");

    const simpleSignInstructionDiscriminator = Buffer.from(simpleSignInstructionInfo.discriminator);
    console.log("Instruction discriminator:", simpleSignInstructionDiscriminator.toString('hex'));

    // Encode the message
    const encodedMessage = Buffer.from(message, 'utf-8');
    const messageLength = Buffer.alloc(4);
    messageLength.writeUInt32LE(encodedMessage.length, 0);

    // Concatenate the instruction data
    const instructionData = Buffer.concat([
      simpleSignInstructionDiscriminator,
      messageLength,
      encodedMessage
    ]);

    const simpleSignInstruction = new TransactionInstruction({
      programId,
      keys: [
        { pubkey: signerAccount, isSigner: true, isWritable: false },
      ],
      data: instructionData,
    });
    console.log("SimpleSign instruction created");

    const transaction = new Transaction().add(simpleSignInstruction);
    console.log("Transaction created");

    transaction.feePayer = signerAccount;
    console.log("Fee payer set:", signerAccount.toBase58());

    const { blockhash } = await connection.getLatestBlockhash();
    console.log("Latest blockhash:", blockhash);
    transaction.recentBlockhash = blockhash;

    // Create ActionPostResponse
    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: `Simple sign: "${message}" by ${signerAccount.toBase58()}`,
      },
    });
    console.log("Post response created");

    // Return payload
    console.log("Returning response");
    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });

  } catch (err) {
    console.error("Error in handleSimpleSign:", err);
    let message = "An unknown error occurred";
    if (err instanceof Error) message = err.message;
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
}

async function handleDonate(req: Request) {
  try {
    const requestUrl = new URL(req.url);
    const { amount, toPubkey } = validatedQueryParams(requestUrl);

    const body: ActionPostRequest = await req.json();

    // validate the client provided input
    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      return new Response('Invalid "account" provided', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const connection = new Connection(DEFAULT_RPC);

    // ensure the receiving account will be rent exempt
    const minimumBalance = await connection.getMinimumBalanceForRentExemption(
      0 // note: simple accounts that just store native SOL have `0` bytes of data
    );
    if (amount * LAMPORTS_PER_SOL < minimumBalance) {
      throw `account may not be rent exempt: ${toPubkey.toBase58()}`;
    }

    const transaction = new Transaction();
    transaction.feePayer = account;

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: account,
        toPubkey: toPubkey,
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    // set the end user as the fee payer
    transaction.feePayer = account;

    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: `Send ${amount} SOL to ${toPubkey.toBase58()}`,
      },
      // note: no additional signers are needed
      // signers: [],
    });

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};

function validatedQueryParams(requestUrl: URL) {
  let toPubkey: PublicKey = DEFAULT_SOL_ADDRESS;
  let amount: number = DEFAULT_SOL_AMOUNT;

  try {
    if (requestUrl.searchParams.get("to")) {
      toPubkey = new PublicKey(requestUrl.searchParams.get("to")!);
    }
  } catch (err) {
    throw "Invalid input query parameter: to";
  }

  try {
    if (requestUrl.searchParams.get("amount")) {
      amount = parseFloat(requestUrl.searchParams.get("amount")!);
    }

    if (amount <= 0) throw "amount is too small";
  } catch (err) {
    throw "Invalid input query parameter: amount";
  }

  return {
    amount,
    toPubkey,
  };
}
