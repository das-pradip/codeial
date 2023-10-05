// const Chat = require('../models/chat');
// const Post = require('../models/post');

// module.exports.create = async function (req, res) {
//     try{
//        let chat = await Chat.create({
//         message: req.body.message,
//         user: req.user._id,
//        });

//       chat = await Chat.populate('user', 'name')
       
//       return res.status(200).json({
//         data: {
//             chat : chat
//         },
//         message: "Message created!"
//     });

//     }
//     catch(err){
//         console.log('Error', err);
//         return res.redirect('back');
//     }
// }