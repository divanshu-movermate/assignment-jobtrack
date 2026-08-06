const User = require("../models/User");
const ApiResponse = require("../utils/ApiResponse")
const asyncHandler = require("../utils/asyncHandler")





const createUser = asyncHandler( async (req, res)=>{
    // res.status(200).json({
    //     message: 'ok'
    // })

    const {name, email, password, role} = req.body

    // if([name, email, password, role].some((field)=>field?.trim()==="")){
    //     return res.status(400).json({ success: false, error: "All fields are required" });

        
    // }
    //Have to do validation through zod

    
    const existedUser = await User.findOne({ email });

    if(existedUser){
        return res.status(409).json({ success: false, error: "Email already exist" });
    }


    const user = await User.create({
        name,
        email,
        password,
        role,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )


    if(!createdUser){
        return res.status(500).json({ success: false, error: "Something Went wrong while registering the user" });
    }

    return res.status(201).json(
       new ApiResponse(200, createdUser, "User Registered Successfully" )
    )
 });


const loginUser = asyncHandler( async (req, res)=>{
    const {email, password} = req.body;
    
    // if(!username && !email){
    //     return res.status(400).json({ success: false, error: "Username or email is required" });
    // }  verify it by zod
    const user = await User.findOne({ email });

    if(!user){
        return res.status(401).json({ success: false, error: "Email already exists" });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        return res.status(401).json({ success: false, error: "Invalid Credentials" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: true
    }


    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );




 });

const adminUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
      new ApiResponse(
        200,
        { user: req.user },
        `Welcome ${req.user.fullName} to Admin dashboard`
      )
    );
  });


const meUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
      new ApiResponse(
        200,
        { user: req.user },
        `Welcome ${req.user.name} to personal dashboard`
      )
    );
  });


const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: true,
      },
    },
    {
      new: true,                     // return the updated document (not required here, but good practice)
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});






module.exports = { loginUser, logoutUser, meUser, adminUser, createUser };