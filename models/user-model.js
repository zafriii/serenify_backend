const mongoose = require("mongoose")
const bycrypt = require("bcryptjs")
const jwt = require ('jsonwebtoken')

const userSchema = new mongoose.Schema({

    username:{
        type:String,
        require:true
    },

    email:{
        type:String,
        require:true
    },

    phone:{
        type:String,
        require:true
    },

    password:{
        type:String,
        require:true
    },

    isAdmin:{
        type:Boolean,
        default:false
    },
    isVerified: { type: Boolean, default: false }, // Verification status
    otp: { type: String }, // OTP for verification
    otpExpiry: { type: Date }
    
}, { timestamps: true })

userSchema.pre( 'save', async function (next) {
    const  user = this;
    
    if (!user.isModified('password')) return next();

    try{
        const saltRound = await bycrypt.genSalt(10);
        const hash_password = await bycrypt.hash(user.password,saltRound)
        user.password = hash_password;
        next()
    }
    catch(err){
        next(err);
    }

})


userSchema.methods.generateToken = async function(){
    try{
        return jwt.sign({
            userId :this._id.toString(),
            email:this.email,
            isAdmin:this.admin
        
        
        },

        process.env.JWT_SECRET_KEY,
        {
            expiresIn:"30d"
        }
    )
    }
    catch(error){
        console.log(error);
    }
}

const  User = new mongoose.model('User',userSchema ) 

module.exports = User