const Profile = require("../../models/Profile");
const Doubt = require("../../models/discussion/Doubt");
const Booking = require("../../models/discussion/Booking");

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

const makDoubtsAsSolved = () => {
  try {
    Doubt.find({
      status: "in process",
      date: {
        $lte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
      },
    })
      .select({ _id: 1, date: 1 })
      .then((doubts) => {
        console.log(doubts);
        for (let i = 0; i < doubts.length; i++) {
          Doubt.findByIdAndUpdate(doubts[i]._id, {
            $set: {
              status: "solved",
            },
          }).then((doubt) => {});
        }
      });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  fetchMetamassAddress: fetchMetamassAddress,
  makDoubtsAsSolved: makDoubtsAsSolved,
};
