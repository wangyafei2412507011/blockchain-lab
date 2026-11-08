const P2p = require("./P2p");
const Blockchain = require("./Blockchain");
const express = require("express");
const cors = require("cors");
const blockchain = new Blockchain();
const p2p = new P2p(blockchain);
// 主函数：初始化cli命令行页面
function cli(vorpal) {
  vorpal
    .use(welcome)
    .use(connectCommand)
    .use(discoverCommand)
    .use(blockchainCommand)
    .use(peersCommand)
    .use(mineCommand)
    .use(openCommand)
    .use(apiCommand)
    .delimiter("blockchain>>>>>>>>> ")
    .show();
}
module.exports = cli;
// 欢迎指令
function welcome(vorpal) {
  vorpal.log("欢迎来到blockchain命令行界面");
  vorpal.exec("help");
}
// 连接节点指令
function connectCommand(vorpal) {
  vorpal
    .command(
      "connect <host> <port>",
      "Connect to a new peer.eg: connect localhost 2727",
    )
    .alias("c")
    .action(function (args, callback) {
      if (args.host && args.port) {
        try {
          p2p.connectToPeer(args.host, args.port);
        } catch (err) {
          this.log(err.message);
        }
      }
      callback();
    });
}
// 发现节点指令，发现网络中的其他节点
function discoverCommand(vorpal) {
  vorpal
    .command("discover", "Discover new peers from your connected peers.")
    .alias("d")
    .action(function (args, callback) {
      try {
        p2p.discoverPeers();
      } catch (err) {
        this.log(err.message);
      }
      callback();
    });
}
// 区块链查看指令，显示当前区块链的所有完整信息
function blockchainCommand(vorpal) {
  vorpal
    .command("blockchain", "Show the current blockchain.")
    .alias("bc")
    .action(function (args, callback) {
      this.log(blockchain);
      callback();
    });
}
// 节点查看指令
function peersCommand(vorpal) {
  vorpal
    .command("peers", "Show the current peers.")
    .alias("p")
    .action(function (args, callback) {
      if (p2p.peers.length === 0) {
        this.log("No peers connected.");
      } else {
        this.log(`已连接的节点数量: ${p2p.peers.length}`);
        p2p.peers.forEach((peer, index) => {
          const host = peer.peerInfo?.host || peer.remoteAddress || "Unknown";
          const port = peer.peerInfo?.port || peer.remotePort || "Unknown";
          this.log(`Node ${index + 1}: ${host}:${port}`);
        }, this);
      }
      callback();
    });
}
// 挖矿指令
function mineCommand(vorpal) {
  vorpal
    .command("mine <data>", "Mine a new block. eg. mine 'hello111111'")
    .alias("m")
    .action(function (args, callback) {
      if (args.data) {
        blockchain.mine(args.data);
        p2p.broadcastLatest();
      }
      callback();
    });
}
// 开启端口指令
function openCommand(vorpal) {
  vorpal
    .command("open <port>", "Open a port for P2P communication. eg. open 2727")
    .alias("o")
    .action(function (args, callback) {
      if (args.port) {
        if (typeof args.port === "number") {
          p2p.startServer(args.port);
          this.log(`Server is running on port ${args.port}`);
        } else {
          this.log("Port not xing.");
        }
      }
      callback();
    });
}
// 开启api指令
function apiCommand(vorpal) {
  vorpal
    .command("api <port>", "Start api server. eg. api 3001")
    .alias("a")
    .action(function (args, callback) {
      if (args.port) {
        initHttpServer(args.port);
      }
      callback();
    });
}

function initHttpServer(port) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/blocks", (req, res) => {
    res.send(blockchain.blockchain);
  });

  app.post("/mineBlock", (req, res) => {
    const data = req.body.data;
    if (data == null) {
      res.status(400).send("data parameter is missing.");
      return;
    }
    blockchain.mine(data);
    const newBlock = blockchain.latestBlock;
    p2p.broadcastLatest();
    res.send(newBlock);
  });

  app.get("/peers", (req, res) => {
    res.send(
      p2p.peers.map((s) => {
        const host = s.peerInfo?.host || s.remoteAddress;
        const port = s.peerInfo?.port || s.remotePort;
        return `${host}:${port}`;
      }),
    );
  });

  app.get("/nodeInfo", (req, res) => {
    res.send({
      p2pPort: p2p.serverPort,
      apiPort: port,
      blockCount: blockchain.blockchain.length,
    });
  });

  app.post("/addPeer", (req, res) => {
    p2p.connectToPeer(req.body.peer);
    res.send();
  });

  app.listen(port, () => {
    console.log(`'listening http on port` + port);
  });
}
