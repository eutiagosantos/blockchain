const { Block, Blockchain } = require("./index.js")

const JeChain = new Blockchain();

JeChain.addBlock(new Block(Date.now().toString(), { from: "Tiago", to: "Bob", amount: 100 }));

console.log(JeChain.chain); 