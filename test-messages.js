const messageType = require("./message-type.js");
const Messages = require("./message.js");
const Block = require("./Block.js");

try {
    console.log("========消息类型和消息工厂测试开始========");
    console.log("1.测试消息类型枚举");
    console.log("REQUEST_LATEST_BLOCK:", messageType.REQUEST_LATEST_BLOCK);
    console.log("REQUEST_LATEST_BLOCKCHAIN:", messageType.REQUEST_LATEST_BLOCKCHAIN);
    console.log("RECEIVE_LATEST_BLOCK:", messageType.RECEIVE_LATEST_BLOCK);
    console.log("RECEIVE_LATEST_BLOCKCHAIN:", messageType.RECEIVE_LATEST_BLOCKCHAIN);
    console.log("HANDSHAKE:", messageType.HANDSHAKE);
    console.log("*********************************************");

    console.log("2.测试请求最新区块的消息功能");
    const requestLatestBlockMsg = Messages.getLatestBlock();
    console.log("请求最新区块的消息", requestLatestBlockMsg);
    console.log("是否为请求最新区块类型：");
    console.log(requestLatestBlockMsg.type === messageType.REQUEST_LATEST_BLOCK);
    console.log("消息结构：", JSON.stringify(requestLatestBlockMsg));
    console.log("*********************************************");

    console.log("3.测试响应最新区块消息的功能：");
    const testBlock = Block.genesis;
    const sendLatestBlockMsg = Messages.sendLatestBlock(testBlock);
    console.log("消息类型：", sendLatestBlockMsg.type === messageType.RECEIVE_LATEST_BLOCK);
    console.log("包含的响应区块类型：", sendLatestBlockMsg.data.index === 0);
    console.log("数据是否为创世区块：", sendLatestBlockMsg.data.index === 0);
    console.log(JSON.stringify(sendLatestBlockMsg));
    console.log("*********************************************");

    console.log("4.测试请求整个区块链消息的功能");
    const requestBlockchainMsg = Messages.getBlockchain();
    console.log("是否为请求整个区块链类型：", requestBlockchainMsg.type === messageType.REQUEST_LATEST_BLOCKCHAIN);
    console.log("消息结构：", JSON.stringify(requestBlockchainMsg));
    console.log("*********************************************");

    console.log("5.测试响应整个区块链消息的功能");
    const testChain = [Block.genesis];
    const sendBlockchainMsg = Messages.sendBlockchain(testChain);
    console.log("是否为响应整个区块链类型：", sendBlockchainMsg.type === messageType.RECEIVE_LATEST_BLOCKCHAIN);
    console.log("包含的区块链第一条区块：", sendBlockchainMsg.data[0].index === 0);
    console.log(JSON.stringify(sendBlockchainMsg));
    console.log("*********************************************");

    console.log("6.测试发送握手消息功能");
    const handshakeMsg = Messages.sendHandshake(2727);
    console.log("消息类型：", handshakeMsg.type === messageType.HANDSHAKE);
    console.log("包含的握手端口数据：", handshakeMsg.data.port);
    console.log("端口是否正确：", handshakeMsg.data.port === 2727);
    console.log(JSON.stringify(handshakeMsg));
    console.log("66666666666666666666666666666666666666666666666666");

} catch (err) {
    console.error("消息类型和消息工厂测试失败：", err);
}