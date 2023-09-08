const Comment = require('../models/comment');
const Post = require('../models/post');

// module.exports.create = function(req, res){
//    Post.findById(req.body.post, function(err, post){

//         if (post){
//             Comment.create({
//             post: req.body.post,
//             user: req.user._id    
//             }, function(err, comment){
//                 // handle error
                 
//                 // first time we are update
//                 post.comments.push(comment);
//                 post.save();
 
            
//                  res.redirect('/');
//             });
//         }

//    });
// }

// module.exports.create = async function (req, res) {
//     try {
//       const post = await Post.findById(req.body.post);
//       if (post) {
//         const comment = await Comment.create({
//           content: req.body.content,
//           post: req.body.post,
//           user: req.user._id,
//         });
//         post.comments.push(comment);
//         await post.save();
//       } else {
//         console.log("Post not found");
//       }
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'An error occurred' });
//     }
    
//   };

module.exports.create = async function (req, res) {
    try {
      const post = await Post.findById(req.body.post);
      if (post) {
        const comment = await Comment.create({
          content: req.body.content,
          post: req.body.post,
          user: req.user._id,
        });
        post.comments.push(comment);
        // req.flash('success', 'Comment published');
        await post.save();
        req.flash('success', 'Comment create successfully')
        res.redirect('/');
      } else {
        // console.log("Post not found");
        res.redirect('/');
      }
    } catch (err) {
      req.flash('err', 'Comment create successfully')
      console.error('error', 'Error to create comment');
      res.redirect("/");
    }
  };
  
  module.exports.destroy = async function(req, res){
    try{
      let comment = await Comment.findById(req.params.id)
      if(comment.user == req.user.id){

        let postId = comment.post;

        comment.remove();

        let post = await Post.findByIdAndUpdate(postId, { $pull: {comment: req.params.id}})

        req.flash('success', 'Comment deleted!')

          return res.redirect('back');
        
        }else{
        return res.redirect('back');
      }
    }catch{
        
         console.error('error', 'Error to delete comment');

         console.log('Error', err);
    }  
    }
  
