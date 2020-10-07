var db = require("../dbSetup");

const checkCustomerById = (customer_id, callback) => {
  //   console.log(user_id);
  query = `SELECT * FROM customer WHERE customer_id =? `;
  db.query(query, [customer_id], function (err, results) {
    // console.log("-------------");
    // console.log(results);
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results[0]) {
      callback([true, "customer Exists"]);
    } else {
      callback([false, "Customer Doesn't Exist"]);
    }
  });
};

const assignCustomer = (data, customer_id, callback) => {
  //   console.log(data);
  //   console.log(data.name);

  query = `UPDATE customer SET ? WHERE customer_id =?`;
  db.query(query, [data, customer_id], function (err, results) {
    //   console.log("!!!!!!!!!!!!!!!!!");
    //   console.log(user_id);
    //   console.log(data);
    //   console.log(results);
    if (err) {
      callback(err);
    } else {
      callback([true, customer_id]);
    }
  });
};

const selectCustomer = (customer_id, callback) => {
  query = `SELECT * FROM customer WHERE customer_id=?`;
  db.query(query, [customer_id], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results[0]) {
      callback([true, "customer Fetched", results[0]]);
    } else {
      callback([false, "Unable To Fetch customer"]);
    }
  });
};

exports.checkCustomerById = checkCustomerById;
exports.assignCustomer = assignCustomer;
exports.selectCustomer = selectCustomer;
