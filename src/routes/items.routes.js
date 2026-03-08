const express = require("express");
const router = express.Router();
const controller = require("../controllers/items.controller");
const adminAuth = require("../middleware/adminAuth.middleware");

router.post("/", controller.createItem);
router.get("/", controller.getItems);
router.get("/:id", controller.getItemById);

// Admin-protected actions
router.patch("/:id/status", adminAuth, controller.updateStatus);
router.delete("/:id", adminAuth, controller.deleteItem);

module.exports = router;
// improved validation logic