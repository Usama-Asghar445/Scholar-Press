const User = require("../../../models/user.model");

module.exports = {
  createUser: async (body) => await User.create(body),

  findUserByEmail: async (email) =>
    await User.findOne({ email: email.toLowerCase() }), //chat gtp sy pouchna hy is ko  lower casema conver kiya hy

  findUserById: async (_id) => await User.findOne({ _id }),

  updateById: async (_id, data) =>
    await User.findByIdAndUpdate(_id, { $set: data }, { new: true }),

  deleteByUserEmail: async (email) => await User.deleteOne({ email }), //chat gtp sy pouchna hy is ko q ni kya   lower casema conver kiya hy
};
