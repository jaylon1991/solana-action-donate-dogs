import {
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
} from "@solana/actions";
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
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
      `/api/actions/agree?fork_chain_address={fork_chain_address}`,
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
          {
            label: "Start a New Fork",
            href: `${baseHrefAgree}`,
            parameters: [
              {
                name: "fork_chain_address",
                label: "Enter the new Address",
                required: true,
              },
            ],
          },
          {
            label: "Agree to Fork",
            href: `${baseHrefAgree}`,
            parameters: [
              {
                name: "fork_chain_address",
                label: "Enter the address of the fork chain",
                required: true,
              },
            ],
          },
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


const IDL = {
  "address": "9nB9sp3CDC2U1uYUPLXkjYhykDe8F9EicnEksqPH2ijr",
  "metadata": {
    "name": "fork_agree",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "agree",
      "discriminator": [
        210,
        74,
        38,
        225,
        191,
        209,
        34,
        101
      ],
      "accounts": [
        {
          "name": "fork_chain",
          "writable": true
        },
        {
          "name": "agreeer",
          "writable": true,
          "signer": true
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "treasury",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "_fork_chain_address",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "distribute_rewards",
      "discriminator": [
        97,
        6,
        227,
        255,
        124,
        165,
        3,
        148
      ],
      "accounts": [
        {
          "name": "config",
          "writable": true
        },
        {
          "name": "fork_chain",
          "writable": true
        },
        {
          "name": "treasury",
          "writable": true
        },
        {
          "name": "head_token_account",
          "writable": true
        },
        {
          "name": "agreeer_token_account",
          "writable": true
        },
        {
          "name": "treasury_authority",
          "signer": true
        },
        {
          "name": "token_program",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "fork",
      "discriminator": [
        32,
        99,
        175,
        232,
        14,
        112,
        193,
        104
      ],
      "accounts": [
        {
          "name": "fork_chain",
          "writable": true,
          "signer": true
        },
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "writable": true
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "treasury",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "percentage",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "config",
          "writable": true,
          "signer": true
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "treasury",
          "writable": true
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "withdraw",
      "discriminator": [
        183,
        18,
        70,
        156,
        148,
        109,
        161,
        34
      ],
      "accounts": [
        {
          "name": "config",
          "writable": true
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "to",
          "writable": true
        },
        {
          "name": "treasury",
          "writable": true
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Config",
      "discriminator": [
        155,
        12,
        170,
        224,
        30,
        250,
        204,
        130
      ]
    },
    {
      "name": "ForkChain",
      "discriminator": [
        249,
        238,
        165,
        137,
        13,
        142,
        211,
        70
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Unauthorized",
      "msg": "Unauthorized"
    }
  ],
  "types": [
    {
      "name": "Config",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "epoch",
            "type": "u64"
          },
          {
            "name": "total_supply",
            "type": "u64"
          },
          {
            "name": "remaining_supply",
            "type": "u64"
          },
          {
            "name": "epoch_reward",
            "type": "u64"
          },
          {
            "name": "epoch_length",
            "type": "u64"
          },
          {
            "name": "halving_interval",
            "type": "u64"
          },
          {
            "name": "fork_cost",
            "type": "u64"
          },
          {
            "name": "agree_cost",
            "type": "u64"
          },
          {
            "name": "treasury",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "ForkChain",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "head",
            "type": "pubkey"
          },
          {
            "name": "percentage",
            "type": "u8"
          },
          {
            "name": "current_epoch",
            "type": "u64"
          },
          {
            "name": "agreeers",
            "type": {
              "vec": "pubkey"
            }
          }
        ]
      }
    }
  ]
}

export const POST = async (req: Request) => {
  const requestUrl = new URL(req.url);
  const action = requestUrl.searchParams.get("action");

  if (action === "agree") {
    return handleAgree(req);
  } else {
    return handleDonate(req);
  }
};

async function handleAgree(req: Request) {
  try {
    const requestUrl = new URL(req.url);
    const body: ActionPostRequest = await req.json();

    // 使用用户提供的账户（钱包地址）
    let agreeerAccount: PublicKey;
    try {
      agreeerAccount = new PublicKey(body.account);
    } catch (err) {
      return new Response('Invalid "account" provided', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const forkChainAddress = requestUrl.searchParams.get("fork_chain_address");
    if (!forkChainAddress) {
      throw "Missing fork_chain_address parameter";
    }

    const connection = new Connection(DEFAULT_RPC);

    const programId = new PublicKey(IDL.address);
    const forkChainPubkey = new PublicKey(forkChainAddress);

    // 从 IDL 中获取 agree 指令的识别符
    const agreeInstructionInfo = IDL.instructions.find(instr => instr.name === "agree");
    if (!agreeInstructionInfo) {
      throw new Error("Agree instruction not found in IDL");
    }
    const agreeInstructionDiscriminator = Buffer.from(agreeInstructionInfo.discriminator);

    // 创建指令数据
    const instructionData = Buffer.concat([
      agreeInstructionDiscriminator,
      forkChainPubkey.toBuffer()
    ]);

    // 创建指令
    const agreeInstruction = new TransactionInstruction({
      programId,
      keys: [
        { pubkey: forkChainPubkey, isSigner: false, isWritable: true },
        { pubkey: agreeerAccount, isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: agreeerAccount, isSigner: false, isWritable: true }, // treasury 现在是用户自己的地址
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
