//requird express app and db
const express = require("express");
var db = require("../dbSetup");

const router = express.Router();

// The bcrypt library on NPM makes it really easy to hash and compare passwords in Node
const bcrypt = require("bcryptjs");

// The JSON web token (JWT) is one method for allowing authentication, without actually storing any information about the user on the system itself.
// In simple terms, authentication is the process of verifying who a user is, while authorization is the process of verifying what they have access to. Initially we will just check token in the header of request for restricted routes, then allow or deny request.
const jwt = require("jsonwebtoken");

// Passport is authentication middleware for Node. js.
const passport = require("passport");

const auth = require("../middleware/auth");

// Node-config creates configuration files for application deployments. Node-config allows us to define a set of default parameters
const config = require("config");

const {
  checkAggregateCompanyExists,
} = require("../db_functions/aggregate_company_functions");

const {
  checkAggregateUserExists,
  checkAggregateAdmin,
  fetchUserRole,
  getAllMembers,
} = require("../db_functions/aggregate_functions");

// Quarry - a place, typically a large, deep pit, from which stone or other materials are or have been extracted.
const {
  checkQuarryExists,
  addQuarry,
  selectQuarry,
  checkQuarryByIdAndCompany,
  assignQuarryManager,
  fetchAllQuarries,
  fetchManagerQuarries,
} = require("../db_functions/quarry");

const AddCustomer = require("../db_functions/customer");
const {
  addColor,
  selectColor,
  getColors,
} = require("../db_functions/addColor.js");
const {
  addPrice,
  selectPrice,
  getPrices,
} = require("../db_functions/addPrice.js");

const { addSize, selectSize, getSizes } = require("../db_functions/addSize.js");
const {
  addPermission,
  selectPermission,
  getPermissions,
} = require("../db_functions/user_permissions.js");

const {
  getCustomerSiteByCustomerId,
  getCustomerSitesByCustomerId,
  checkCustomerSiteExistsById,
} = require("../db_functions/customer_site");

const {
  checkCustomerExists,
  getCustomer,
  getCustomers,
} = require("../db_functions/customer_functions");

const {
  getItem,
  getItems,
  checkItemExistsById,
} = require("../db_functions/item");

const {
  createJob,
  getJobForAggregateUserByJobId,
  getJobsOfAggregateCompanyById,
  getJobStatus,
  approveJobByDispatcher,
} = require("../db_functions/job_functions");

const {
  getAvailablTrucksAndDrivers,
} = require("../db_functions/trucks_and_drivers");

const {
  createSubJob,
  getSubJobs,
  getSubJob,
} = require("../db_functions/sub_job_functions");

const {
  createSubJobTruck,
  getSubJobTrucks,
  getSubJobTruck,
  assignFleet,
} = require("../db_functions/sub_job_truck");

const { getShiftsByJobId } = require("../db_functions/shift_functions");

const e = require("express");

router.get("/signupfailure", (req, res) => {
  res.status(400).json({ success: false, message: req.flash("message")[0] });
});

router.get("/signinfailure", (req, res) => {
  res.status(400).json({ success: false, message: req.flash("message")[0] });
});

//sign up
router.post(
  "/signup",

  passport.authenticate("aggregate-signup", {
    failureRedirect: "/api/aggregate/signupfailure",
    failureFlash: true,
  }),

  function (req, res) {
    // console.log("-------");
    return res.status(200).json({
      success: true,
      message: "User Created",
      token: req.token,
      user: req.user,
    });
  }
);

