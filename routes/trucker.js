const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const auth = require("../middleware/auth");
const config = require("config");

const {
  checkTruckerAdmin,
  fetchUserRole,
  getAllMembers,
  checkTruckByNumberPlateAndCompany,
  addTruck,
  getTruck,
  getTrucks,
  checkDriverByEmail,
  addDriver,
  getDriver,
  getTruckOfDriver,
  checkDriverExistsById,
  checkTruckExistsById,
  checkTruckNotAssigned,
  checkDriverNotAssigned,
  assignTruck,
} = require("../db_functions/trucker_functions");
const e = require("express");
const { route } = require("./aggregate");

router.get("/signupfailure", (req, res) => {
  res.status(400).json({ success: false, message: req.flash("message")[0] });
});

router.get("/signinfailure", (req, res) => {
  res.status(400).json({ success: false, message: req.flash("message")[0] });
});

router.post(
  "/signup",
  passport.authenticate("trucker-signup", {
    failureRedirect: "/api/trucker/signupfailure",
    failureFlash: true,
  }),
  function (req, res) {
    return res.status(200).json({
      success: true,
      message: "User Created",
      token: req.token,
      user: req.user,
    });
  }
);

router.post(
  "/login",
  passport.authenticate("trucker-signin", {
    failureRedirect: "/api/trucker/signinfailure",
    failureFlash: true,
  }),
  function (req, res) {
    return res.status(200).json({
      success: true,
      message: "User Logged In",
      token: req.token,
      user: req.user,
    });
  }
);

// @DESCRIPTION: This Route Is Used To Add Trucks
// @headers: x_auth_token, @body: truck_company_id,vehicle_no,number_plate
router.post("/truck", auth, (req, res) => {
  let userId = req.user.userId;
  let company_id1 = req.body.truck_company_id;
  let { number_plate, vehicle_no, truck_type_id } = req.body;
  checkTruckerAdmin(userId, company_id1, function (adminValidity) {
    if (adminValidity[0] == false) {
      return res
        .status(400)
        .json({ success: false, message: adminValidity[1] });
    } else {
      checkTruckByNumberPlateAndCompany(company_id1, number_plate, function (
        truckExistence
      ) {
        if (truckExistence[0] == false) {
          return res
            .status(400)
            .json({ success: false, message: truckExistence[1] });
        } else {
          addTruck(
            company_id1,
            vehicle_no,
            number_plate,
            truck_type_id,
            function (addedTruck) {
              if (addedTruck[0] == false) {
                return res
                  .status(400)
                  .json({ success: false, message: addedTruck[1] });
              } else {
                getTruck(company_id1, addedTruck[1], function (fetchedTruck) {
                  if (fetchedTruck == false) {
                    return res
                      .status(400)
                      .json({ success: false, message: fetchedTruck[1] });
                  } else {
                    return res.status(200).json({
                      success: true,
                      message: fetchedTruck[1],
                      truck: fetchedTruck[2],
                    });
                  }
                });
              }
            }
          );
        }
      });
    }
  });
});

