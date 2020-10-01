router.post("/customer", (req, res) => {
  // let userId = req.user.userId;
  let userId = req.user.userId;
  let company_id1 = req.body.aggregate_company_id;

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
      } else {
        var generateHash = function (password) {
          return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
        };
        var name = req.body.name;
        var email = req.body.email;
        var address_line_1 = req.body.address_line_1;
        var address_line_2 = req.body.address_line_2;
        var password = generateHash("12345");
        var city = req.body.city;
        var pincode = req.body.pincode;
        var state = req.body.state;

        add_customer = "INSERT INTO customer SET ?";

        db.query(
          add_customer,
          {
            customer_id:3,
            name,
            email,
            address_line_1,
            address_line_2,
            password,
            city,
            pincode,
            state,
          },
          function (err) {
            if (err) {
                return res
                  .status(400)
                  .json({ success: false, message: "Unknown Server Error" });
              } else {
                let jwtKey = config.get("jwtSecret");

                jwt.sign( { customerId: 3 },
                     jwtKey,
                     (err, token) => {
                    if (err) {
                    } else {
                      added_customer = `SELECT * FROM customer WHERE ?`;
                      db.query(
                        added_customer,
                        {customer_id:3},
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
                  })
              }
          }
        );

  
        
      }

  });
});

        // var generateHash = function (password) {
        //   return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
        // };
        // var name = req.body.name;
        // var email = req.body.email;
        // var address_line_1 = req.body.address_line_1;
        // var address_line_2 = req.body.address_line_2;
        // var password = generateHash("12345");
        // var city = req.body.city;
        // var pincode = req.body.pincode;
        // var state = req.body.state;

        // add_customer = "INSERT INTO customer SET ?";
        // // Add aggregate_customer
        // db.query(
        //   add_customer,
        //   {
        //     name,
        //     email,
        //     address_line_1,
        //     address_line_2,
        //     password,
        //     city,
        //     pincode,
        //     state,
        //   },
        //   function (err, userResults) {
        //     console.log(userResults);
        //   }
        // );

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

router.post("/customer", auth, (req, res) => {
  let userId = req.user.userId;
  let {
    name,
    email,
    address_line_1,
    address_line_2,
    city,
    pincode,
    state,
  } = req.body;
});

var generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};
var name = req.body.name;
var email = req.body.email;
var address_line_1 = req.body.address_line_1;
var address_line_2 = req.body.address_line_2;
var password = generateHash("12345");
var city = req.body.city;
var pincode = req.body.pincode;
var state = req.body.state;

add_customer = "INSERT INTO customer SET ?";

db.query(add_customer,{
    name,
    email,
    address_line_1,
    address_line_2,
    password,
    city,
    pincode,
    state,
  } ,)

if(err){

}
else {
    var generateHash = function (password) {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
    };
    var name = req.body.name;
    var email = req.body.email;
    var address_line_1 = req.body.address_line_1;
    var address_line_2 = req.body.address_line_2;
    var password = generateHash("12345");
    var city = req.body.city;
    var pincode = req.body.pincode;
    var state = req.body.state;

    add_customer = "INSERT INTO customer SET ?";
    // Add aggregate_customer
    db.query(
    add_customer,
    {
        name,
        email,
        address_line_1,
        address_line_2,
        password,
        city,
        pincode,
        state,
      },
      function (err, userResults) {}
        console.log("---------------------------------------------------------")
        console.log(userResults)
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
