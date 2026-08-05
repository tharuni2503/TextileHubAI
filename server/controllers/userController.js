import User from "../models/User.js";

// =======================
// GET PROFILE
// =======================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// UPDATE PROFILE
// =======================
export const updateProfile = async (req, res) => {
  try {

    const {
      name,
      phone,
      businessName,
      gstNumber,
      website,
      companyDescription,
      address,
      city,
      state,
      country,
      pincode,
      profileImage,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.businessName = businessName || user.businessName;

    user.gstNumber = gstNumber || user.gstNumber;
    user.website = website || user.website;
    user.companyDescription =
      companyDescription || user.companyDescription;

    user.address = address || user.address;
    user.city = city || user.city;
    user.state = state || user.state;
    user.country = country || user.country;
    user.pincode = pincode || user.pincode;

    user.profileImage =
      profileImage || user.profileImage;

    await user.save();

    res.json({
      success: true,
      message: "Profile Updated Successfully",
      user,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};