// @DESCRIPTION: This Route Is Used To Add Drivers By The Admin
// @headers: x_auth_token, @body: truck_company_id,name,email,phone_no,user_role
router.post("/driver", auth, (req, res) => {
  let userId = req.user.userId;
  let company_id1 = req.body.truck_company_id;
  let { user_role, name, email, phone_no } = req.body;

  checkTruckerAdmin(userId, company_id1, function (adminValidity) {
    if (adminValidity[0] == false) {
      return res
        .status(400)
        .json({ success: false, message: adminValidity[1] });
    } else {
      checkDriverByEmail(email, function (driverExistence) {
        if (driverExistence[0] == false) {
          return res
            .status(400)
            .json({ success: false, message: driverExistence[1] });
        } else {
          addDriver(company_id1, name, email, phone_no, user_role, function (
            addedDriver
          ) {
            if (addedDriver[0] == false) {
              return res
                .status(400)
                .json({ success: false, message: addedDriver[1] });
            } else {
              getDriver(company_id1, addedDriver[2], function (fetchedDriver) {
                if (fetchedDriver[0] == false) {
                  return res
                    .status(400)
                    .json({ success: false, message: fetchedDriver[1] });
                } else {
                  return res.status(200).json({
                    success: true,
                    message: fetchedDriver[1],
                    driver: fetchedDriver[2],
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

// @DESCRIPTION: This Route Is Used To View Members Of The Truck Company By The Admin
// @headers: x_auth_token, @body: truck_company_id
router.get("/member", auth, (req, res) => {
  let userId = req.user.userId;
  let company_id1 = req.body.truck_company_id;
  checkTruckerAdmin(userId, company_id1, function (adminValidity) {
    if (adminValidity[0] == false) {
      return res
        .status(400)
        .json({ success: false, message: adminValidity[1] });
    } else {
      getAllMembers(company_id1, function (fetchedMembers) {
        if (fetchedMembers[0] == false) {
          return res
            .status(400)
            .json({ success: false, message: fetchedMembers[1] });
        } else {
          return res.status(200).json({
            success: true,
            message: fetchedMembers[1],
            members: fetchedMembers[2],
          });
        }
      });
    }
  });
});

// @DESCRIPTION: This Route Is Used To View Trucks Of The Truck Company
// @headers: x_auth_token, @body: truck_company_id
router.get("/truck", auth, (req, res) => {
  let userId = req.user.userId;
  let company_id1 = req.body.truck_company_id;

  fetchUserRole(userId, company_id1, function (userRole) {
    if (userRole[0] == false) {
      return res.status(400).json({ success: false, message: userRole[1] });
    } else {
      if (userRole[1] == "Admin") {
        getTrucks(company_id1, function (fetchedTrucks) {
          if (fetchedTrucks[0] == false) {
            return res
              .status(400)
              .json({ success: false, message: fetchedTrucks[1] });
          } else {
            return res.status(200).json({
              success: true,
              message: fetchedTrucks[1],
              trucks: fetchedTrucks[2],
            });
          }
        });
      } else if (userRole[1] == "Driver") {
        getTruckOfTrucker(userId, company_id1, function (fetchedTruck) {
          if (fetchedTruck[0] == false) {
            return res
              .status(400)
              .json({ success: false, message: fetchedTruck[1] });
          } else {
            return res.status(200).json({
              success: true,
              message: fetchedTruck[1],
              trucks: fetchedTruck[2],
            });
          }
        });
      }
    }
  });
});

// @DESCRIPTION: This Route Is Used To Assign Truck To A Driver
// @headers: x_auth_token, @body: truck_company_id, @params:driver_id,truck_id
router.post("/driver/:driver_id/truck/:truck_id", auth, (req, res) => {
  let userId = req.user.userId;
  let company_id1 = req.body.truck_company_id;
  let { driver_id, truck_id } = req.params;
  checkTruckerAdmin(userId, company_id1, function (adminValidity) {
    if (adminValidity[0] == false) {
      return res
        .status(400)
        .json({ success: false, message: adminValidity[1] });
    } else {
      checkDriverExistsById(company_id1, driver_id, function (driverExistence) {
        if (driverExistence[0] == false) {
          return res
            .status(400)
            .json({ success: false, message: driverExistence[1] });
        } else {
          checkTruckExistsById(company_id1, truck_id, function (
            truckExistence
          ) {
            if (truckExistence[0] == false) {
              return res
                .status(400)
                .json({ success: false, message: truckExistence[1] });
            } else {
              checkTruckNotAssigned(truck_id, function (notAssignedTruck) {
                if (notAssignedTruck[0] == false) {
                  return res
                    .status(400)
                    .json({ success: false, message: notAssignedTruck[1] });
                } else {
                  checkDriverNotAssigned(driver_id, function (
                    notAssignedDriver
                  ) {
                    if (notAssignedDriver[0] == false) {
                      return res.status(400).json({
                        success: false,
                        message: notAssignedDriver[1],
                      });
                    } else {
                      assignTruck(company_id1, driver_id, truck_id, function (
                        assignedComplete
                      ) {
                        if (assignedComplete[0] == false) {
                          return res.status(400).json({
                            success: false,
                            message: assignedComplete[1],
                          });
                        } else {
                          return res.status(200).json({
                            success: true,
                            message: assignedComplete[1],
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

module.exports = router;
