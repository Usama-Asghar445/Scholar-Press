const Paper = require("../../../models/paper.model")

module.exports = {
    createPaper: async (body) => await Paper.create(body),
    findPapers: async () => await Paper.find().sort({ createdAt: -1 })
}