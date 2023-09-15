const User = require('../models/user');

const fs = require('fs');
const path = require('path');

// let's keep it same as before not implement the async await
module.exports.profile = function(req, res){
    // if(req.cookies.user_id){
    //    User.findById(req.cookies.user_id, function(err, user){
    //        if(user){
    //           return res.render('user_profile', {
    //             title: "User Profile",
    //             user : user
    //           })
    //        }

    //        return res.redirect('/users/sign-in')
    //    });
    // } else {
    //        return res.redirect('/users/sign-in')
    // }
   

    // if(req.cookies.user_id){
    //   User.findByIdAndDelete(req.cookies.user_id, function(err, user){
    //     if(user){
    //        return res.render('user_log_out', {
    //          title: "User Deleted",
    //          user : user
    //        })
    //     }
    // });
  // }
   
             
             User.findById(req.params.id, function(err, user){
              return res.render('user_profile', {
                title: "User Profile",
                profile_user: user
              });
             });
            
   };



   module.exports.update = async function(req, res){
  //   if(req.user.id == req.params.id){
  //     User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
  //       req.flash('success', 'Updated!');
  //       return res.redirect('back');
  //     });
  //   }else{
  //     req.flash('error', 'Unathorize!');
  //     return res.status(401).send('Unauthorized');
  //   }
  //  }


  //  module.exports.logOut = function(req, res){
  //       if(req.cookies.user_id){
  //         User.findByIdAndDelete(req.cookies.user_id, function(err, user){
  //               if(user){
  //                 return res.render('user_log_out',{
  //                   title: "User Deleted",
  //                   user : user
  //                 })
  //               }
  //         });
  //       }
  //  }

  if(req.user.id == req.params.id){
        
    try{
        let user = await User.findById(req.params.id);
        User.uploadedAvatar(req, res,function(err){
            if (err) {console.log('*****Multer Error: ', err)}

            // console.log(req.file);
            user.name = req.body.name;
            user.email = req.body.email;

            if (req.file){


              if (user.avatar) {
                const avatarPathToDelete = path.join(__dirname, '..', user.avatar);
                
                // Check if the avatar file exists before attempting to delete it
                fs.stat(avatarPathToDelete, (err, stats) => {
                    if (err) {
                        if (err.code === 'ENOENT') {
                            // The file doesn't exist, so no need to delete it
                            console.log('Avatar file does not exist.');
                        } else {
                            // Handle other errors
                            console.error('Error checking avatar file:', err);
                        }
                    } else {
                        // The file exists, so we can safely delete it
                        fs.unlinkSync(avatarPathToDelete);
                    }
                });
            }
            
            // Rest of your code for updating the user's avatar and saving it
            


              // if (user.avatar){
              //     fs.unlinkSync(path.join(__dirname, '..', user.avatar));
              // }
              // this is saving the path of the uploaded file into the avatar field in the user
                user.avatar = User.avatarPath + '/' + req.file.filename;
            }
            user.save();
            return res.redirect('back');
        });

    }catch(err){
           req.flash('error', err);
           return res.redirect('back');
    }

  }else{
         req.flash('error', 'Unathorize!');
         return res.status(401).send('Unauthorized');
  }
}
// module.exports.usersprofile = function(req, res){
//     return res.render('user_profile', {
//         title: "User Profile"
//       });
// }



// render the sign up page
module.exports.signUp = function(req, res){
  if (req.isAuthenticated()){
        return res.redirect('/users/profile');
  }


  return res.render('user_sign_up', {
      title: "Codeial  | Sign Up"
  });
}

//render the sign in page
module.exports.signIn = function(req, res){
  if (req.isAuthenticated()){
      return res.redirect('/users/profile');
  }
  return res.render('user_sign_in', {
      title: "Codeial | Sign In"
  });
}



// get the sign up data
module.exports.create = function(req, res){
    if(req.body.password != req.body.confirm_password){
      req.flash('error', 'Passwords do not match');
       return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
         if(err){
          // console.log('error in finding user in signing up'); 
          req.flash('error', err);
          return
         }

         if(!user){
            User.create(req.body, function(err, user){
              if(err){
                // console.log('error in creating user while signing up');  
                req.flash('error', err);
                return
              }

                return res.redirect('/users/sign-in')
            })
         }else{
              req.flash('success', 'You have signed up, login to continue!');
              return res.redirect('back');
         }

    });

}

// sign in and create a session for the user
module.exports.createSession = function(req, res){
  req.flash('success', 'Logged in successfully');
  return res.redirect('/');       
       // steps to authenticate
       //  find the user
      //  User.findOne({email: req.body.email}, function(err, user){
      //       if(err){
      //        console.log('error in creating user while   signing up');  return}
        // handle user found

        // if(user){
           
        //   // handle password which doesn't match
        //   if(user.password != req.body.password){
        //     return res.redirect('back');
        //   }

        //   // handle session creation
        //   res.cookie('user_id', user.id);
        //   return res.redirect('/users/profile')
          
        // }else{
          // handle user not found
          //here i am change the code 'user._id' to 'user.id'
//           req.session.currentUser = user.id;
//           return res.redirect('back');
//         }

//        })
          
          
}
module.exports.destroySession = function(req, res, next) {
  // req.logout(function(err) {
  //   if (err) { return next(err); }
  
  //   // req.flash('success', 'You have logged out!');
  //   res.redirect('/');
  // });
  req.logout(function(err, user){
    if(err){
      return next(err);
    }
  });
  req.flash('success', 'You have logged out!');
  res.redirect('/');
}