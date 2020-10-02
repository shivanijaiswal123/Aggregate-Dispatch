var db = require("../dbSetup");

const addCustomer = (
  name,
  email,
  password,
  phone_no,
  address_line_1,
  address_line_2,
  city,
  pincode,
  state,
  callback
) => {
  add_customer = `INSERT INTO customer SET ?`;
  db.query(
    add_customer,
    {
      name,
      email,
      password,
      phone_no,
      address_line_1,
      address_line_2,
      city,
      pincode,
      state,
    },
    function (err, results) {
      if (err) {
        console.log(err);
        callback([false, "Unknown Server Error"]);
      } else {
        callback([true, results.insertId]);
      }
    }
  );
};

const selectCustomer = (customer_id, callback) => {
  select_customer = `SELECT * FROM customer WHERE customer_id=?`;
  db.query(select_customer, [customer_id], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results[0]) {
      callback([true, "customer Fetched", results[0]]);
    } else {
      callback([false, "Unable To Fetch customer"]);
    }
  });
};

module.exports = { addCustomer, selectCustomer };
