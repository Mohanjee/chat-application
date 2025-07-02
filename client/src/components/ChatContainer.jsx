// import React, { useContext, useEffect, useRef, useState } from 'react'
// import assets from '../assets/assets'
// import { formatMessageTime } from '../lib/utils'
// import { ChatContext } from '../../context/ChatContext'
// import { AuthContext } from '../../context/AuthContext'
// import toast from 'react-hot-toast'

// const ChatContainer = () => {
//   const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext)
//   const { authUser, onlineUsers } = useContext(AuthContext)
//   const scrollEnd = useRef()

//   const [input, setInput] = useState('')
//   const [imagePreview, setImagePreview] = useState(null)
//   const [isSendingImage, setIsSendingImage] = useState(false)

//   const handleSendMessage = async () => {
//     if (input.trim() === '') return
//     await sendMessage({ text: input.trim() })
//     setInput('')
//   }

//   const handleSendImage = async (e) => {
//     const file = e.target.files[0]
//     if (!file || !file.type.startsWith('image/')) {
//       toast.error('Select an image file')
//       return
//     }
//     const reader = new FileReader()
//     reader.onloadend = () => {
//       setImagePreview(reader.result)
//       e.target.value = ''
//     }
//     reader.readAsDataURL(file)
//   }

//   useEffect(() => {
//     if (selectedUser) getMessages(selectedUser._id)
//   }, [selectedUser])

//   useEffect(() => {
//     if (scrollEnd.current && messages) {
//       scrollEnd.current.scrollIntoView({ behavior: 'smooth' })
//     }
//   }, [messages])

//   // Global Enter Key Listener
//   useEffect(() => {
//     const handleKeyDown = async (e) => {
//       if (e.key === 'Enter') {
//         if (imagePreview) {
//           setIsSendingImage(true)
//           await sendMessage({ image: imagePreview })
//           setImagePreview(null)
//           setIsSendingImage(false)
//         } else if (input.trim() !== '') {
//           await handleSendMessage()
//         }
//       }
//     }
//     window.addEventListener('keydown', handleKeyDown)
//     return () => window.removeEventListener('keydown', handleKeyDown)
//   }, [imagePreview, input])

//   return selectedUser ? (
//     <div className='flex flex-col h-full max-h-screen overflow-hidden relative backdrop-blur-lg'>

//       {/* Header */}
//       <div className='sticky top-0 flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
//         <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className='w-8 rounded-full' />
//         <p className='flex-1 text-lg text-white flex items-center gap-2'>
//           {selectedUser.fullName}
//           {onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500'></span>}
//         </p>
//         <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7' />
//         <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5' />
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-3 pb-6">
//         {messages.map((msg, index) => (
//           <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
//             {msg.image ? (
//               <img src={msg.image} alt="" className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8' />
//             ) : (
//               <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'}`}>
//                 {msg.text}
//               </p>
//             )}
//             <div className='text-center text-xs'>
//               <img
//                 src={msg.senderId === authUser._id
//                   ? authUser?.profilePic || assets.avatar_icon
//                   : selectedUser?.profilePic || assets.avatar_icon}
//                 alt=""
//                 className='w-7 rounded-full'
//               />
//               <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>
//             </div>
//           </div>
//         ))}
//         <div ref={scrollEnd}></div>
//       </div>

//       {/* Image Preview */}
//       {imagePreview && (
//         <div className='flex items-center gap-3 p-3 bg-white/10 rounded-md mx-3 mb-2'>
//           <img src={imagePreview} alt="Preview" className='w-20 rounded-md border border-gray-600' />
//           <button
//             disabled={isSendingImage}
//             onClick={async () => {
//               setIsSendingImage(true)
//               await sendMessage({ image: imagePreview })
//               setImagePreview(null)
//               setIsSendingImage(false)
//             }}
//             className={`px-4 py-1 text-white text-xs rounded-full ${isSendingImage ? 'bg-gray-500 cursor-not-allowed' : 'bg-violet-600'}`}
//           >
//             {isSendingImage ? 'Sending...' : 'Send Image'}
//           </button>
//           <button
//             onClick={() => setImagePreview(null)}
//             className='text-red-400 text-xs underline ml-2'
//           >
//             Cancel
//           </button>
//         </div>
//       )}

