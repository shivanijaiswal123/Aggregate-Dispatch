const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
var db = require("../dbSetup");

module.exports = function (passport) {
  var LocalStrategy = require("passport-local").Strategy;

  // SignUp Strategy for Aggregate User
  passport.use(
    "aggregate-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },

      function (req, email1, password, done) {
        console.log(email1);
        console.log(password);
        console.log("inside of function");

        var generateHash = function (password) {
          console.log("inside of generateHash");
          return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
        };

        console.log("11");

        search_email_query = `SELECT email FROM aggregate_user WHERE ?`;
        console.log("22");
        // Check if email already exists
        db.query(search_email_query, { email: email1 }, function (err, result) {
          console.log("Inside the api");
          if (err) return done(err);

          // If email already exists
          if (result[0]) {
            console.log("33");
            return done(
              null,
              false,
              req.flash("message", "Email Already Taken.")
            );

            // If email doesn't exists
          } else {
            console.log("55");
            var userPassword = generateHash(password);

            var {
              company_name,
              address_line_1,
              address_line_2,
              city,
              pincode,
              state,
              user_role,
              phone_no,
            } = req.body;

            console.log(req.body);
            console.log(company_name);

            var name = req.body.user_name;
            var email = email1;
            var hashedpassword = userPassword;
            console.log(req.body.user_name);

            add_company = "INSERT INTO aggregate_company SET ?";
            add_user = "INSERT INTO aggregate_user SET ?";

            // Add aggregate_company
            db.query(
              add_company,
              {
                company_name: company_name,
                address_line_1,
                address_line_2,
                city,
                pincode,
                state,
              },
              function (err, companyResults) {
                if (err) {
                  return done(
                    null,
                    false,
                    req.flash("message", "Error Creating Company")
                  );
                }
                var company_id = companyResults.insertId;
                // Add aggregate_user
                db.query(
                  add_user,
                  {
                    name: name,
                    email: email,
                    password: hashedpassword,
                    phone_no: phone_no,
                    role: user_role,
                    aggregate_company_id: company_id,
                  },
                  function (err, userResults) {
                    if (err) {
                      console.log(err);
                      return done(
                        null,
                        false,
                        req.flash("message", "Error Creating User")
                      );
                    }
                    let jwtKey = config.get("jwtSecret");
                    jwt.sign(
                      { userId: userResults.insertId },
                      jwtKey,
                      (err, token) => {
                        if (err) {
                          return done(
                            null,
                            false,
                            req.flash("message", "Unknown Server Error")
                          );
                        } else {
                          added_user = `SELECT * FROM aggregate_user WHERE ?`;
                          db.query(
                            added_user,
                            { aggregate_user_id: userResults.insertId },
                            function (err, rows) {
                              if (err) {
                                return done(
                                  null,
                                  false,
                                  req.flash("message", "Unknown Server Error")
                                );
                              } else {
                                return done(
                                  null,
                                  rows[0],
                                  (req.user = rows[0]),
                                  (req.token = token)
                                );
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                );
              }
            );
          }
        });
      }
    )
  );

  // Login/SignIn Strategy for Aggregate User
  passport.use(
    "aggregate-signin",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      function (req, email1, password, done) {
        search_email_query = `SELECT * FROM aggregate_user WHERE ?`;
        db.query(search_email_query, { email: email1 }, function (err, result) {
          if (err) return done(err);
          if (!result[0]) {
            return done(
              null,
              false,
              req.flash("message", "Email Doesn't Exist.")
            );
          } else {
            bcrypt
              .compare(password, result[0].password)
              .then((passwordResult) => {
                if (passwordResult == true) {
                  let jwtKey = config.get("jwtSecret");
                  jwt.sign(
                    { userId: result[0].aggregate_user_id },
                    jwtKey,
                    (err, token) => {
                      if (err) {
                        return done(err);
                      } else {
                        console.log(result[0]);
                        console.log(token);
                        return done(
                          null,
                          result[0],
                          (req.user = result[0]),
                          (req.token = token)
                        );
                      }
                    }
                  );
                } else {
                  return done(
                    err,
                    false,
                    req.flash("message", "Password Incorrect")
                  );
                }
              });
          }
        });
      }
    )
  );

  // SignUp Strategy for Dispatcher
  passport.use(
    "dispatcher-signup",

    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },

      function (req, email1, password, done) {
        var generateHash = function (password) {
          return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
        };
        search_email_query = `SELECT email FROM dispatcher WHERE ?`;
        // Check if email already exists
        db.query(search_email_query, { email: email1 }, function (err, result) {
          if (err) return done(err);
          // If email already exists
          if (result[0]) {
            return done(
              null,
              false,
              req.flash("message", "Email Already Taken.")
            );

            // If email doesn't exists
          } else {
            var userPassword = generateHash(password);

            var name = req.body.name;
            var email = email1;
            var hashedpassword = userPassword;
            var phone_no = req.body.phone_no;

            add_dispatcher = "INSERT INTO dispatcher SET ?";

            // Add dispatcher
            db.query(
              add_dispatcher,
              {
                name,
                email,
                password: hashedpassword,
                phone_no,
              },
              function (err, dispatcherResults) {
                if (err) {
                  return done(
                    null,
                    false,
                    req.flash("message", "Error Creating Dispatcher")
                  );
                }
                let jwtKey = config.get("jwtSecret");
                jwt.sign(
                  { userId: dispatcherResults.insertId },
                  jwtKey,
                  (err, token) => {
                    if (err) {
                      return done(
                        null,
                        false,
                        req.flash("message", "Unknown Server Error")
                      );
                    } else {
                      added_dispatcher = `SELECT * FROM dispatcher WHERE ?`;
                      db.query(
                        added_dispatcher,
                        { id: dispatcherResults.insertId },
                        function (err, rows) {
                          if (err) {
                            return done(
                              null,
                              false,
                              req.flash("message", "Unknown Server Error")
                            );
                          } else {
                            return done(
                              null,
                              rows[0],
                              (req.user = rows[0]),
                              (req.token = token)
                            );
                          }
                        }
                      );
                    }
                  }
                );
              }
            );
          }
        });
      }
    )
  );

  // Login/SignIn Strategy for Dispatcher
  passport.use(
    "dispatcher-signin",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      function (req, email1, password, done) {
        search_email_query = `SELECT * FROM dispatcher WHERE ?`;
        db.query(search_email_query, { email: email1 }, function (err, result) {
          if (err) return done(err);
          if (!result[0]) {
            return done(
              null,
              false,
              req.flash("message", "Email Doesn't Exist.")
            );
          } else {
            bcrypt
              .compare(password, result[0].password)
              .then((passwordResult) => {
                if (passwordResult == true) {
                  let jwtKey = config.get("jwtSecret");
                  jwt.sign({ userId: result[0].id }, jwtKey, (err, token) => {
                    if (err) {
                      return done(err);
                    } else {
                      return done(
                        null,
                        result[0],
                        (req.user = result[0]),
                        (req.token = token)
                      );
                    }
                  });
                } else {
                  return done(
                    err,
                    false,
                    req.flash("message", "Password Incorrect")
                  );
                }
              });
          }
        });
      }
    )
  );

  // SignUp Strategy for Customer
  passport.use(
    "customer-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },

      function (req, email1, password, done) {
        var generateHash = function (password) {
          return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
        };
        search_email_query = `SELECT email FROM customer WHERE ?`;
        // Check if email already exists
        db.query(search_email_query, { email: email1 }, function (err, result) {
          if (err) return done(err);
          // If email already exists
          if (result[0]) {
            return done(
              null,
              false,
              req.flash("message", "Email Already Taken.")
            );

            // If email doesn't exists
          } else {
            var userPassword = generateHash(password);

            var name = req.body.name;
            var email = email1;
            var hashedpassword = userPassword;
            var {
              address_line_1,
              address_line_2,
              city,
              pincode,
              state,
              phone_no,
            } = req.body;

            add_customer = "INSERT INTO customer SET ?";

            // Add customer
            db.query(
              add_customer,
              {
                name,
                email,
                password: hashedpassword,
                phone_no,
                address_line_1,
                address_line_2,
                city,
                pincode,
                state,
              },
              function (err, customerResults) {
                if (err) {
                  return done(
                    null,
                    false,
                    req.flash("message", "Error Creating Customer")
                  );
                }
                let jwtKey = config.get("jwtSecret");
                jwt.sign(
                  { userId: customerResults.insertId },
                  jwtKey,
                  (err, token) => {
                    if (err) {
                      return done(
                        null,
                        false,
                        req.flash("message", "Unknown Server Error")
                      );
                    } else {
                      add_customer = `SELECT * FROM customer WHERE ?`;
                      db.query(
                        add_customer,
                        { customer_id: customerResults.insertId },
                        function (err, rows) {
                          if (err) {
                            return done(
                              null,
                              false,
                              req.flash("message", "Unknown Server Error")
                            );
                          } else {
                            return done(
                              null,
                              rows[0],
                              (req.user = rows[0]),
                              (req.token = token)
                            );
                          }
                        }
                      );
                    }
                  }
                );
              }
            );
          }
        });
      }
    )
  );

  // Login/SignIn Strategy for Customer
  passport.use(
    "customer-signin",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      function (req, email1, password, done) {
        search_email_query = `SELECT * FROM customer WHERE ?`;
        db.query(search_email_query, { email: email1 }, function (err, result) {
          if (err) return done(err);

          if (!result[0]) {
            return done(
              null,
              false,
              req.flash("message", "Email Doesn't Exist.")
            );
          } else {
            bcrypt
              .compare(password, result[0].password)
              .then((passwordResult) => {
                if (passwordResult == true) {
                  let jwtKey = config.get("jwtSecret");
                  jwt.sign(
                    { userId: result[0].customer_id },
                    jwtKey,
                    (err, token) => {
                      if (err) {
                        return done(err);
                      } else {
                        return done(
                          null,
                          result[0],
                          (req.user = result[0]),
                          (req.token = token)
                        );
                      }
                    }
                  );
                } else {
                  return done(
                    err,
                    false,
                    req.flash("message", "Password Incorrect")
                  );
                }
              });
          }
        });
      }
    )
  );

  // SignUp Strategy for Customer
  passport.use(
    "trucker-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },

      function (req, email1, password, done) {
        var generateHash = function (password) {
          return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
        };
        search_email_query = `SELECT email FROM truck_company_user WHERE ?`;
        // Check if email already exists
        db.query(search_email_query, { email: email1 }, function (err, result) {
          if (err) return done(err);
          // If email already exists
          if (result[0]) {
            return done(
              null,
              false,
              req.flash("message", "Email Already Taken.")
            );

            // If email doesn't exists
          } else {
            var userPassword = generateHash(password);
            var {
              company_name,
              address_line_1,
              address_line_2,
              pincode,
              state,
              city,
            } = req.body;

            var name = req.body.user_name;
            var email = email1;
            var hashedpassword = userPassword;
            var user_role = req.body.user_role;
            var phone_no = req.body.phone_no;

            add_company = "INSERT INTO truck_company SET ?";
            add_user = "INSERT INTO truck_company_user SET ?";

            // Add aggregate_company
            db.query(
              add_company,
              {
                company_name: company_name,
                address_line_1,
                address_line_2,
                city,
                pincode,
                state,
              },
              function (err, companyResults) {
                if (err) {
                  return done(
                    null,
                    false,
                    req.flash("message", "Error Creating Company")
                  );
                }
                var truck_company_id = companyResults.insertId;
                // Add aggregate_user
                db.query(
                  add_user,
                  {
                    name: name,
                    email: email,
                    password: hashedpassword,
                    phone_no: phone_no,
                    role: user_role,
                    truck_company_id,
                  },
                  function (err, userResults) {
                    if (err) {
                      console.log(err);
                      return done(
                        null,
                        false,
                        req.flash("message", "Error Creating User")
                      );
                    }
                    let jwtKey = config.get("jwtSecret");
                    jwt.sign(
                      { userId: userResults.insertId },
                      jwtKey,
                      (err, token) => {
                        if (err) {
                          return done(
                            null,
                            false,
                            req.flash("message", "Unknown Server Error")
                          );
                        } else {
                          added_user = `SELECT * FROM truck_company_user WHERE ?`;
                          db.query(
                            added_user,
                            { truck_company_user_id: userResults.insertId },
                            function (err, rows) {
                              if (err) {
                                return done(
                                  null,
                                  false,
                                  req.flash("message", "Unknown Server Error")
                                );
                              } else {
                                return done(
                                  null,
                                  rows[0],
                                  (req.user = rows[0]),
                                  (req.token = token)
                                );
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                );
              }
            );
          }
        });
      }
    )
  );

  // Login/SignIn Strategy for Customer
  passport.use(
    "trucker-signin",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      function (req, email1, password, done) {
        search_email_query = `SELECT * FROM truck_company_user WHERE ?`;
        db.query(search_email_query, { email: email1 }, function (err, result) {
          if (err) return done(err);
          if (!result[0]) {
            return done(
              null,
              false,
              req.flash("message", "Email Doesn't Exist.")
            );
          } else {
            bcrypt
              .compare(password, result[0].password)
              .then((passwordResult) => {
                if (passwordResult == true) {
                  let jwtKey = config.get("jwtSecret");
                  jwt.sign(
                    { userId: result[0].truck_company_user_id },
                    jwtKey,
                    (err, token) => {
                      if (err) {
                        return done(err);
                      } else {
                        return done(
                          null,
                          result[0],
                          (req.user = result[0]),
                          (req.token = token)
                        );
                      }
                    }
                  );
                } else {
                  return done(
                    err,
                    false,
                    req.flash("message", "Password Incorrect")
                  );
                }
              });
          }
        });
      }
    )
  );

  //serialize
  // used to serialize the user for the session
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    done(null);
  });
};
