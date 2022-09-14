const User = require("../models/user");
const mongoose = require("mongoose");

module.exports = {
    addUserAddress: async (userAddress , userId) => {
    try {
      let {
        firstName,
        lastName,
        phoneNumber,
        email,
        address,
        country,
        state,
        zip,
      } = userAddress;
      let userDetails = await User.findOne({
        _id: mongoose.Types.ObjectId(userId),
      });
      if (userDetails) {
        let data = {
          address_id:Date.now(),
          firstName,
          lastName,
          phoneNumber,
          email,
          address,
          country,
          state,
          zip,
        };
        userDetails.addresses.push(data);
        return await userDetails.save();
      }
    } catch (error) {
        
        return null
    }
    },
    findUser:async (userId) => {
        try {
            let user = await User.findOne({ _id: mongoose.Types.ObjectId(userId) }, { addresses: 1 });
            return user
        } catch (error) {
            // console.log(error);
            return error
        }
    },
    updateUserAddress: async(userAddress, userId, addressId) => {
        try {
            let { firstName,lastName,phoneNumber,email,address,country,state,zip} = userAddress;
              let userDetails = await User.findOne({
                _id: mongoose.Types.ObjectId(userId),
              });
            console.log(userDetails,"😢😢😢")
              let a  = {
                        address_id:addressId,
                        firstName,
                        lastName, 
                        phoneNumber,
                        email,
                        address,
                        country,
                        state,
                        zip,
                      };
                    //   userDetails.addresses.push(data);
                //     }
            console.log(addressId,"😒😒😒😒😒😒😒")
            for (var i = 0; i < userDetails.addresses.length; i++) {
                console.log(userDetails.addresses[0],"💕💕💕💕💕💕")

                if (userDetails.addresses[i].address_id == addressId) {
                    userDetails.addresses[i] = a
                    console.log(userDetails.addresses[i])
                    break;
                        
                } 
            }
            return await userDetails.save();
            
                // if (address.address_id == addressId) {
                //     let a  = {
                //         address_id:Date.now(),
                //         firstName,
                //         lastName,
                //         phoneNumber,
                //         email,
                //         address,
                //         country,
                //         state,
                //         zip,
                //       };
                //       userDetails.addresses.push(data);
                //       return await userDetails.save();
                //     }
                 
            //  })
             
        } catch (error) {
            console.log(error)
        }
    }
};
