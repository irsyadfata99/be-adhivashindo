const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { authenticate } = require("../middleware/auth");
const {
  getAll,
  getOne,
  create,
  update,
  remove,
} = require("../controllers/contentController");

router.get("/", getAll);

router.get("/:id", getOne);

router.post(
  "/",
  authenticate,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("body").notEmpty().withMessage("Body is required"),
    body("status")
      .optional()
      .isIn(["draft", "published"])
      .withMessage("Status must be draft or published"),
  ],
  create,
);

router.put(
  "/:id",
  authenticate,
  [
    body("title").optional().notEmpty().withMessage("Title cannot be empty"),
    body("body").optional().notEmpty().withMessage("Body cannot be empty"),
    body("status")
      .optional()
      .isIn(["draft", "published"])
      .withMessage("Status must be draft or published"),
  ],
  update,
);

router.delete("/:id", authenticate, remove);

module.exports = router;
