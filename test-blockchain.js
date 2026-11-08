const Block = require("./Block");
const Blockchain = require("./Blockchain");

console.log("================区块链测试开始================");
try{
const blockchain = new Blockchain();
    //1.测试创世区块
    console.log("1. 测试创世区块：");
    const genesis = Block.genesis;
    console.log(genesis.index, genesis.previousHash, genesis.timestamp, genesis.data, genesis.hash, genesis.nonce);
    console.log("========创世区块创建成功========");

    //2.测试初始化区块链
    console.log("2. 测试初始化区块链：");
    
    console.log("区块链长度：", blockchain.get().length);
    console.log("最新区块索引：", blockchain.latestBlock.index);
    console.log("挖矿难度：", blockchain.difficulty);
    console.log("========区块链初始化成功========");

    //3.测试哈希难度验证
    console.log("3. 测试哈希难度验证：");
    console.log("当前难度要求：", blockchain.difficulty, "个前导0");
    const validHash = "000abc123def";
    const invalidHash = "00abc123def";
    console.log("-- " + validHash + " 是否有效: ", blockchain.isValidHashDifficulty(validHash));
    console.log("-- " + invalidHash + " 是否有效: ", blockchain.isValidHashDifficulty(invalidHash));
    console.log("========哈希难度验证成功========");

    //4.测试哈希计算
    console.log("4. 测试哈希计算：");
    const testHash = blockchain.calculateHash(0, "0", 1234567890, "测试", 0);
    console.log("- 计算的哈希值:", testHash);
    console.log("- 哈希长度:", testHash.length, "字符");
    console.log("√ 哈希计算正常\n");



//5.测试挖第一个区块，也是挖矿
console.log("5. 测试挖第一个区块，也是挖矿：");
// console.time("挖矿耗时");
blockchain.mine("第一个区块");
// console.timeEnd("挖矿耗时结束");
console.log("新区块的索引：", blockchain.latestBlock.index);
console.log("新区块的哈希值：", blockchain.latestBlock.hash);
console.log("新区块的挖矿数据：", blockchain.latestBlock.data);
console.log("新区块的nonce：", blockchain.latestBlock.nonce);
console.log("当前区块的长度：", blockchain.get().length);


// 6. 测试显示完整的区块链
console.log("6. 测试显示完整的区块链: ");
blockchain.get().forEach((block, index) => {
  console.log(`区块 #${index}`);
  console.log(`索引: ${block.index}`);
  console.log(`前一个哈希: ${block.previousHash}`);
  console.log(`时间戳: ${block.timestamp}`);
  console.log(`数据: ${block.data}`);
  console.log(`哈希值: ${block.hash}`);
  console.log(`nonce: ${block.nonce}`);
  console.log("新时间: ", new Date(block.timestamp).toLocaleString("zh-CN"));
  console.log("------------------------");
});

// 7. 区块验证
console.log("7. 区块验证：");
const block0 = blockchain.get()[0];
const block1 = blockchain.get()[1];
const isNextBlockValid = blockchain.isValidNextBlock(block1, block0);
console.log(`新区块 ${block1.index} 是否有效: ${isNextBlockValid};`);
} catch (err) {
console.log(err);
}