import express from "express"
import { protectRoute } from "../middleware/auth.js";
import { deleteMessage ,getMessages, getUsersForSiderbar, markMessageAsSeen, sendMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getUsersForSiderbar);
messageRouter.get("/:id", protectRoute, getMessages);


messageRouter.put("/mark/:id",protectRoute, markMessageAsSeen);

messageRouter.post("/send/:id",protectRoute,sendMessage)

messageRouter.delete("/delete/:id", protectRoute, deleteMessage)



export default messageRouter;



