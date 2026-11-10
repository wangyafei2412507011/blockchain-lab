const crypto = require('crypto');

class Blockchain {
  constructor() {
    this.chain = [];
    this.pendingTransactions = [];
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
    return crypto.createHash('sha256')
      .update(block.index + block.timestamp + JSON.stringify(block.transactions) + block.previousHash + block.nonce)
      .digest('hex');
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  addTransaction(tx) {
    this.pendingTransactions.push(tx);
  }

  minePendingTransactions() {
    const newBlock = {
      index: this.chain.length,
      timestamp: Date.now(),
      transactions: [...this.pendingTransactions],
      previousHash: this.getLastBlock().hash,
      nonce: 0
    };
    this.proofOfWork(newBlock);
    newBlock.hash = this.calcHash(newBlock);
    this.chain.push(newBlock);
    this.pendingTransactions = [];
    return newBlock;
  }

  proofOfWork(block) {
    while (!this.calcHash(block).startsWith("0000")) {
      block.nonce++;
    }
  }

  addNode(addr) {
    this.nodes.add(addr);
  }
}

module.exports = Blockchain;