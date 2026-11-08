// 定义一个区块的类，定义我们此区块链中每个区块的数据结构
class Block {
    constructor(index, previousHash, timestamp, data, hash, nonce) {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash;
        this.nonce = nonce;
    }

    // 首先定义第一个创世区块
    static get genesis() {
        return new Block(
            0,
            "0",
            1508270000000,
            "first block",
            "000dc75a315c77a1f9c98fb6247d03dd18ac52632d7dc6a99280261d8109b37cf",
            604
        )
    }
}

module.exports = Block;