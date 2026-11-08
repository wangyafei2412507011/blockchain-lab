const net = require("net");
const Blockchain = require("./Blockchain");
const P2p = require("./P2p");
const messageType = require("./message-type");
const Messages = require("./message");

console.log("==========P2p文件测试开始==========");

const blockchain = new Blockchain();

const p2p = new P2p(blockchain);

try {
    // 测试1：P2p实例的创建
    console.log("测试1：P2p实例的创建");
    console.log("--p2p实例类型：", typeof p2p);
    console.log("--p2p实例是否为对象：", typeof p2p === "object" && p2p !== null);
    console.log(
        "--p2p实例是否有startServer方法：",
        typeof p2p.startServer === "function"
    );
    console.log(
        "--p2p实例是否有connectToPeer方法：",
        typeof p2p.connectToPeer === "function"
    );
    console.log(
        "--p2p实例是否有broadcast方法：",
        typeof p2p.broadcast === "function"
    );
    console.log("=====p2p实例创建成功=====");
} catch (error) {
    console.log(error.message);
}