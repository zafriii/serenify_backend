const User = require("../models/user-model")
const bycrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const home = async (req,res) => {
    try{
        res.status(200).json({message:"Welcome home"});
    }
    catch(error){
        console.log("Error in Home Page", error);
        res.status(400).json({message: "Server Error"});
    }
}


const register = async (req, res, next) => {
    try {
        const schema = Joi.object({
            username: Joi.string().min(3).required().messages({
                "string.min": "Username must be at least 3 characters long",
                "any.required": "Username is required"
            }),
            email: Joi.string().email().required().messages({
                "string.email": "Invalid email format",
                "any.required": "Email is required"
            }),
            phone: Joi.string().pattern(/^\d{10,15}$/).required().messages({
                "string.pattern.base": "Phone number must contain only digits and be between 10 and 15 digits",
                "any.required": "Phone number is required"
            }),
            password: Joi.string().min(6).required().messages({
                "string.min": "Password must be at least 6 characters long",
                "any.required": "Password is required"
            })
        });

        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.reduce((acc, err) => {
                acc[err.path[0]] = err.message;
                return acc;
            }, {});
            return res.status(400).json({ errors });
        }

        const { username, email, phone, password } = req.body;

        // Check if user with the same email exists
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Check if user with the same username exists
        const usernameExist = await User.findOne({ username: username });
        if (usernameExist) {
            return res.status(400).json({ message: "Username taken" });
        }

        // Create the user
        const userCreated = await User.create({ username, email, phone, password });

        // Generate a token
        //const token = await userCreated.generateToken();

        // Send the success response
        // res.status(201).json({
        //     message: "Registration successful",
        //     token: token,
        //     userId: userCreated._id.toString()
        // });

        res.status(201).json({message:"Registration successful", 
                        token: await userCreated.generateToken(),
                        userId:userCreated._id.toString() 
                    });

    } catch (error) {
        console.log("Error in reg Page", error);
        next(error);
    }
};



const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const userExist = await User.findOne({ email: email });

        if (!userExist) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Check if the password is correct
        const isMatch = await bycrypt.compare(password, userExist.password); 

        if (isMatch) {
            // Generate token only if credentials are valid
            const token = await userExist.generateToken(); // Ensure generateToken is defined in your User model

            return res.status(200).json({
                message: "Login successful",
                token: token,
                userId: userExist._id.toString(),
                
            });
        } else {
            return res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.log("Error in login Page", error);
        return res.status(500).json({ message: "Server Error" }); // Respond with server error
    }
};



const user = async(req,res) => {
     
    try{
         const userData = req.user;
         console.log(userData);
         return res.status(200).json({userData});
        // res.status(200).json({message:"Hi user"});
    }

    catch(error){
        console.log('User Error', error);
    }
}



const updateProfile = async (req, res) => {
    try {
        const { email, username, phone, password } = req.body;

        console.log(email, username, phone, password);

        // Find the user by email (use req.userID from the middleware if using JWT)
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // If username is provided, check if it's taken by another user
        if (username) {
            const usernameExist = await User.findOne({ username });

            // Check if the username exists and does not belong to the current user
            if (usernameExist && usernameExist._id.toString() !== user._id.toString()) {
                return res.status(400).json({ message: "Username taken" });
            }

            // Update the username if it's not taken
            user.username = username;
        }

        // Update phone if provided
        if (phone) user.phone = phone;

        // Update password if provided
        if (password) {
            // Handle password hashing here if necessary
            user.password = password;
        }

        // Save the updated user data
        await user.save();

        // Generate a new token
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET_KEY, {
            expiresIn: '30days' // Adjust as needed
        });

        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                username: user.username,
                email: user.email,
                phone: user.phone
            },
            token // Send the new token in the response
        });
    } catch (error) {
        console.error("Error in updating profile", error);
        res.status(500).json({ message: "Server Error" });
    }
};



const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Validate if email is provided
      if (!email) {
        return res.status(400).json({ message: "Please provide email" });
      }
  
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found, please register" });
      }
  
      // Generate reset token
      const resetToken = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

      const resetUrl = `serenifymentalwellness.netlify.app/reset-password/${resetToken}`;
  
      // Configure the email transporter
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        secure: true,
        auth: {
          user: process.env.MY_GMAIL,
          pass: process.env.MY_PASSWORD,
        },
      });
  
      // Email content
      const mailOptions = {
        from: user.email,
        to: email,
        subject: "Password Reset Request",
        text: `Click on this link to reset your password: ${resetUrl}`
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);
  
      return res.status(200).json({ message: "Password reset link sent successfully to your email" });
    } catch (error) {
      console.error("Error in forgetPassword:", error);
      return res.status(500).json({ message: "Server Error" });
    }
  };




const resetPassword = async (req, res) => {
    try {
      const { resetToken } = req.params;
      const { password } = req.body;
  
      // Validate if password is provided
      if (!password) {
        return res.status(400).json({ message: "Please provide password" });
      }
  
      // Verify the reset token
      const decoded = jwt.verify(resetToken, process.env.JWT_SECRET_KEY);
  
      // Find the user by decoded email
      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
       // Hash the new password and update it in the database
      //   const hashedPassword = await bycrypt.hash(password, 10); // 10 is the salt rounds
     //   user.password = hashedPassword;
        user.password = password;
      await user.save();
  
      return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Error in resetPassword:", error);
      return res.status(500).json({ message: "Server Error" });
    }
  };


// Send OTP
const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate OTP and expiration time
        const otp = crypto.randomInt(100000, 999999); // 6-digit OTP
        const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes from now

        // Save OTP and expiry to the user's record
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Configure email transporter
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.MY_GMAIL,
                pass: process.env.MY_PASSWORD,
            },
        });

        // Send OTP email
        const mailOptions = {
            from: process.env.MY_GMAIL,
            to: email,
            subject: "Account Verification OTP",
            text: `Your OTP for account verification is ${otp}. This OTP will expire in 10 minutes.`,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error in sending OTP:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

// Verify OTP
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if OTP matches and is not expired
        if (user.otp === otp && user.otpExpiry > Date.now()) {
            user.isVerified = true; // Mark user as verified
            user.otp = null; // Clear OTP
            user.otpExpiry = null; // Clear OTP expiry
            await user.save();

            return res.status(200).json({ message: "Account verified successfully" });
        } else {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
    } catch (error) {
        console.error("Error in verifying OTP:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};


module.exports = { home, register, login, user, updateProfile, forgotPassword, resetPassword, sendOTP, verifyOTP };


 