//       {/* Bottom input */}
//       <div className='sticky bottom-0 left-0 right-0 flex flex-col gap-1 p-3 bg-black/10'>
//         <div className='flex items-center gap-3'>
//           <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
//             <input
//               onChange={(e) => {
//                 const text = e.target.value
//                 if (text.length > 2000) {
//                   setInput(text.slice(0, 2000))
//                   toast.error("Message limit exceeded (2000 characters)")
//                 } else {
//                   setInput(text)
//                 }
//               }}
//               value={input}
//               type="text"
//               placeholder='Send a message'
//               className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400'
//             />
//             <input onChange={handleSendImage} type="file" id='image' accept='image/png,image/jpeg' hidden />
//             <label htmlFor="image">
//               <img src={assets.gallery_icon} alt="" className='w-5 mr-2 cursor-pointer' />
//             </label>
//           </div>
//           <img onClick={handleSendMessage} src={assets.send_button} alt="" className='w-7 cursor-pointer' />
//         </div>
//         <p className='text-xs text-right pr-3 text-gray-400'>{input.length}/2000 characters</p>
//       </div>
//     </div>
//   ) : (
//     <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
//       <img src={assets.logo_icon} alt="" className='max-w-16' />
//       <p className='text-lg font-medium text-white'>Chat anytime anywhere</p>
//     </div>
//   )
// }

// export default ChatContainer


import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages, deleteMessage } = useContext(ChatContext)
  const { authUser, onlineUsers } = useContext(AuthContext)
  const scrollEnd = useRef()

  const [input, setInput] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [isSendingImage, setIsSendingImage] = useState(false)

  const handleSendMessage = async () => {
    if (input.trim() === '') return
    await sendMessage({ text: input.trim() })
    setInput('')
  }

  const handleSendImage = async (e) => {
    const file = e.target.files[0]
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Select an image file')
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
      e.target.value = ''
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (selectedUser) getMessages(selectedUser._id)
  }, [selectedUser])

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  useEffect(() => {
    const handleKeyDown = async (e) => {
      if (e.key === 'Enter') {
        if (imagePreview) {
          setIsSendingImage(true)
          await sendMessage({ image: imagePreview })
          setImagePreview(null)
          setIsSendingImage(false)
        } else if (input.trim() !== '') {
          await handleSendMessage()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [imagePreview, input])

  return selectedUser ? (
    <div className='flex flex-col h-full max-h-screen overflow-hidden relative backdrop-blur-lg'>
      <div className='sticky top-0 flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className='w-8 rounded-full' />
        <p className='flex-1 text-lg text-white flex items-center gap-2'>
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500'></span>}
        </p>
        <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7' />
        <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5' />
      </div>

      <div className="flex-1 overflow-y-auto p-3 pb-6">
        {messages.map((msg, index) => (
          <div
            key={msg._id || index}
            className={`group relative flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}
          >
            {msg.image ? (
              <img src={msg.image} alt="" className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8" />
            ) : (
              <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                {msg.text}
              </p>
            )}
            <div className='text-center text-xs'>
              <img
                src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon}
                alt=""
                className='w-7 rounded-full'
              />
              <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>
            </div>
            {msg.senderId === authUser._id && (
              <button
                onClick={() => deleteMessage(msg._id)}
                className='absolute top-1 right-1 hidden group-hover:block text-xs text-red-500 bg-white/20 rounded px-1'
                title='Delete'
              >
                🗑️
              </button>
            )}
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {imagePreview && (
        <div className='flex items-center gap-3 p-3 bg-white/10 rounded-md mx-3 mb-2'>
          <img src={imagePreview} alt="Preview" className='w-20 rounded-md border border-gray-600' />
          <button
            disabled={isSendingImage}
            onClick={async () => {
              setIsSendingImage(true)
              await sendMessage({ image: imagePreview })
              setImagePreview(null)
              setIsSendingImage(false)
            }}
            className={`px-4 py-1 text-white text-xs rounded-full ${isSendingImage ? 'bg-gray-500 cursor-not-allowed' : 'bg-violet-600'}`}
          >
            {isSendingImage ? 'Sending...' : 'Send Image'}
          </button>
          <button
            onClick={() => setImagePreview(null)}
            className='text-red-400 text-xs underline ml-2'
          >
            Cancel
          </button>
        </div>
      )}

      <div className='sticky bottom-0 left-0 right-0 flex flex-col gap-1 p-3 bg-black/10'>
        <div className='flex items-center gap-3'>
          <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
            <input
              onChange={(e) => {
                const text = e.target.value
                if (text.length > 2000) {
                  setInput(text.slice(0, 2000))
                  toast.error("Message limit exceeded (2000 characters)")
                } else {
                  setInput(text)
                }
              }}
              value={input}
              type="text"
              placeholder='Send a message'
              className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400'
            />
            <input onChange={handleSendImage} type="file" id='image' accept='image/png,image/jpeg' hidden />
            <label htmlFor="image">
              <img src={assets.gallery_icon} alt="" className='w-5 mr-2 cursor-pointer' />
            </label>
          </div>
          <img onClick={handleSendMessage} src={assets.send_button} alt="" className='w-7 cursor-pointer' />
        </div>
        <p className='text-xs text-right pr-3 text-gray-400'>{input.length}/2000 characters</p>
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src={assets.logo_icon} alt="" className='max-w-16' />
      <p className='text-lg font-medium text-white'>Chat anytime anywhere</p>
    </div>
  )
}

export default ChatContainer;
