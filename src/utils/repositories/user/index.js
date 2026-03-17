const User = require("../../../models/user.model");

module.exports = {
  createUser: async (body) => await User.create(body),

  findUserByEmail: async (email) =>
    await User.findOne({ email: email.toLowerCase() }), //chat gtp sy pouchna hy is ko  lower casema conver kiya hy

  findUserById: async (_id) => await User.findById(_id),


  updateById: async (_id, data) =>
    await User.findByIdAndUpdate(_id, { $set: data }, { new: true }),
  updateByEmail: async (email, data) =>
    await User.findOneAndUpdate(
      { email: email },
      { $set: data },
      { new: true },
    ),

  deleteByUserEmail: async (email) => await User.deleteOne({ email }), //chat gtp sy pouchna hy is ko q ni kya   lower casema conver kiya hy
  deleteUserById: async (id) => await User.findByIdAndDelete(id),

  // findChiefEditorByEmail: async (email) =>
  //   await User.findOne({
  //     email: email,
  //   }),

  existingChief: async () =>
    await User.findOne({ userType: "Editor in Chief" }),
  appliedForRole: async (userId, roleRequested) =>
    await User.findByIdAndUpdate(
      userId,
      {
        appliedRole: roleRequested,
        applicationStatus: "Pending",
      },
      { new: true },
    ),

  // userRepo.js
  getPendingApplications: async () => {
    return await User.find({ applicationStatus: "Pending" }).sort({
      createdAt: -1,
    });
  },

  findPendingApplicationStatusUserById: async (_id) => {
  return await User.findOne({ 
    _id: _id, 
    applicationStatus: "Pending" 
  });
}
};
