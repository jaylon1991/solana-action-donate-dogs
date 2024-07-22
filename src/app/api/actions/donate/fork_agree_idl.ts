export const FORK_AGREE_IDL = {
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
            "name": "config",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    99,
                    111,
                    110,
                    102,
                    105,
                    103
                  ]
                }
              ]
            }
          },
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
          }
        ],
        "args": []
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
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    99,
                    111,
                    110,
                    102,
                    105,
                    103
                  ]
                }
              ]
            }
          },
          {
            "name": "fork_chain"
          },
          {
            "name": "mint",
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
            "name": "token_program",
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          }
        ],
        "args": []
      },
      {
        "name": "fork_chain",
        "discriminator": [
          237,
          21,
          242,
          85,
          244,
          169,
          22,
          19
        ],
        "accounts": [
          {
            "name": "config",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    99,
                    111,
                    110,
                    102,
                    105,
                    103
                  ]
                }
              ]
            }
          },
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
            "name": "system_program",
            "address": "11111111111111111111111111111111"
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
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    99,
                    111,
                    110,
                    102,
                    105,
                    103
                  ]
                }
              ]
            }
          },
          {
            "name": "owner",
            "writable": true,
            "signer": true
          },
          {
            "name": "mint",
            "writable": true,
            "signer": true
          },
          {
            "name": "system_program",
            "address": "11111111111111111111111111111111"
          },
          {
            "name": "token_program",
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "rent",
            "address": "SysvarRent111111111111111111111111111111111"
          }
        ],
        "args": []
      },
      {
        "name": "simplesign",
        "discriminator": [
          184,
          34,
          69,
          176,
          173,
          113,
          184,
          12
        ],
        "accounts": [
          {
            "name": "signer",
            "signer": true
          }
        ],
        "args": [
          {
            "name": "message",
            "type": "string"
          }
        ]
      },
      {
        "name": "toggle_transfers",
        "discriminator": [
          133,
          22,
          1,
          216,
          219,
          21,
          178,
          36
        ],
        "accounts": [
          {
            "name": "config",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    99,
                    111,
                    110,
                    102,
                    105,
                    103
                  ]
                }
              ]
            }
          },
          {
            "name": "owner",
            "signer": true
          }
        ],
        "args": [
          {
            "name": "enabled",
            "type": "bool"
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
      },
      {
        "code": 6001,
        "name": "InvalidPercentage",
        "msg": "Invalid percentage"
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
              "name": "transfers_enabled",
              "type": "bool"
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