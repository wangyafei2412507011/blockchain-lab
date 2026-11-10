const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

class Blockchain {
  constructor() {
    this.chain = [];
    this.difficulty = 3;
    this.nodes = new Set();
    this.createGenesisBlock();
  }

  createGenesisBlock() {
    const genesis = {
      index: 0,
      timestamp: Date.now(),
      transactions: "Genesis Block",
      previousHash: "0",
      nonce: 0
    };
    genesis.hash = this.calcHash(genesis);
    this.chain.push(genesis);
  }

  calcHash(block) {
    return crypto
      .createHash("sha256")
      .update(block.index + block.timestamp + JSON.stringify(block.transactions) + block.previousHash + block.nonce)
      .digest("hex");
  }

  get lastBlock() {
    return this.chain[this.chain.length - 1];
  }

  mine(transactions) {
    const newBlock = {
      index: this.lastBlock.index + 1,
      timestamp: Date.now(),
      transactions: transactions,
      previousHash: this.lastBlock.hash,
      nonce: 0
    };
    while (!newBlock.hash || !newBlock.hash.startsWith("0".repeat(this.difficulty))) {
      newBlock.nonce++;
      newBlock.hash = this.calcHash(newBlock);
    }
    this.chain.push(newBlock);
    return newBlock;
  }

  registerNode(addr) {
    this.nodes.add(addr);
  }

  getChain() {
    return this.chain;
  }

  getNodes() {
    return Array.from(this.nodes);
  }
}

function startServer(port) {
  const app = express();
  app.use(cors());
  app.use(express.json());
  const bc = new Blockchain();

  app.get("/chain", (req, res) => {
    res.json({ chain: bc.getChain() });
  });

  // 修改这里：改为post，读取body里的data
  app.post("/mine", (req, res) => {
    const blk = bc.mine(req.body.data || "test");
    res.json(blk);
  });

  app.post("/transactions/new", (req, res) => {
    const { sender, recipient, amount } = req.body;
    if (!sender || !recipient || amount === undefined) {
      return res.status(400).json({ msg: "交易信息不全" });
    }
    bc.mine({ sender, recipient, amount });
    res.json({ msg: "交易已打包" });
  });

  app.post("/nodes/register", (req, res) => {
    const address = req.body.address;
    if (!address) return res.status(400).json({ msg: "缺少节点地址" });
    bc.registerNode(address);
    res.json({ nodes: bc.getNodes() });
  });

  app.get("/nodes", (req, res) => {
    res.json({ nodes: bc.getNodes() });
  });

  app.listen(port, () => {
    console.log(`✅ 节点启动：http://localhost:${port}`);
  });
}

if (require.main === module) {
  startServer(4000);
  startServer(4001);
}
module.exports = { startServer };