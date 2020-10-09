const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const auth = require("../middleware/auth");
const config = require("config");
const { checkCustomerExists } = require("../db_functions/customer_functions");
const {
  checkCustomerSiteExistsByName,
  checkCustomerSiteExistsById,
  addCustomerSiteByCustomer,
  getCustomerSiteByCustomerId,
  getCustomerSitesByCustomerId,
} = require("../db_functions/customer_site");

const {
  checkAggregateCompanyExists,
  getAggregateCompanies,
  getAggregateCompany,
} = require("../db_functions/aggregate_company_functions");

const {
  createJob,
  getJobForCustomerByJobId,
  getJobsOfCustomerByCustomerId,
} = require("../db_functions/job_functions");

const {
  checkItemExistsById,
  getItems,
  getItem,
  addItem,
  selectItem,
} = require("../db_functions/item");
const { getShiftsByJobId } = require("../db_functions/shift_functions");

router.get("/signupfailure", (req, res) => {
  res.status(400).json({ success: false, message: req.flash("message")[0] });
});

router.get("/signinfailure", (req, res) => {
  res.status(400).json({ success: false, message: req.flash("message")[0] });
});

router.post(
  "/signup",
  passport.authenticate("customer-signup", {
    failureRedirect: "/api/customer/signupfailure",
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
  passport.authenticate("customer-signin", {
    failureRedirect: "/api/customer/signinfailure",
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

// @DESCRIPTION: This Route Is Used To Add An Customer Site By The Customer
// @headers: x_auth_token, @body: name,address_line_1,address_line_2,city,pincode,state,
router.post("/customersite", auth, (req, res) => {
  let userId = req.user.userId;
  checkCustomerExists(userId, function (customerExistence) {
    if (customerExistence[0] == false) {
      return res
        .status(400)
        .json({ success: false, message: customerExistence[1] });
    } else {
      let {
        name,
        address_line_1,
        address_line_2,
        city,
        pincode,
        state,
      } = req.body;
      checkCustomerSiteExistsByName(name, function (customerSiteExistence) {
        if (customerSiteExistence[0] == false) {
          return res
            .status(400)
            .json({ success: false, message: customerSiteExistence[1] });
        } else {
          addCustomerSiteByCustomer(
            name,
            address_line_1,
            address_line_2,
            city,
            state,
            pincode,
            userId,
            function (addedSite) {
              if (addedSite[0] == false) {
                return res
                  .status(400)
                  .json({ success: false, message: addedSite[1] });
              } else {
                getCustomerSiteByCustomerId(userId, addedSite[2], function (
                  fetchedSite
                ) {
                  if (fetchedSite[0] == false) {
                    return res
                      .status(400)
                      .json({ success: false, message: fetchedSite[1] });
                  } else {
                    return res.status(200).json({
                      success: true,
                      message: fetchedSite[1],
                      customer_site: fetchedSite[2],
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

// @DESCRIPTION: This Route Is Used To Get All Customer Sites By The Customer
// @headers: x_auth_token
router.get("/customersite", auth, (req, res) => {
  let userId = req.user.userId;
  checkCustomerExists(userId, function (customerExistence) {
    if (customerExistence[0] == false) {
      return res
        .status(400)
        .json({ success: false, message: customerExistence[1] });
    } else {
      getCustomerSitesByCustomerId(userId, function (fetchedSites) {
        if (fetchedSites[0] == false) {
          return res
            .status(400)
            .json({ success: false, message: fetchedSites[1] });
        } else {
          return res.status(200).json({
            success: true,
            message: fetchedSites[1],
            customer_site: fetchedSites[2],
          });
        }
      });
    }
  });
});

// @DESCRIPTION: This Route Is Used To Get Customer Site By The Customer
// @headers: x_auth_token,@params:customer_site_id
router.get("/customersite/:customer_site_id", auth, (req, res) => {
  let userId = req.user.userId;
  let customer_site_id = req.params.customer_site_id;
  checkCustomerExists(userId, function (customerExistence) {
    if (customerExistence[0] == false) {
      return res
        .status(400)
        .json({ success: false, message: customerExistence[1] });
    } else {
      getCustomerSiteByCustomerId(userId, customer_site_id, function (
        customerSite
      ) {
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
      });
    }
  });
});

// @DESCRIPTION: This Route Is Used To Get All Items By The Customer
// @headers: x_auth_token
router.get("/item", auth, (req, res) => {
  let userId = req.user.userId;
  checkCustomerExists(userId, function (customerExistence) {
    if (customerExistence[0] == false) {
      return res
        .status(400)
        .json({ success: false, message: customerExistence[1] });
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

router.post("/addItem", auth, (req, res) => {
  // var id = req.body.id;
  var item_name = req.body.item_name;
  var item_code = req.body.item_code;
  var quantity = req.body.quantity;

  addItem(item_name, item_code, quantity, function (itemInserted) {
    console.log(itemInserted);
    if (itemInserted[0] == false) {
      return res.status(400).json({ success: false, message: itemInserted[1] });
    } else {
      selectItem(itemInserted[1], function (fetchedItem) {
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

// @DESCRIPTION: This Route Is Used To Get A Particular Item By The Customer
// @headers: x_auth_token,@params: item_id
router.get("/item/:item_id", auth, (req, res) => {
  let userId = req.user.userId;
  let item_id = req.params.item_id;
  checkCustomerExists(userId, function (customerExistence) {
    if (customerExistence[0] == false) {
      return res
        .status(400)
        .json({ success: false, message: customerExistence[1] });
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

// @DESCRIPTION: This Route Is Used To Get All Aggregate Companies By The Customer
// @headers: x_auth_token
router.get("/aggregatecompany", auth, (req, res) => {
  let userId = req.user.userId;
  checkCustomerExists(userId, function (customerExistence) {
    if (customerExistence[0] == false) {
      return res
        .status(400)
        .json({ success: false, message: customerExistence[1] });
    } else {
      getAggregateCompanies(function (fetchedCompanies) {
        if (fetchedCompanies[0] == false) {
          return res
            .status(400)
            .json({ success: false, message: fetchedCompanies[1] });
        } else {
          return res.status(200).json({
            success: true,
            message: fetchedCompanies[1],
            aggregate_companies: fetchedCompanies[2],
          });
        }
      });
    }
  });
});

// @DESCRIPTION: This Route Is Used To Get A Particular Aggregate Company By The Customer
// @headers: x_auth_token, @params: aggregate_company_id
router.get("/aggregatecompany/:aggregate_company_id", auth, (req, res) => {
  let userId = req.user.userId;
  let aggregate_company_id = req.params.aggregate_company_id;
  checkCustomerExists(userId, function (customerExistence) {
    if (customerExistence[0] == false) {
      return res
        .status(400)
        .json({ success: false, message: customerExistence[1] });
    } else {
      getAggregateCompany(aggregate_company_id, function (aggregateCompany) {
        if (aggregateCompany[0] == false) {
          return res
            .status(400)
            .json({ success: false, message: aggregateCompany[1] });
        } else {
          return res.status(200).json({
            success: true,
            message: aggregateCompany[1],
            aggregate_company: aggregateCompany[2],
          });
        }
      });
    }
  });
});

// @DESCRIPTION: This Route Is Used To Create Job By The Customer
// @headers: x_auth_token,
// @body:job_name,aggregate_company_id,customer_site_id,item_id,total_quantity,
// @body daily_minimum,interval_between_delivery,price_criteria,from_date,to_date,shifts,no_of_trucks,additional_notes,
router.post("/job", auth, (req, res) => {
  let customerId = req.user.userId;
  let {
    job_name,
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
  checkAggregateCompanyExists(aggregate_company_id, function (
    aggregateCompanyExistence
  ) {
    console.log(aggregateCompanyExistence);
    if (aggregateCompanyExistence[0] == false) {
      return res
        .status(400)
        .json({ success: false, message: aggregateCompanyExistence[1] });
    } else {
      checkCustomerSiteExistsById(customer_site_id, function (
        customerSiteExistence
      ) {
        console.log(customerSiteExistence);
        if (customerSiteExistence[0] == false) {
          return res
            .status(400)
            .json({ success: false, message: customerSiteExistence[1] });
        } else {
          checkItemExistsById(item_id, function (itemExistence) {
            console.log(item);
            if (itemExistence[0] == false) {
              return res
                .status(400)
                .json({ success: false, message: itemExistence[1] });
            } else {
              createJob(
                job_name,
                customerId,
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
                    return res
                      .status(400)
                      .json({ success: false, message: createdJob[1] });
                  } else {
                    getJobForCustomerByJobId(createdJob[2], function (
                      fetchedJob
                    ) {
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
                    });
                  }
                }
              );
            }
          });
        }
      });
    }
  });
});

// @DESCRIPTION: This Route Is Used To Fetch All Jobs Of A Customer
// @headers: x_auth_token
router.get("/job", auth, (req, res) => {
  let customerId = req.user.userId;
  checkCustomerExists(customerId, function (customerExistence) {
    if (customerExistence[0] == false) {
      return res
        .status(400)
        .json({ success: false, message: customerExistence[1] });
    } else {
      getJobsOfCustomerByCustomerId(customerId, function (fetchedJobs) {
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

// @DESCRIPTION: This Route Is Used To Fetch A Particular Job Of A Customer
// @headers: x_auth_token, @params:job_id
router.get("/job/:job_id", auth, (req, res) => {
  let customerId = req.user.userId;
  let job_id = req.params.job_id;
  checkCustomerExists(customerId, function (customerExistence) {
    if (customerExistence[0] == false) {
      return res
        .status(400)
        .json({ success: false, message: customerExistence[1] });
    } else {
      getJobForCustomerByJobId(job_id, function (fetchedJob) {
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

// @DESCRIPTION: This Route Is Used To Fetch All Shifts Of A Job Of A Customer
// @headers: x_auth_token,@params:job_id
router.get("/job/:job_id/shift", auth, (req, res) => {
  let customerId = req.user.userId;
  let job_id = req.params.job_id;
  checkCustomerExists(customerId, function (customerExistence) {
    if (customerExistence[0] == false) {
      return res
        .status(400)
        .json({ success: false, message: customerExistence[1] });
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

module.exports = router;
