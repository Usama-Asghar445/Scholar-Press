const Paper = require("../../../models/paper.model");

module.exports = {
  createPaper: async (body) => await Paper.create(body),
  findPapers: async () => await Paper.find().sort({ createdAt: -1 }),
  findPapersByUserId: async (userId, status) => {
    const query = { userId };
    if (status) query.status = status;
    return await Paper.find(query).sort({ createdAt: -1 });
  },
};
