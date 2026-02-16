const express = require("express");
const router = express.Router();
const foodController = require("../controllers/food.controller");
const authmiddleware = require("../middlewares/auth.middleware");
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
});

// Post /api/food/ [protected]
router.post(
  "/",
  authmiddleware.authFoodPartnerMiddleware,
  upload.single("video"),
  foodController.createFood,
);
router.get("/", authmiddleware.authUserMiddleware, foodController.getFoodItem);
router.get(
  "/mine",
  authmiddleware.authFoodPartnerMiddleware,
  foodController.getMyFoodItems,
);

router.post(
  "/like",
  authmiddleware.authUserMiddleware,
  foodController.likeFood,
);

router.post(
  "/save",
  authmiddleware.authUserMiddleware,
  foodController.saveFood,
);

router.post(
  "/comment",
  authmiddleware.authUserMiddleware,
  foodController.addComment,
);
router.get(
  "/comments",
  authmiddleware.authUserMiddleware,
  foodController.getComments,
);
router.get(
  "/saved",
  authmiddleware.authUserMiddleware,
  foodController.getSavedFoods,
);
module.exports = router;
