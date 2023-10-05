const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

module.exports.create = async function (req, res) {
  try{
    let post = await Post.create({
      content: req.body.content,
      user: req.user._id
      // comments: req.user._id
    });

    if(req.xhr){
      // Adding this line by checking 17 sep 08:31pm
      // post = await post.populate('user', 'name').execPopulate();
      post = await post.populate('user', 'name')

      return res.status(200).json({
          data: {
            post: post
          },
          message: "Post created!"
      }); 
    }

    req.flash('success', 'Post published!')
    return res.redirect('back');
  }
  catch(err){
    req.flash('error', err);
      console.log('Error', err);
      return res.redirect('back');
  }

}

module.exports.destroy = async function(req, res){
  try{
    let post = await Post.findById(req.params.id)
      // .id means converting the object into string
      if(post.user == req.user.id){

        // CHANGE :: DELETE THE ASSOCIATED LIKES FOR THE POST AND ALL ITS COMMENTS' LIKES TOO
        await Like.deleteMany({likeable: post, onModel: 'Post'});
        await Like.deleteMany({_id: {$in: post.comments}})


        
        post.remove();
  
       

        await Comment.deleteMany({post: req.params.id});

        if (req.xhr) {
          return res.status(200).json({
            data: {
              post_id: req.params.id
            },
            message: "Post deleted"
          })
        }

        req.flash('success', 'Post and associated comment deleted!');

        return res.redirect('back');
      }
      else{
        req.flash('error', 'You cannot delete this post!');
        return res.redirect('back');
      }
    
  }
  catch(err){
    req.flash('error', err);
    return res.redirect('back');
    // console.log('Error', err);
    // return;
  }
 
}