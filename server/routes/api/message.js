const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const messageCtrl = require("../../controllers/message");

router.get('/get-messages/:userid',auth,messageCtrl.getMessage);
router.post("/send-message/:to",auth,messageCtrl.sendMessage);
router.post("/reset-message-notifications",auth,messageCtrl.resetMessageNotifications);
router.post("/delete-messages/:id",auth,messageCtrl.deleteMessage);

module.exports = router;
