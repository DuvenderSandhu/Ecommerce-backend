import jwt from 'jsonwebtoken'
function loginUser(req,res, next){
    let token= req.body.token;
    let JWT_STRING; // TO Be Work on it 
    let user=jwt.verify(token,JWT_STRING)
    if(user.length!=0){
        req.user=user;
    }
    next()
}