//login
router.post(
  "/login",
  passport.authenticate("aggregate-signin", {
    failureRedirect: "/api/aggregate/signinfailure",
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

router.post("/permission", auth, (req, res) => {
  // var id = req.body.id;
  var role_name = req.body.role_name;
  var edit_user = req.body.edit_user;
  var view_user = req.body.view_user;
  var add_user = req.body.add_user;

  addPermission(role_name, edit_user, view_user, add_user, function (
    queryInserted
  ) {
    console.log(queryInserted);
    if (queryInserted[0] == false) {
      return res
        .status(400)
        .json({ success: false, message: queryInserted[1] });
    } else {
      selectPermission-(queryInserted[1], function (fetchedQuery) {
        if (fetchedQuery[0] == false) {
          return res
            .status(400)
            .json({ success: false, message: fetchedQuery[1] });
        } else {
          return res.status(200).json({
            success: true,
            message: fetchedQuery[1],
            permissions: fetchedQuery[2],
          });
        }
      });
    }
  });
});

// @DESCRIPTION: This Route Is Used To Add A Member To The Aggregate Company By The Admin
// @headers: x_auth_token, @body: aggregate_company_id,email,name,user_role,phone_no

router.post("/member", auth, (req, res) => {
  let userId = req.user.userId;
  let company_id1 = req.query.aggregate_company_id;

  console.log(userId, company_id1);

  // Validate that user can perform this function
  select_admin =
    "SELECT * FROM aggregate_user WHERE aggregate_user_id = ? AND role = ? AND aggregate_company_id = ?";

  db.query(select_admin, [userId, "Admin", company_id1], function (
    err,
    results
  ) {
    if (err) {
      return res
        .status(400)
        .json({ success: false, message: "Unknown Server Error" });
    }
    console.log(results);
    if (results[0]) {
      // Check if member already exists
      select_member = "SELECT * FROM aggregate_user WHERE email=?";
      db.query(select_member, [req.body.email], function (err, memberResults) {
        // console.log(memberResults);
        if (err) {
          return res
            .status(400)
            .json({ success: false, message: "Unknown Server Error" });
        }
        if (memberResults[0]) {
          return res
            .status(400)
            .json({ success: false, message: "This Member Already Exists" });
        } else {
          var generateHash = function (password) {
            return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
          };
          var name = req.body.name;
          var email = req.body.email;
          var role = req.body.user_role;
          var phone_no = req.body.phone_no;
          var password = generateHash("12345");
          var company_id = req.body.aggregate_company_id;
          add_user = "INSERT INTO aggregate_user SET ?";
          console.log(add_user);
          // Add aggregate_user
          db.query(
            add_user,
            {
              name,
              email,
              password,
              phone_no,
              role,
              aggregate_company_id: company_id,
            },
            function (err, userResults) {
              if (err) {
                return res
                  .status(400)
                  .json({ success: false, message: "Unknown Server Error" });
              } else {
                let jwtKey = config.get("jwtSecret");

                jwt.sign(
                  { userId: userResults.insertId },
                  jwtKey,
                  (err, token) => {
                    if (err) {
                    } else {
                      added_user = `SELECT * FROM aggregate_user WHERE ?`;
                      db.query(
                        added_user,
                        { aggregate_user_id: userResults.insertId },
                        function (err, rows) {
                          if (err) {
                            console.log(err);
                            return res.status(400).json({
                              success: false,
                              message: "Unknown Server Error",
                            });
                          } else {
                            return res.status(200).json({
                              success: true,
                              message: "Member Added",
                              member: rows[0],
                            });
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "User Not Authenticated To Perfom This Task",
      });
    }
  });
});

// @DESCRIPTION: This Route Is Used To View Members Of The Aggregate Company By The Admin
// @headers: x_auth_token, @body: aggregate_company_id
router.get("/member", auth, (req, res) => {
  let userId = req.user.userId;
  let company_id1 = req.query.aggregate_company_id;
  console.log(userId);
  console.log(company_id1);

  checkAggregateAdmin(userId, company_id1, function (adminValidity) {
    console.log(adminValidity);
    adminValidity = true;
    if (adminValidity[0] == false) {
      console.log(adminValidity[1]);
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

// @DESCRIPTION: This Route Is Used To Add A Quarry To The Aggregate Company By The Admin
// @headers: x_auth_token, @body: aggregate_company_id,name,address_line_1,address_line_2,city,pincode,state
router.post("/quarry", auth, (req, res) => {
  console.log("entered");
  let userId = req.user.userId;
  let company_id1 = req.body.aggregate_company_id;

  // Check If User Is Admin
  checkAggregateAdmin(userId, company_id1, function (validity) {
    console.log("validity :", validity);

    if (validity[0] == false) {
      return res.status(400).json({ success: false, message: validity[1] });
    } else {
      let {
        name,
        address_line_1,
        address_line_2,
        city,
        pincode,
        state,
      } = req.body;

      // Check If Quarry With The Same Name And Company Id Exists
      checkQuarryExists(name, company_id1, function (quarry) {
        if (quarry[0] == false) {
          return res.status(400).json({ success: false, message: quarry[1] });
        } else {
          // Add New Quarry
          addQuarry(
            name,
            company_id1,
            address_line_1,
            address_line_2,
            city,
            pincode,
            state,

            function (quarryInserted) {
              if (quarryInserted[0] == false) {
                return res
                  .status(400)
                  .json({ success: false, message: quarryInserted[1] });
              } else {
                selectQuarry(quarryInserted[1], company_id1, function (
                  fetchedQuarry
                ) {
                  if (fetchedQuarry[0] == false) {
                    return res
                      .status(400)
                      .json({ success: false, message: fetchedQuarry[1] });
                  } else {
                    return res.status(200).json({
                      success: true,
                      message: fetchedQuarry[1],
                      quarry: fetchedQuarry[2],
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

// @DESCRIPTION: This Route Is Used To Assign A Manager To A Quarry By The Admin
// @headers: x_auth_token, @body: aggregate_company_id, @params: quarry_id,manager_id
router.put("/quarry/:quarry_id/manager/:manager_id", auth, (req, res) => {
  let userId = req.user.userId;
  let company_id1 = req.body.aggregate_company_id;
  let quarry_id = req.params.quarry_id;
  let manager_id = req.params.manager_id;

  checkAggregateAdmin(userId, company_id1, function (validity) {
    if (validity[0] == false) {
      console.log(validity);
      return res.status(400).json({ success: false, message: validity[1] });
    } else {
      checkQuarryByIdAndCompany(quarry_id, company_id1, function (
        quarry_existence
      ) {
        if (quarry_existence[0] == false) {
          return res
            .status(400)
            .json({ success: false, message: quarry_existence[1] });
        } else {
          fetchUserRole(manager_id, company_id1, function (user_role) {
            if (user_role[0] == false) {
              return res
                .status(400)
                .json({ success: false, message: user_role[1] });
            } else {
              if (user_role[1] == "x") {
                assignQuarryManager(quarry_id, manager_id, function (
                  updated_quarry
                ) {
                  if (updated_quarry[0] == false) {
                    return res
                      .status(400)
                      .json({ success: false, message: updated_quarry[1] });
                  } else {
                    selectQuarry(updated_quarry[1], company_id1, function (
                      fetchedQuarry
                    ) {
                      if (fetchedQuarry[0] == false) {
                        return res
                          .status(400)
                          .json({ success: false, message: fetchedQuarry[1] });
                      } else {
                        return res.status(200).json({
                          success: true,
                          message: fetchedQuarry[1],
                          quarry: fetchedQuarry[2],
                        });
                      }
                    });
                  }
                });
              } else {
                return res.status(400).json({
                  success: false,
                  message: "Member Needs To Be Quarry Manager",
                });
              }
            }
          });
        }
      });
    }
  });
});

// @DESCRIPTION: This Route Is Used To Get All Quarries Of The Aggregate Company By The Admin
// @headers: x_auth_token, @body: aggregate_company_id
router.get("/quarry", auth, (req, res) => {
  let userId = req.user.userId;
  let companyId1 = req.body.aggregate_company_id;
  // Fetch User Role
  fetchUserRole(userId, companyId1, function (userRole) {
    // In Case Of Error Or Non Existent User
    if (userRole[0] == false) {
      return res.status(400).json({ success: false, message: userRole[1] });
    } else {
      // If User Is Admin/Sales Manager
      if (
        userRole[1] == "Admin" ||
        userRole[1] == "Sales Manager" ||
        userRole[1] == "Dispatcher"
      ) {
        fetchAllQuarries(companyId1, function (returnedQuarries) {
          if (returnedQuarries[0] == false) {
            return res
              .status(400)
              .json({ success: false, message: returnedQuarries[1] });
          } else {
            return res.status(200).json({
              success: true,
              message: "Quarries Fetched",
              quarries: returnedQuarries[1],
            });
          }
        });
      }
      // If User Is Quarry Manager
      else {
        fetchManagerQuarries(userId, companyId1, function (returnedQuarries) {
          if (returnedQuarries[0] == false) {
            return res
              .status(400)
              .json({ success: false, message: returnedQuarries[1] });
          } else {
            return res.status(200).json({
              success: true,
              message: "Quarries Fetched",
              quarries: returnedQuarries[1],
            });
          }
        });
      }
    }
  });
});

router.get("/color", auth, (req, res) => {
  getColors(function (fetchedColors) {
    if (fetchedColors[0] == false) {
      return res
        .status(400)
        .json({ success: false, message: fetchedColors[1] });
    } else {
      return res.status(200).json({
        success: true,
        message: fetchedColors[1],
        customers: fetchedColors[2],
      });
    }
  });
});

router.post("/addColor", auth, (req, res) => {
  var color_id = req.body.color_id;
  var color_name = req.body.color_name;
  var image = req.body.image;

  AddColor.addColor(color_id, color_name, image, function (colorInserted) {
    console.log(colorInserted);
    if (colorInserted[0] == false) {
      return res
        .status(400)
        .json({ success: false, message: colorInserted[1] });
    } else {
      AddColor.selectColor(colorInserted[1], function (fetchedColor) {
        if (fetchedColor[0] == false) {
          return res
            .status(400)
            .json({ success: false, message: fetchedColor[1] });
        } else {
          return res.status(200).json({
            success: true,
            message: fetchedColor[1],
            color: fetchedColor[2],
          });
        }
      });
    }
  });
});

router.get("/price", auth, (req, res) => {
  getPrices(function (fetchedPrices) {
    if (fetchedPrices[0] == false) {
      return res
        .status(400)
        .json({ success: false, message: fetchedPrices[1] });
    } else {
      return res.status(200).json({
        success: true,
        message: fetchedPrices[1],
        customers: fetchedPrices[2],
      });
    }
  });
});

router.post("/addPrice", auth, (req, res) => {
  // var id = req.body.id;
  var color = req.body.color;
  var size = req.body.size;
  var price = req.body.price;

  addPrice(color, size, price, function (priceInserted) {
    console.log(priceInserted);
    if (priceInserted[0] == false) {
      return res
        .status(400)
        .json({ success: false, message: priceInserted[1] });
    } else {
      selectPrice(priceInserted[1], function (fetchedPrice) {
        if (fetchedPrice[0] == false) {
          return res
            .status(400)
            .json({ success: false, message: fetchedPrice[1] });
        } else {
          return res.status(200).json({
            success: true,
            message: fetchedPrice[1],
            color: fetchedPrice[2],
          });
        }
      });
    }
  });
});

router.get("/size", auth, (req, res) => {
  getSizes(function (fetchedSizes) {
    if (fetchedSizes[0] == false) {
      return res.status(400).json({ success: false, message: fetchedSizes[1] });
    } else {
      return res.status(200).json({
        success: true,
        message: fetchedSizes[1],
        customers: fetchedSizes[2],
      });
    }
  });
});

router.post("/addSize", auth, (req, res) => {
  // var col = req.body.color_id;
  var size = req.body.size;
  var description = req.body.description;

  addSize(size, description, function (sizeInserted) {
    console.log(sizeInserted);
    if (sizeInserted[0] == false) {
      return res.status(400).json({ success: false, message: sizeInserted[1] });
    } else {
      selectSize(sizeInserted[1], function (fetchedSize) {
        if (fetchedSize[0] == false) {
          return res
            .status(400)
            .json({ success: false, message: fetchedSize[1] });
        } else {
          return res.status(200).json({
            success: true,
            message: fetchedSize[1],
            color: fetchedSize[2],
          });
        }
      });
    }
  });
});

router.post("/customer", auth, (req, res) => {
  let userId = req.user.userId;
  let company_id1 = req.query.aggregate_company_id;
  // console.log(userId);
  // console.log(company_id1);

  checkAggregateAdmin(userId, company_id1, function (validity) {
    console.log(validity);
    if (validity[0] == false) {
      return res.status(400).json({ success: false, message: validity[1] });
    } else {
      var generateHash = function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
      };

      var name = req.body.name;
      var email = req.body.email;
      var password = generateHash("12345");
      var phone_no = req.body.phone_no;
      var address_line_1 = req.body.address_line_1;
      var address_line_2 = req.body.address_line_2;
      var city = req.body.city;
      var pincode = req.body.pincode;
      var state = req.body.state;

      AddCustomer.addCustomer(
        name,
        email,
        password,
        phone_no,
        address_line_1,
        address_line_2,
        city,
        pincode,
        state,

        function (customerInserted) {
          console.log(customerInserted);
          if (customerInserted[0] == false) {
            return res
              .status(400)
              .json({ success: false, message: customerInserted[1] });
          } else {
            AddCustomer.selectCustomer(customerInserted[1], function (
              fetchedCustomer
            ) {
              if (fetchedCustomer[0] == false) {
                return res
                  .status(400)
                  .json({ success: false, message: fetchedCustomer[1] });
              } else {
                return res.status(200).json({
                  success: true,
                  message: fetchedCustomer[1],
                  customer: fetchedCustomer[2],
                });
              }
            });
          }
        }
      );
    }
  });
});

// @DESCRIPTION: This Route Is Used To Get All Customers
// @headers: x_auth_token , @body: aggregate_company_id
router.get("/customer", auth, (req, res) => {
  let aggregate_user_id = req.user.userId;
  let aggregate_company_id = req.query.aggregate_company_id;
  console.log(aggregate_company_id);

  checkAggregateUserExists(aggregate_user_id, aggregate_company_id, function (
    userExistence
  ) {
    console.log(userExistence);
    if (userExistence[0] == false) {
      return res
        .status(400)
        .json({ success: false, message: userExistence[1] });
    } else {
      getCustomers(function (fetchedCustomers) {
        if (fetchedCustomers[0] == false) {
          return res
            .status(400)
            .json({ success: false, message: fetchedCustomers[1] });
        } else {
          return res.status(200).json({
            success: true,
            message: fetchedCustomers[1],
            customers: fetchedCustomers[2],
          });
        }
      });
    }
  });
});

// @DESCRIPTION: This Route Is Used To Get A Particular Customer
// @headers: x_auth_token , @body: aggregate_company_id ,@params:customer_id
router.get("/customer/:customer_id", auth, (req, res) => {
  let aggregate_user_id = req.user.userId;
  let aggregate_company_id = req.body.aggregate_company_id;
  let customer_id = req.params.customer_id;
  checkAggregateUserExists(aggregate_user_id, aggregate_company_id, function (
    userExistence
  ) {
    if (userExistence[0] == false) {
      return res
        .status(400)
        .json({ success: false, message: userExistence[1] });
    } else {
      getCustomer(customer_id, function (fetchedCustomer) {
        if (fetchedCustomer[0] == false) {
          return res
            .status(400)
            .json({ success: false, message: fetchedCustomer[1] });
        } else {
          return res.status(200).json({
            success: true,
            message: fetchedCustomer[1],
            customer: fetchedCustomer[2],
          });
        }
      });
    }
  });
});

// @DESCRIPTION: This Route Is Used To Get All Customer Sites Of A Particular Customer
// @headers: x_auth_token , @body: aggregate_company_id, @params:customer_id
router.get("/customer/:customer_id/customersite", auth, (req, res) => {
  let userId = req.user.userId;
  let customer_id = req.params.customer_id;
  let company_id1 = req.body.aggregate_company_id;
  checkAggregateUserExists(userId, company_id1, function (userExistence) {
    if (userExistence[0] == false) {
      return res
        .status(400)
        .json({ success: false, message: userExistence[1] });
    } else {
      checkCustomerExists(customer_id, function (customerExistence) {
        if (customerExistence[0] == false) {
          return res
            .status(400)
            .json({ success: false, message: customerExistence[1] });
        } else {
          getCustomerSitesByCustomerId(customer_id, function (customerSites) {
            if (customerSites[0] == false) {
              return res
                .status(400)
                .json({ success: false, message: customerSites[1] });
            } else {
              return res.status(200).json({
                success: true,
                message: customerSites[1],
                customer_sites: customerSites[2],
              });
            }
          });
        }
      });
    }
  });
});

// @DESCRIPTION: This Route Is Used To Get Customer Site
// @headers: x_auth_token @body: aggregate_company_id @params:customer_id,customer_site_id
router.get(
  "/customer/:customer_id/customersite/:customer_site_id",
  auth,
  (req, res) => {
    let userId = req.user.userId;
    let { customer_id, customer_site_id } = req.params;
    let company_id1 = req.body.aggregate_company_id;
    checkAggregateUserExists(userId, company_id1, function (userExistence) {
      if (userExistence[0] == false) {
        return res
          .status(400)
          .json({ success: false, message: userExistence[1] });
      } else {
        checkCustomerExists(customer_id, function (customerExistence) {
          if (customerExistence[0] == false) {
            return res
              .status(400)
              .json({ success: false, message: customerExistence[1] });
          } else {
            getCustomerSiteByCustomerId(
              customer_id,
              customer_site_id,
              function (customerSite) {
                if (customerSite[0] == false) {
                  return res
                    .status(400)
                    .json({ success: false, message: customerSite[1] });
                } else {
                  return res.status(200).json({
                    success: true,
                    message: customerSite[1],
                    customer_site: customerSite[2],
                  });
                }
              }
            );
          }
        });
      }
    });
  }
);

// @DESCRIPTION: This Route Is Used To Get All Items
// @headers: x_auth_token, @body:aggregate_company_id
router.get("/item", auth, (req, res) => {
  let aggregate_user_id = req.user.userId;
  let { aggregate_company_id } = req.body;
  checkAggregateUserExists(aggregate_user_id, aggregate_company_id, function (
    userExistence
  ) {
    if (userExistence[0] == false) {
      return res
        .status(400)
        .json({ success: false, message: userExistence[1] });
    } else {
      getItems(function (fetchedItems) {
        if (fetchedItems[0] == false) {
          return res
            .status(400)
            .json({ success: false, message: fetchedItems[1] });
        } else {
          return res.status(200).json({
            success: true,
            message: fetchedItems[1],
            items: fetchedItems[2],
          });
        }
      });
    }
  });
});

// @DESCRIPTION: This Route Is Used To Get A Particular Item By The Customer
// @headers: x_auth_token,@body:aggregate_company_id,@params: item_id
router.get("/item/:item_id", auth, (req, res) => {
  let aggregate_user_id = req.user.userId;
  let item_id = req.params.item_id;
  let { aggregate_company_id } = req.body;
  checkAggregateUserExists(aggregate_user_id, aggregate_company_id, function (
    userExistence
  ) {
    if (userExistence[0] == false) {
      return res
        .status(400)
        .json({ success: false, message: userExistence[1] });
    } else {
      getItem(item_id, function (fetchedItem) {
        if (fetchedItem[0] == false) {
          return res
            .status(400)
            .json({ success: false, message: fetchedItem[1] });
        } else {
          return res.status(200).json({
            success: true,
            message: fetchedItem[1],
            item: fetchedItem[2],
          });
        }
      });
    }
  });
});

// @DESCRIPTION: This Route Is Used To Create Job By The Customer
// @headers: x_auth_token,
// @body:
// job_name,
// aggregate_company_id,
// sales_manager_id,
// customer_site_id,
// item_id,
// total_quantity,

// daily_minimum,
// interval_between_delivery,
// price_criteria,
// from_date,
// to_date,
// shifts,
// additional_notes,

router.post("/job", auth, (req, res) => {
  let sales_manager_id = req.user.userId;
  let {
    job_name,
    customer_id,
    aggregate_company_id,
    customer_site_id,
    item_id,
    total_quantity,
    daily_minimum,
    interval_between_delivery,
    price_criteria,
    from_date,
    to_date,
    shifts,
    additional_notes,
  } = req.body;

  fetchUserRole(sales_manager_id, aggregate_company_id, function (
    salesManagerExistence
  ) {
    if (salesManagerExistence[0] == false) {
      return res
        .status(400)
        .json({ success: false, message: salesManagerExistence[1] });
    } else {
      if (salesManagerExistence[1] != "Sales Manager") {
        return res
          .status(400)
          .json({ success: false, message: "User Is Not A Sales Manager" });
      } else {
        checkAggregateCompanyExists(aggregate_company_id, function (
          aggregateCompanyExistence
        ) {
          if (aggregateCompanyExistence[0] == false) {
            return res.status(400).json({
              success: false,
              message: aggregateCompanyExistence[1],
            });
          } else {
            checkCustomerSiteExistsById(customer_site_id, function (
              customerSiteExistence
            ) {
              if (customerSiteExistence[0] == false) {
                return res.status(400).json({
                  success: false,
                  message: customerSiteExistence[1],
                });
              } else {
                checkItemExistsById(item_id, function (itemExistence) {
                  if (itemExistence[0] == false) {
                    return res.status(400).json({
                      success: false,
                      message: itemExistence[1],
                    });
                  } else {
                    createJob(
                      job_name,
                      customer_id,
                      aggregate_company_id,
                      customer_site_id,
                      item_id,
                      total_quantity,
                      daily_minimum,
                      interval_between_delivery,
                      price_criteria,
                      from_date,
                      to_date,
                      shifts,
                      additional_notes,
                      function (createdJob) {
                        if (createdJob[0] == false) {
                          return res.status(400).json({
                            success: false,
                            message: createdJob[1],
                          });
                        } else {
                          getJobForAggregateUserByJobId(
                            createdJob[2],
                            function (fetchedJob) {
                              if (fetchedJob[0] == false) {
                                return res.status(400).json({
                                  success: false,
                                  message: fetchedJob[1],
                                });
                              } else {
                                return res.status(200).json({
                                  success: true,
                                  message: fetchedJob[1],
                                  job: fetchedJob[2],
                                });
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                });
              }
            });
          }
        });
      }
    }
  });
});

// @DESCRIPTION: This Route Is Used To Fetch All Jobs Of An Aggregate Company
// @headers: x_auth_token,@body:aggregate_company_id
router.get("/job", auth, (req, res) => {
  let aggregate_user_id = req.user.userId;
  let { aggregate_company_id } = req.body;
  checkAggregateUserExists(aggregate_user_id, aggregate_company_id, function (
    aggregateUserExistence
  ) {
    if (aggregateUserExistence[0] == false) {
      return res
        .status(400)
        .json({ success: false, message: aggregateUserExistence[1] });
    } else {
      getJobsOfAggregateCompanyById(aggregate_company_id, function (
        fetchedJobs
      ) {
        if (fetchedJobs[0] == false) {
          return res
            .status(400)
            .json({ success: false, message: fetchedJobs[1] });
        } else {
          return res.status(200).json({
            success: true,
            message: fetchedJobs[1],
            jobs: fetchedJobs[2],
          });
        }
      });
    }
  });
});

// @DESCRIPTION: This Route Is Used To Fetch A Particular Job Of An Aggregate Company
// @headers: x_auth_token,@body:aggregate_company_id,@params:job_id
router.get("/job/:job_id", auth, (req, res) => {
  let aggregate_user_id = req.user.userId;
  let { aggregate_company_id } = req.body;
  let job_id = req.params.job_id;
  checkAggregateUserExists(aggregate_user_id, aggregate_company_id, function (
    aggregateUserExistence
  ) {
    if (aggregateUserExistence[0] == false) {
      return res
        .status(400)
        .json({ success: false, message: aggregateUserExistence[1] });
    } else {
      getJobForAggregateUserByJobId(job_id, function (fetchedJob) {
        if (fetchedJob[0] == false) {
          return res
            .status(400)
            .json({ success: false, message: fetchedJob[1] });
        } else {
          return res.status(200).json({
            success: true,
            message: fetchedJob[1],
            job: fetchedJob[2],
          });
        }
      });
    }
  });
});

// @DESCRIPTION: This Route Is Used To Fetch All Shifts Of A Job Of An Aggregate Company
// @headers: x_auth_token,@body:aggregate_company_id,@params:job_id
router.get("/job/:job_id/shift", auth, (req, res) => {
  let aggregate_user_id = req.user.userId;
  let { aggregate_company_id } = req.body;
  let job_id = req.params.job_id;
  checkAggregateUserExists(aggregate_user_id, aggregate_company_id, function (
    aggregateUserExistence
  ) {
    if (aggregateUserExistence[0] == false) {
      return res
        .status(400)
        .json({ success: false, message: aggregateUserExistence[1] });
    } else {
      getShiftsByJobId(job_id, function (fetchedShifts) {
        if (fetchedShifts[0] == false) {
          return res
            .status(400)
            .json({ success: false, message: fetchedShifts[1] });
        } else {
          return res.status(200).json({
            success: true,
            message: fetchedShifts[1],
            shifts: fetchedShifts[2],
          });
        }
      });
    }
  });
});

// @DESCRIPTION: This Route Is Used To Approve A Job By The Dispatcher
// @headers: x_auth_token,@body:aggregate_company_id,@params:job_id
router.put("/job/:job_id/approve", auth, (req, res) => {
  let dispatcher_id = req.user.userId;
  let { aggregate_company_id } = req.body;
  let { job_id } = req.params;
  fetchUserRole(dispatcher_id, aggregate_company_id, function (userRole) {
    if (userRole[0] == false) {
      return res.status(400).json({ success: false, message: userRole[1] });
    } else {
      if (userRole[1] != "Dispatcher") {
        return res
          .status(400)
          .json({ success: false, message: "User Needs To Be Dispatcher" });
      } else {
        getJobStatus(job_id, function (fetchedJobStatus) {
          if (fetchedJobStatus[0] == false) {
            return res
              .status(400)
              .json({ success: false, message: fetchedJobStatus[1] });
          } else {
            if (fetchedJobStatus[2] == "PENDING_APPROVAL") {
              approveJobByDispatcher(job_id, dispatcher_id, function (
                approvedJob
              ) {
                if (approvedJob[0] == false) {
                  return res
                    .status(400)
                    .json({ success: false, message: approvedJob[1] });
                } else {
                  getJobForAggregateUserByJobId(approvedJob[1], function (
                    fetchedApprovedJob
                  ) {
                    if (fetchedApprovedJob[0] == false) {
                      return res.status(400).json({
                        success: false,
                        message: fetchedApprovedJob[1],
                      });
                    } else {
                      return res.status(200).json({
                        success: true,
                        message: fetchedApprovedJob[1],
                        job: fetchedApprovedJob[2],
                      });
                    }
                  });
                }
              });
            } else {
              return res.status(400).json({
                success: false,
                message: "The Job Has Already Been Approved",
              });
            }
          }
        });
      }
    }
  });
});

// @DESCRIPTION: This Route Is Used To Fetch The Fleet Of A Truck Company
// @headers: x_auth_token,@body:aggregate_company_id,truck_company_id
router.get("/fleet", auth, (req, res) => {
  let { aggregate_company_id, truck_company_id } = req.body;
  let aggregate_user_id = req.user.userId;
  fetchUserRole(aggregate_user_id, aggregate_company_id, function (checkUser) {
    if (checkUser[0] == false) {
      return res.status(400).json({ success: false, message: checkUser[1] });
    } else {
      getAvailablTrucksAndDrivers(truck_company_id, function (fetchedFleet) {
        if (fetchedFleet[0] == false) {
          return res
            .status(400)
            .json({ success: false, message: fetchedFleet[1] });
        } else {
          return res.status(200).json({
            success: true,
            message: fetchedFleet[1],
            fleet: fetchedFleet[2],
          });
        }
      });
    }
  });
});

// @DESCRIPTION: This Route Is Used To Create A Sub Job Inside A Particular Job By The Dispatcher
// @headers: x_auth_token,@body:aggregate_company_id,quarry_id,date,no_of_trucks,sub_job_quantity,@params:job_id
router.post("/job/:job_id/sub_job", auth, (req, res) => {
  let dispatcher_id = req.user.userId;
  let {
    aggregate_company_id,
    quarry_id,
    date,
    no_of_trucks,
    sub_job_quantity,
  } = req.body;
  let job_id = req.params.job_id;
  fetchUserRole(dispatcher_id, aggregate_company_id, function (userRole) {
    if (userRole[0] == false) {
      return res.status(400).json({ success: false, message: userRole[1] });
    } else if (userRole[1] != "Dispatcher") {
      return res
        .status(400)
        .json({ success: false, message: "User Should Be A Dispatcher" });
    } else {
      createSubJob(
        job_id,
        quarry_id,
        date,
        no_of_trucks,
        sub_job_quantity,
        function (createdSubJob) {
          if (createdSubJob[0] == false) {
            return res
              .status(400)
              .json({ success: false, message: createdSubJob[1] });
          } else {
            sub_job_id = createdSubJob[2];
            getSubJob(job_id, sub_job_id, function (fetchedSubJob) {
              if (fetchedSubJob[0] == false) {
                return res
                  .status(400)
                  .json({ success: false, message: fetchedSubJob[1] });
              } else {
                return res.status(200).json({
                  success: true,
                  message: "Sub Job Created",
                  sub_job: fetchedSubJob[2],
                });
              }
            });
          }
        }
      );
    }
  });
});

// @DESCRIPTION: This Route Is Used To Fetch All Sub Jobs Inside A Particular Job
// @headers: x_auth_token,@body:aggregate_company_id,@params:job_id
router.get("/job/:job_id/sub_job", auth, (req, res) => {
  let aggregate_user_id = req.user.userId;
  let { aggregate_company_id } = req.body;
  let { job_id } = req.params;
  fetchUserRole(aggregate_user_id, aggregate_company_id, function (checkUser) {
    if (checkUser[0] == false) {
      return res.status(400).json({ success: false, message: checkUser[1] });
    } else {
      getSubJobs(job_id, function (fetchedSubJobs) {
        if (fetchedSubJobs[0] == false) {
          return res.status(400).json({
            success: false,
            message: fetchedSubJobs[1],
          });
        } else {
          return res.status(200).json({
            success: true,
            message: fetchedSubJobs[1],
            sub_jobs: fetchedSubJobs[2],
          });
        }
      });
    }
  });
});

// @DESCRIPTION: This Route Is Used To Fetch A Particular Sub Job Inside A Particular Job
// @headers: x_auth_token,@body:aggregate_company_id,@params:job_id,sub_job_id
router.get("/job/:job_id/sub_job/:sub_job_id", auth, (req, res) => {
  let aggregate_user_id = req.user.userId;
  let { aggregate_company_id } = req.body;
  let { job_id, sub_job_id } = req.params;
  fetchUserRole(aggregate_user_id, aggregate_company_id, function (checkUser) {
    if (checkUser[0] == false) {
      return res.status(400).json({ success: false, message: checkUser[1] });
    } else {
      getSubJob(job_id, sub_job_id, function (fetchedSubJob) {
        if (fetchedSubJob[0] == false) {
          return res.status(400).json({
            success: false,
            message: fetchedSubJob[1],
          });
        } else {
          return res.status(200).json({
            success: true,
            message: fetchedSubJob[1],
            sub_job: fetchedSubJob[2],
          });
        }
      });
    }
  });
});

// @DESCRIPTION: This Route Is Used To Create A Sub Job Truck inside Sub Job Inside A Particular Job By The Dispatcher
// @headers: x_auth_token,@body:aggregate_company_id,required_quantity,@params:job_id,sub_job_id
router.post(
  "/job/:job_id/sub_job/:sub_job_id/sub_job_truck",
  auth,
  (req, res) => {
    let dispatcher_id = req.user.userId;
    let { job_id, sub_job_id } = req.params;
    let { aggregate_company_id, required_quantity } = req.body;
    fetchUserRole(dispatcher_id, aggregate_company_id, function (checkUser) {
      if (checkUser[0] == false) {
        return res.status(400).json({ success: false, message: checkUser[1] });
      } else if (checkUser[1] != "Dispatcher") {
        return res
          .status(400)
          .json({ success: false, message: "User Needs To Be A Dispatcher" });
      } else {
        createSubJobTruck(sub_job_id, required_quantity, function (
          createdSubJobTruck
        ) {
          if (createdSubJobTruck[0] == false) {
            return res
              .status(400)
              .json({ success: false, message: createdSubJobTruck[1] });
          } else {
            created_sub_job_truck_id = createdSubJobTruck[2];
            console.log(created_sub_job_truck_id);
            getSubJobTruck(created_sub_job_truck_id, function (
              fetchedSubJobTruck
            ) {
              if (fetchedSubJobTruck[0] == false) {
                return res
                  .status(400)
                  .json({ success: false, message: fetchedSubJobTruck[1] });
              } else {
                return res.status(200).json({
                  success: true,
                  message: fetchedSubJobTruck[1],
                  sub_job_truck: fetchedSubJobTruck[2],
                });
              }
            });
          }
        });
      }
    });
  }
);

// @DESCRIPTION: This Route Is Used To Fetch All Sub Job Trucks inside Sub Job Inside A Particular Job By The Dispatcher
// @headers: x_auth_token,@body:aggregate_company_id,@params:job_id,sub_job_id
router.get(
  "/job/:job_id/sub_job/:sub_job_id/sub_job_truck",
  auth,
  (req, res) => {
    let aggregate_user_id = req.user.userId;
    let { aggregate_company_id } = req.body;
    let { job_id, sub_job_id } = req.params;
    fetchUserRole(aggregate_user_id, aggregate_company_id, function (
      checkUser
    ) {
      if (checkUser[0] == false) {
        return res.status(400).json({ success: false, message: checkUser[1] });
      } else {
        getSubJobTrucks(sub_job_id, function (fetchedSubJobTrucks) {
          if (fetchedSubJobTrucks[0] == false) {
            return res
              .status(400)
              .json({ success: false, message: fetchedSubJobTrucks[1] });
          } else {
            return res.status(200).json({
              success: true,
              message: fetchedSubJobTrucks[1],
              sub_job_trucks: fetchedSubJobTrucks[2],
            });
          }
        });
      }
    });
  }
);

// @DESCRIPTION: This Route Is Used To Fetch A Particular Sub Job Truck inside Sub Job Inside A Particular Job By The Dispatcher
// @headers: x_auth_token,@body:aggregate_company_id,@params:job_id,sub_job_id,sub_job_truck_id
router.get(
  "/job/:job_id/sub_job/:sub_job_id/sub_job_truck/:sub_job_truck_id",
  auth,
  (req, res) => {
    let aggregate_user_id = req.user.userId;
    let { aggregate_company_id } = req.body;
    let { job_id, sub_job_id, sub_job_truck_id } = req.params;
    fetchUserRole(aggregate_user_id, aggregate_company_id, function (
      checkUser
    ) {
      if (checkUser[0] == false) {
        return res.status(400).json({ success: false, message: checkUser[1] });
      } else {
        getSubJobTruck(sub_job_truck_id, function (fetchedSubJobTruck) {
          if (fetchedSubJobTruck[0] == false) {
            return res
              .status(400)
              .json({ success: false, message: fetchedSubJobTruck[1] });
          } else {
            return res.status(200).json({
              success: true,
              message: fetchedSubJobTruck[1],
              sub_job_truck: fetchedSubJobTruck[2],
            });
          }
        });
      }
    });
  }
);

// @DESCRIPTION: This Route Is Used To Assign driver and truck to a sub_job_truck by the dispatcher
// @headers: x_auth_token,@body:aggregate_company_id,truck_id,driver_id,@params:job_id,sub_job_id,sub_job_truck_id
router.put(
  "/job/:job_id/sub_job/:sub_job_id/sub_job_truck/:sub_job_truck_id/assignfleet",
  auth,
  (req, res) => {
    let dispatcher_id = req.user.userId;
    let { aggregate_company_id, truck_id, driver_id } = req.body;
    let { job_id, sub_job_id, sub_job_truck_id } = req.params;
    fetchUserRole(dispatcher_id, aggregate_company_id, function (checkUser) {
      if (checkUser[0] == false) {
        return res.status(400).json({ success: false, message: checkUser[1] });
      } else if (checkUser[1] != "Dispatcher") {
        return res
          .status(400)
          .json({ success: false, message: "User Needs To Be A Dispatcher" });
      } else {
        assignFleet(sub_job_truck_id, driver_id, truck_id, function (
          assignedSubJobTruck
        ) {
          if (assignedSubJobTruck[0] == false) {
            return res
              .status(400)
              .json({ success: false, message: assignedSubJobTruck[1] });
          } else {
            getSubJobTruck(sub_job_truck_id, function (fetchedSubJobTruck) {
              if (fetchedSubJobTruck[0] == false) {
                return res
                  .status(400)
                  .json({ success: false, message: fetchedSubJobTruck[1] });
              } else {
                return res.status(200).json({
                  success: true,
                  message: "Fleet Assigned",
                  sub_job_truck: fetchedSubJobTruck[2],
                });
              }
            });
          }
        });
      }
    });
  }
);

module.exports = router;
