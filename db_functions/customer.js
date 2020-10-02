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

const selectCustomer = (quarry_id, callback) => {
  select_quarry = `SELECT * FROM customer WHERE customer_id=?`;
  db.query(select_quarry, [quarry_id], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results[0]) {
      callback([true, "Quarry Fetched", results[0]]);
    } else {
      callback([false, "Unable To Fetch Quarry"]);
    }
  });
};

// exports.addCustomer = addCustomer;
// exports.selectCustomer = selectCustomer;
module.exports = { addCustomer, selectCustomer };
