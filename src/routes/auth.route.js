const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authmiddleware = require("../middlewares/auth.middleware");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/user/register", authController.registerUser);
router.post("/user/login", authController.loginUser);
router.get("/user/logout", authController.logoutUser);

router.post("/food-partner/register", authController.registerFoodPartner);
router.post("/food-partner/login", authController.loginFoodPartner);
router.get("/food-partner/logout", authController.logoutFoodPartner);
router.get(
  "/food-partner/me",
  authmiddleware.authFoodPartnerMiddleware,
  authController.getPartnerMe,
);
router.post(
  "/food-partner/avatar",
  authmiddleware.authFoodPartnerMiddleware,
  upload.single("avatar"),
  authController.uploadPartnerAvatar,
);

module.exports = router;
