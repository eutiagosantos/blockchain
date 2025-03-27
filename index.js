const key = "tomate"
const crypto = require("crypto"), SHA256 = message => crypto.createHash("sha256").update(message).digest("hex");

class Block {
    constructor(index, timestamp, data, previoushash, dificulty = 1) {
        this.index = index
        this.timestamp = timestamp
        this.data = data
        this.previoushash = previoushash
        this.hash = this.calculatehash()
        this.nonce = 0
        this.mine()
    }

    calculatehash() {
        return SHA256(this.index + this.timestamp + this.previoushash + JSON.stringify(this.data).toString)
    }

    encryptData(data) {
        return crypto.createCipheriv("aes-256-ccm", key).update(data, "utf-8")
    }

    decryptData(key) {
        return crypto.createDecipheriv("aes-256-ccm", key).update(this.data, "utf-8")
    }

    mine() {
        this.hash = this.calculatehash()

        while (!(/^0*$/.test(this.hash.substring(0, this.difficulty)))) {
            this.nonce++

            this.hash = this.calculatehash()
        }
    }
}

class Blockchain {
    constructor(dificulty = 1) {
        this.chain = [this.createFirstBlock()]
        this.index = 1
        this.difficulty = dificulty
    }

    createFirstBlock() {
        return new Block(0, Date.now(), "8858cb2e83e47c5ee141e331b2f696e3db3d2b7079a6d645f572810973be81843fcd9aff4a0317593fb7a872e2022803679bd6d9a98583c290b8808a3b175b483f137cbb4f7a8dc94b3f6dbabf9628", "0")
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1]
    }

    addBlock(newBlock) {
        newBlock.previoushash = this.getLastBlock().hash
        newBlock.hash = newBlock.calculatehash()
        newBlock.dificulty = this.difficulty
        this.index++
        this.chain.push(newBlock)
    }

    isChainValid() {
        for (let i = 0; i < this.chain.length; i++) {
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i - 1]

            if (currentBlock.hash !== currentBlock.calculatehash()) return false

            if (currentBlock.previoushash !== previousBlock.hash) return false

            return true
        }
    }
}

module.exports = { Block, Blockchain }