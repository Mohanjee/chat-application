import User from "../models/user.js";
import Message from "../models/message.js";
import cloudinary from "../lib/cloudinary.js";
import { io ,userSocketMap} from "../server.js";



// Get all users except the logged in user 
export const getUsersForSiderbar = async (req,res) =>{
    try {
        const userId = req.user._id ;
        const filteredUsers = await User.find({_id: {$ne : userId}}).select("-password");

        // Count number of messages not seen 

        const unseenMessages = {}
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({senderId : user._id , receiverId : userId,seen : false })
            if(messages.length > 0){
                unseenMessages[user._id] = messages.length ; 
            }
        })
        await Promise.all(promises);
        res.json({success : true , users : filteredUsers , unseenMessages})
    } catch (error) {
        console.log(error.message);
        res.json({success : false , message : error.message})
    }
}

// Delete a message by ID
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    // Optional: Only allow the sender to delete their own message
    if (message.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await Message.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Message deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get all messages for selected user 
export const getMessages = async (req,res) => {
    try {
        // to get selected user id we will get like this 
        const {id:selectedUserId} = req.params;
        const myId = req.user._id ; 

        // to get messages 
        const messages = await Message.find({$or : [
            {senderId : myId,receiverId : selectedUserId},
            {senderId : selectedUserId,receiverId : myId}
        ]})
        // to make the messages as read 
        await Message.updateMany({senderId : selectedUserId, receiverId : myId} , {seen : true});

        res.json({success : true , messages})
    } catch (error) {
        console.log(error.Message);
        res.json({success : false , messages})
    }
}

// api to mark message as seen using message id 

export const markMessageAsSeen = async (req,res) => {
    try{
        const {id} = req.params;
        await Message.findByIdAndUpdate(id,{seen : true})
        res.json({success : true})
    }catch(e){
        console.log(e);
        res.json({success: false , message : error.message})
    }
}

// Send message to selected user 

export const sendMessage = async (req,res) => {
    try {
        const {text,image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image : imageUrl 
        })
        
        // Emit the new message to the receiver's socket 
        const receiverSocketId = userSocketMap[receiverId];

        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }

        res.json({success : true , newMessage});


    } catch (error) {
        console.log(error.message);
        res.json({success : false , message : error.message});
    }
}
