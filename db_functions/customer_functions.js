var db = require("../dbSetup");

// @description: Returns True if the customer exists
// @arguments: customer_id
const checkCustomerExists = (customer_id, callback) => {
  check_customer_exists = `SELECT * FROM customer WHERE customer_id=?`;
  db.query(check_customer_exists, [customer_id], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results.length > 0) {
      callback([true, "Customer Exists"]);
    } else {
      callback([false, "No Such Customer"]);
    }
  });
};

// @description: Returns A List of All Customer Objects
// @arguments:
const getCustomers = (callback) => {
  get_customers = `SELECT * FROM customer`;
  db.query(get_customers, function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else {
      callback([true, "Customers Fetched", results]);
    }
  });
};

// @description: Returns The Customer Object for the given customer_id
// @arguments: customer_id
const getCustomer = (customer_id, callback) => {
  get_customer = `SELECT * FROM customer WHERE customer_id=?`;
  db.query(get_customer, [customer_id], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results.length > 0) {
      callback([true, "Customer Fetched", results[0]]);
    } else {
      callback([false, "No Such Customer"]);
    }
  });
};

exports.checkCustomerExists = checkCustomerExists;
exports.getCustomers = getCustomers;
exports.getCustomer = getCustomer;
