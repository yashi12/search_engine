const Profile = require("../../models/Profile");

const fetchMetamassAddress = (user_id) => {
  try {
    Profile.findOne({ user: user_id }).then((profile) => {
      if (profile.blockchainAddress) {
        let address = profile.blockchainAddress;
        console.log("address", address);
        return address;
      }
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  fetchMetamassAddress: fetchMetamassAddress,
};
