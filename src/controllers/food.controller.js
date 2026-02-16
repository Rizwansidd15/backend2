const foodmodel = require("../models/fooditem.model");
const storageService = require("../services/storage");
const { v4: uuid } = require("uuid");
const likeModel = require("../models/like.model");
const saveModel = require("../models/Save.model");
const commentModel = require("../models/comment.model");

async function createFood(req, res) {
  const fileuploadRes = await storageService.uploadFile(
    req.file.buffer,
    uuid(),
  );
  // console.log(fileuploadRes)

  const fooditem = await foodmodel.create({
    name: req.body.name,
    description: req.body.description,
    video: fileuploadRes.url,
    foodPartner: req.foodPartner._id,
  });

  res.status(201).json({
    messege: "food created successfully",
    food: fooditem,
  });
}

async function getFoodItem(req, res) {
  const fooditems = await foodmodel
    .find({})
    .populate(
      "foodPartner",
      "businessname fullname phone email uploadProfilePicture",
    );

  // attach commentsCount and savesCount per food
  const ids = fooditems.map((f) => f._id);

  const commentsAgg = await commentModel
    .aggregate([
      { $match: { food: { $in: ids } } },
      { $group: { _id: "$food", count: { $sum: 1 } } },
    ])
    .exec();

  const savesAgg = await saveModel
    .aggregate([
      { $match: { food: { $in: ids } } },
      { $group: { _id: "$food", count: { $sum: 1 } } },
    ])
    .exec();

  const commentsMap = {};
  commentsAgg.forEach((c) => (commentsMap[c._id.toString()] = c.count));
  const savesMap = {};
  savesAgg.forEach((s) => (savesMap[s._id.toString()] = s.count));

  const itemsWithCounts = fooditems.map((f) => {
    const obj = f.toObject ? f.toObject() : f;
    obj.commentsCount = commentsMap[f._id.toString()] || 0;
    obj.savesCount = savesMap[f._id.toString()] || 0;
    return obj;
  });

  res.status(200).json({
    messege: "food items fetched successfully",
    fooditems: itemsWithCounts,
  });
}

async function getMyFoodItems(req, res) {
  const partnerId = req.foodPartner && req.foodPartner._id;
  if (!partnerId) {
    return res.status(401).json({ messege: "Unauthorized" });
  }

  const fooditems = await foodmodel
    .find({ foodPartner: partnerId })
    .populate(
      "foodPartner",
      "businessname fullname phone email uploadProfilePicture",
    );
  res.status(200).json({
    messege: "partner food items fetched successfully",
    fooditems,
  });
}

async function likeFood(req, res) {
  const { foodId } = req.body;

  const userId = req.user && req.user._id;

  const isliked = await likeModel.findOne({ user: userId, food: foodId });

  if (isliked) {
    // unlike: remove like and decrement counter
    await likeModel.deleteOne({ _id: isliked._id });
    await foodmodel.findByIdAndUpdate(foodId, { $inc: { likesCount: -1 } });
    return res.status(200).json({ messege: "Food unliked successfully" });
  }

  // like: create like and increment counter
  const like = await likeModel.create({
    user: userId,
    food: foodId,
  });

  await foodmodel.findByIdAndUpdate(foodId, { $inc: { likesCount: 1 } });

  res.status(201).json({ messege: "Food liked successfully", like });
}

async function saveFood(req, res) {
  // To be implemented

  const { foodId } = req.body;
  const userId = req.user && req.user._id;

  const isSaved = await saveModel.findOne({ user: userId, food: foodId });

  if (isSaved) {
    //unsave
    await saveModel.deleteOne({ _id: isSaved._id });
    return res.status(200).json({ messege: "Food unsaved successfully" });
  }

  const save = await saveModel.create({
    user: userId,
    food: foodId,
  });

  res.status(201).json({ messege: "Food saved successfully", save });
}

async function addComment(req, res) {
  const { foodId, text } = req.body;
  const userId = req.user && req.user._id;

  if (!text || !foodId) {
    return res.status(400).json({ messege: "Invalid payload" });
  }

  const comment = await commentModel.create({
    user: userId,
    food: foodId,
    text,
  });

  const populated = await commentModel
    .findById(comment._id)
    .populate("user", "name _id");

  res.status(201).json({ messege: "Comment added", comment: populated });
}

async function getComments(req, res) {
  const { foodId } = req.query;
  if (!foodId) {
    return res.status(400).json({ messege: "foodId required" });
  }

  const comments = await commentModel
    .find({ food: foodId })
    .populate("user", "name _id")
    .sort({ createdAt: -1 });

  res.status(200).json({ messege: "comments fetched", comments });
}

async function getSavedFoods(req, res) {
  const userId = req.user && req.user._id;
  if (!userId) return res.status(401).json({ messege: "please login" });

  const saves = await saveModel.find({ user: userId }).populate({
    path: "food",
    populate: { path: "foodPartner", select: "name _id" },
  });

  const foods = saves.map((s) => s.food).filter(Boolean);

  // attach commentsCount and savesCount per food
  const ids = foods.map((f) => f._id);

  const commentsAgg = await commentModel
    .aggregate([
      { $match: { food: { $in: ids } } },
      { $group: { _id: "$food", count: { $sum: 1 } } },
    ])
    .exec();

  const savesAgg = await saveModel
    .aggregate([
      { $match: { food: { $in: ids } } },
      { $group: { _id: "$food", count: { $sum: 1 } } },
    ])
    .exec();

  const commentsMap = {};
  commentsAgg.forEach((c) => (commentsMap[c._id.toString()] = c.count));
  const savesMap = {};
  savesAgg.forEach((s) => (savesMap[s._id.toString()] = s.count));

  const itemsWithCounts = foods.map((f) => {
    const obj = f.toObject ? f.toObject() : f;
    obj.commentsCount = commentsMap[f._id.toString()] || 0;
    obj.savesCount = savesMap[f._id.toString()] || 0;
    return obj;
  });

  res
    .status(200)
    .json({ messege: "saved foods fetched", foods: itemsWithCounts });
}
module.exports = {
  createFood,
  getFoodItem,
  getMyFoodItems,
  likeFood,
  saveFood,
  addComment,
  getComments,
  getSavedFoods,
};
