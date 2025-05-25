export const CChainReciverAbi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_router",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_usdcToken",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "InvalidPaginationParameters",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "router",
          "type": "address"
        }
      ],
      "name": "InvalidRouter",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidSenderAddress",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidSourceChain",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidUsdcToken",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "sourceChainSelector",
          "type": "uint64"
        }
      ],
      "name": "NoSenderOnSourceChain",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "orderId",
          "type": "string"
        }
      ],
      "name": "OrderIdNotFound",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "usdcToken",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "receivedToken",
          "type": "address"
        }
      ],
      "name": "WrongReceivedToken",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "sourceChainSelector",
          "type": "uint64"
        }
      ],
      "name": "WrongSenderForSourceChain",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "messageId",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "uint64",
          "name": "sourceChainSelector",
          "type": "uint64"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "orderId",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tokenAmount",
          "type": "uint256"
        }
      ],
      "name": "MessageReceived",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "orderId",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "sourceChainSelector",
          "type": "uint64"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "OrderStored",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferRequested",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "acceptOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "bytes32",
              "name": "messageId",
              "type": "bytes32"
            },
            {
              "internalType": "uint64",
              "name": "sourceChainSelector",
              "type": "uint64"
            },
            {
              "internalType": "bytes",
              "name": "sender",
              "type": "bytes"
            },
            {
              "internalType": "bytes",
              "name": "data",
              "type": "bytes"
            },
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "token",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                }
              ],
              "internalType": "struct Client.EVMTokenAmount[]",
              "name": "destTokenAmounts",
              "type": "tuple[]"
            }
          ],
          "internalType": "struct Client.Any2EVMMessage",
          "name": "message",
          "type": "tuple"
        }
      ],
      "name": "ccipReceive",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_orderId",
          "type": "string"
        }
      ],
      "name": "getOrderInfo",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "uint64",
              "name": "sourceChainSelector",
              "type": "uint64"
            },
            {
              "internalType": "address",
              "name": "sender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "exists",
              "type": "bool"
            }
          ],
          "internalType": "struct SimpleReceiver.OrderInfo",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getRouter",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalOrders",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_startIndex",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_endIndex",
          "type": "uint256"
        }
      ],
      "name": "listOrders",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "orderId",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "uint64",
              "name": "sourceChainSelector",
              "type": "uint64"
            },
            {
              "internalType": "address",
              "name": "sender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            }
          ],
          "internalType": "struct SimpleReceiver.OrderDetails[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "s_orderIds",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "s_orders",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint64",
          "name": "sourceChainSelector",
          "type": "uint64"
        },
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "exists",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        }
      ],
      "name": "s_senders",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "s_totalOrders",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "_sourceChainSelector",
          "type": "uint64"
        },
        {
          "internalType": "address",
          "name": "_sender",
          "type": "address"
        }
      ],
      "name": "setSenderForSourceChain",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_beneficiary",
          "type": "address"
        }
      ],
      "name": "withdrawUsdcToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
