var db = require("../dbSetup");

// @description: Checks if Customer Site exists by name. Returns True If Doesnot exist
// @arguments: name
const checkCustomerSiteExistsByName = (name, callback) => {
  check_customer_site_exists = `SELECT * FROM customer_site WHERE name=?`;
  db.query(check_customer_site_exists, [name], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results.length > 0) {
      callback([false, "Customer Site Exists"]);
    } else {
      callback([true, "Customer Site Does Not Exist"]);
    }
  });
};

// @description: Checks if Customer Site exists by customer_site_id. Returns True If Exists
// @arguments: customer_site_id
const checkCustomerSiteExistsById = (customer_site_id, callback) => {
  check_customer_site_exists = `SELECT * FROM customer_site WHERE customer_site_id=?`;
  db.query(check_customer_site_exists, [customer_site_id], function (
    err,
    results
  ) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results.length > 0) {
      callback([true, "Customer Site Exists"]);
    } else {
      callback([false, "Customer Site Does Not Exist"]);
    }
  });
};

// @description: Add Customer Site
// @arguments: name,address_line_1,address_line_2,city,state,pincode,customer_id
const addCustomerSiteByCustomer = (
  name,
  address_line_1,
  address_line_2,
  city,
  state,
  pincode,
  customer_id,
  callback
) => {
  add_customer_site = `INSERT INTO customer_site SET ?`;
  db.query(
    add_customer_site,
    { name, address_line_1, address_line_2, city, state, pincode, customer_id },
    function (err, results) {
      if (err) {
        callback([false, "Unknown Server Error"]);
      } else {
        callback([true, "Customer Site Added", results.insertId]);
      }
    }
  );
};

// @description: Get All Customer Sites .
const getCustomerSites = (callback) => {
  get_sites = `SELECT * FROM customer_site`;
  db.query(get_sites, function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else {
      callback([true, "Customer Sites Fetched", results]);
    }
  });
};

// @description: Get Particular Customer Site .
// @arguments: site_id
const getCustomerSite = (site_id, callback) => {
  get_site = `SELECT * FROM customer_site WHERE customer_site_id = ?`;
  db.query(get_site, [site_id], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results.length > 0) {
      callback([true, "Customer Sites Fetched", results[0]]);
    } else {
      callback([false, "No Such Customer Site"]);
    }
  });
};

// @description: Get All Customer Sites of Customer.
// @arguments: customer_id
const getCustomerSitesByCustomerId = (customer_id, callback) => {
  get_customer_sites = `SELECT * FROM customer_site WHERE customer_id=?`;
  db.query(get_customer_sites, [customer_id], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results.length > 0) {
      callback([true, "Customer Sites Fetched", results]);
    } else {
      callback([false, "No Customer Sites"]);
    }
  });
};

// @description: Get Particular Customer Site of Customer.
// @arguments: customer_id,site_id
const getCustomerSiteByCustomerId = (customer_id, site_id, callback) => {
  get_customer_site = `SELECT * FROM customer_site WHERE customer_site_id =? AND customer_id=?`;
  db.query(get_customer_site, [site_id, customer_id], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results.length > 0) {
      callback([true, "Customer Site Fetched", results[0]]);
    } else {
      callback([false, "No Such Customer Site"]);
    }
  });
};

exports.checkCustomerSiteExistsByName = checkCustomerSiteExistsByName;
exports.checkCustomerSiteExistsById = checkCustomerSiteExistsById;
exports.addCustomerSiteByCustomer = addCustomerSiteByCustomer;
exports.getCustomerSites = getCustomerSites;
exports.getCustomerSite = getCustomerSite;
exports.getCustomerSitesByCustomerId = getCustomerSitesByCustomerId;
exports.getCustomerSiteByCustomerId = getCustomerSiteByCustomerId;
