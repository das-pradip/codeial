const Post = require('../models/post');
const User = require('../models/user');
//change
// const Comment = require('../models/comment');

module.exports.home = async function(req, res){
  try{
    // populate the user of each post
    // CHANGE :: populate the likes of each post and comment
    let posts = await Post.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
         path: 'comments',
         populate: {
          path: 'user'
         },
         populate: {
            path: 'likes'
         }
    }).populate('comments')
    .populate('likes');
    
   
    
   let users = await User.find({});
     
   return res.render('home', {
    title: "Codeial | Home",
    posts: posts,
    all_users: users
  });
  }catch(err){
     console.log('Error', err);
     return;
  }
}
    // return res.end('<h1>Express is up for Codeial</h1>');
    // console.log(req.cookies);
    // res.cookie('user_id', 25);

    // Post.find({}, function(err, posts){
    //   return res.render('home', {
    //     title: "Codeial | Home",
    //     posts: posts
    //   });
    // });

    // populate the user of each post
  