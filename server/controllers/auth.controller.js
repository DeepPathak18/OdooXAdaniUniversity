const User = require("../models/User");
const Activity = require("../models/Activity");
const Otp = require("../models/Otp");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const axios = require("axios");

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Signup
const signup = async (req, res) => {
  const { username, firstName, lastName, email, password } = req.body;

  console.log("Signup attempt for email:", email);
  console.log("Request body:", req.body);

  // --- No changes to your validation logic ---
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Please enter a valid email address" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }
  // --- End of validation ---

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({
      username,
      firstName,
      lastName,
      email,
      password,
    });

    await user.save();
    console.log("User created successfully:", email);

    // --- ADDED JWT GENERATION ON SIGNUP ---
    // <-- 2. Create the payload for the token
    const payload = {
      user: {
        id: user.id, // Use the MongoDB document ID
      },
    };

    // <-- 3. Sign the token with your secret key
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Your secret key from .env file
      { expiresIn: "1d" }, // Token expires in 5 hours
      (err, token) => {
        if (err) throw err;
        // <-- 4. Send the token back to the client
        res.json({
          message: "Signup successful",
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
          },
        });
      }
    );
    // --- END OF JWT GENERATION ---
  } catch (err) {
    console.error("Signup error details:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Signin
const signin = async (req, res) => {
  const { email, password } = req.body;
  console.log("Signin attempt for email:", email);

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    

    // 🔹 Real users → check DB + OTP flow
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // --- Dev/Test OTP bypass ---
    // If SKIP_OTP is set to 'true' or we're in development mode, or the legacy
    // test account is used, return a JWT immediately instead of starting OTP flow.
    const skipOtp =
      process.env.SKIP_OTP === 'true' || process.env.NODE_ENV === 'development' ||
      email === 'test@example.com';

    if (skipOtp) {
      console.log('OTP bypass active for signin (SKIP_OTP|NODE_ENV|test user).');
      const payload = {
        user: {
          id: user._id,
        },
      };

      return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '5h' },
        (err, token) => {
          if (err) {
            console.error('JWT Error:', err);
            return res.status(500).json({ message: 'Token generation failed' });
          }
          return res.json({
            message: 'Sign in successful (OTP bypassed)',
            token,
            user: {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              username: user.username,
            },
          });
        }
      );
    }
    // --- End dev/test bypass ---

    // OTP logic for normal users
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const newOtp = new Otp({ email: user.email, otp });
    await newOtp.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your OTP for Sign In",
      text: `Your OTP is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Error sending OTP email" });
      }
      console.log("Email sent: " + info.response);
      res
        .status(200)
        .json({ message: "OTP sent to your email", email: user.email });
    });
  } catch (err) {
    console.error("Signin error stack:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const otpDoc = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (!otpDoc) {
      return res.status(400).json({ message: "Invalid OTP or OTP expired" });
    }

    const isMatch = await otpDoc.compareOtp(otp);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = await User.findOne({ email });

    // Log login activity
    const loginActivity = new Activity({
      user: user._id,
      activityType: "login",
      description: "User logged in.",
    });
    await loginActivity.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5h" },
      (err, token) => {
        if (err) throw err;
        res.json({
          message: "Sign in successful",
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
          },
        });
      }
    );

    // Delete the used OTP
    await Otp.deleteOne({ _id: otpDoc._id });
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Google Sign-In
const googleSignin = async (req, res) => {
  const { email, firstName, lastName, googleId } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      // If user doesn't exist, create a new one
      user = new User({
        email,
        firstName,
        lastName,
        googleId,
        // You might want to generate a random password or handle this differently
        password: Math.random().toString(36).slice(-8),
      });
      await user.save();
    }

    // --- OTP Generation and Sending ---
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newOtp = new Otp({
      email: user.email,
      otp: otp,
    });
    await newOtp.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your OTP for Sign In",
      text: `Your OTP is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Error sending OTP email" });
      }
      console.log("Email sent: " + info.response);
      res
        .status(200)
        .json({ message: "OTP sent to your email", email: user.email });
    });
  } catch (err) {
    console.error("Google Sign-in error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GitHub OAuth Callback
const githubCallback = async (req, res) => {
  const { code } = req.query;
  console.log("GitHub callback initiated. Code:", code);

  try {
    // Exchange code for access token
    console.log("Attempting to exchange code for access token...");
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    console.log("Token exchange response:", tokenResponse.data);

    const { access_token } = tokenResponse.data;
    if (!access_token) {
      console.error("No access token received from GitHub.");
      return res.redirect(
        `http://localhost:5173/signin?error=github_token_failed`
      );
    }

    // Fetch user info from GitHub
    console.log("Fetching user info from GitHub...");
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });
    console.log("GitHub user info:", userResponse.data);

    const githubUser = userResponse.data;
    let email = githubUser.email;

    // If email is null, fetch from the primary email endpoint
    if (!email) {
      console.log(
        "Email not found in user info, fetching from user/emails endpoint..."
      );
      const emailsResponse = await axios.get(
        "https://api.github.com/user/emails",
        {
          headers: {
            Authorization: `token ${access_token}`,
          },
        }
      );
      const primaryEmail = emailsResponse.data.find(
        (e) => e.primary && e.verified
      );
      if (primaryEmail) {
        email = primaryEmail.email;
        console.log("Primary email found:", email);
      }
    }

    if (!email) {
      console.error("Could not retrieve a verified email from GitHub.");
      return res.redirect(
        `http://localhost:5173/signin?error=github_email_missing`
      );
    }

    let user = await User.findOne({ email });

    if (!user) {
      console.log("User not found, creating new user...");
      user = new User({
        email,
        firstName: githubUser.name || githubUser.login,
        lastName: "",
        githubId: githubUser.id,
        password: Math.random().toString(36).slice(-8), // Consider a more secure way to handle password for OAuth users
      });
      await user.save();
      console.log("New user created:", user.email);
    } else {
      console.log("Existing user found:", user.email);
    }

    // --- OTP Generation and Sending ---
    console.log("Generating and sending OTP...");
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newOtp = new Otp({
      email: user.email,
      otp: otp,
    });
    await newOtp.save();
    console.log("OTP saved to DB.");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your OTP for Sign In",
      text: `Your OTP is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending OTP email:", error);
        return res.redirect(
          `http://localhost:5173/signin?error=otp_send_failed`
        );
      }
      console.log("Email sent: " + info.response);
      console.log("Attempting to redirect to verify-otp page...");
      res.redirect(`http://localhost:5174/verify-otp?email=${user.email}`);
    });
  } catch (err) {
    console.error("GitHub OAuth error caught in catch block:", err);
    res.redirect(
      `http://localhost:5174/signin?error=github_oauth_failed&message=${encodeURIComponent(
        err.message
      )}`
    );
  }
};

module.exports = { signup, signin, verifyOtp, googleSignin, githubCallback };
