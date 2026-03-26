const User = require("../../../models/user.model");
const mongoose = require("mongoose");
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
  },

  findUsers: async (query = {}) => {
    return await User.find(query).sort({ createdAt: -1 });
  },

  getUsersWithStats: async (roleQuery = {}) => {
    return await User.aggregate([
      { $match: roleQuery },
      {
        $lookup: {
          from: "papers",
          localField: "_id",
          foreignField: "userId",
          as: "papers",
        },
      },
      {
        $lookup: {
          from: "role_applications",
          localField: "_id",
          foreignField: "userId",
          as: "roleApplications",
        },
      },
      {
        $addFields: {
          submittedPapers: { $size: "$papers" },
          acceptedPapers: {
            $size: {
              $filter: {
                input: "$papers",
                as: "paper",
                cond: { $eq: ["$$paper.status", "Accepted"] },
              },
            },
          },
          rejectedPapers: {
            $size: {
              $filter: {
                input: "$papers",
                as: "paper",
                cond: { $eq: ["$$paper.status", "Rejected"] },
              },
            },
          },
          hasPendingApplication: {
            $gt: [
              {
                $size: {
                  $filter: {
                    input: "$roleApplications",
                    as: "app",
                    cond: { $eq: ["$$app.status", "Pending"] },
                  },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $project: {
          password: 0,
          emailVerificationCode: 0,
          papers: 0, // don't send all paper details
          roleApplications: 0,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
  },

  getUserProfileDetails: async (userId) => {

    const userMatches = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "educations",
          localField: "_id",
          foreignField: "userId",
          as: "educations",
        },
      },
      {
        $lookup: {
          from: "role_applications",
          localField: "_id",
          foreignField: "userId",
          as: "applications",
        },
      },
      {
        $lookup: {
          from: "papers",
          localField: "_id",
          foreignField: "userId",
          as: "papers",
        },
      },
      {
        $project: {
          password: 0,
          emailVerificationCode: 0,
          // Limit paper fields to what's needed for the profile view
          "papers._id": 1,
          "papers.title": 1,
          "papers.status": 1,
          "papers.createdAt": 1,
        },
      },
    ]);
    return userMatches.length > 0 ? userMatches[0] : null;
  },
};
