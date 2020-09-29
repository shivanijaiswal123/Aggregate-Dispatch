var db = require("../dbSetup");

// @description: Returns True if Quarry of the given name and aggregate_company_id does not exist.
// @description: This is used to check to prevent multiple quarries with same name
// @arguments:quarryName,companyId
const checkQuarryExists = (quarry_name, aggregate_company_id, callback) => {
  select_quarry = `SELECT * FROM quarry WHERE name=? AND aggregate_company_id=?`;

  db.query(select_quarry, [quarry_name, aggregate_company_id], function (
    err,
    results
  ) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results[0]) {
      callback([false, "Quarry Already Existent"]);
    } else {
      callback([true, ""]);
    }
  });
};

// @description: Returns True if quarry with the given quarry_id and aggregate_company_id exists
// @arguments:quarry_id,aggregate_company_id
const checkQuarryByIdAndCompany = (
  quarry_id,
  aggregate_company_id,
  callback
) => {
  select_quarry = `SELECT * FROM quarry WHERE quarry_id =? AND aggregate_company_id = ?`;
  db.query(select_quarry, [quarry_id, aggregate_company_id], function (
    err,
    results
  ) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results[0]) {
      callback([true, "Quarry Exists"]);
    } else {
      callback([false, "Quarry Doesn't Exist"]);
    }
  });
};

// @description: Adds the quarry to the db
// @arguments:name,aggregate_company_id, address_line_1, address_line_2,city,state,pincode
const addQuarry = (
  name,
  aggregate_company_id,
  address_line_1,
  address_line_2,
  city,
  pincode,
  state,
  callback
) => {
  add_quarry = `INSERT INTO quarry SET ?`;
  db.query(
    add_quarry,
    {
      name,
      aggregate_company_id,
      address_line_1,
      address_line_2,
      city,
      pincode,
      state,
    },
    function (err, results) {
      if (err) {
        callback([false, "Unknown Server Error"]);
      } else {
        callback([true, results.insertId]);
      }
    }
  );
};

// @description: Returns a quarry object for given quarry_id and aggregate_company_id
// @arguments:quarry_id,aggregate_company_id
const selectQuarry = (quarry_id, aggregate_company_id, callback) => {
  select_quarry = `SELECT * FROM quarry WHERE quarry_id=? AND aggregate_company_id=?`;
  db.query(select_quarry, [quarry_id, aggregate_company_id], function (
    err,
    results
  ) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results[0]) {
      callback([true, "Quarry Fetched", results[0]]);
    } else {
      callback([false, "Unable To Fetch Quarry"]);
    }
  });
};

//@description: Assign a Quarry Manager to the quarry of given quarry_id
// @arguments:quarry_id,manager_id
const assignQuarryManager = (quarry_id, manager_id, callback) => {
  assign_manager = `UPDATE quarry SET site_incharge_id =? WHERE quarry_id=?`;
  db.query(assign_manager, [manager_id, quarry_id], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else {
      callback([true, quarry_id]);
    }
  });
};

//@description: Returns a list of all quarry objects for the given aggregate_company_id
// @arguments:aggregate_company_id
const fetchAllQuarries = (aggregate_company_id, callback) => {
  fetch_quarries = `SELECT * FROM quarry WHERE aggregate_company_id=? `;
  db.query(fetch_quarries, [aggregate_company_id], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results.length > 0) {
      callback([true, results]);
    } else {
      callback([false, "No Quarries"]);
    }
  });
};

// @description: Returns a list of all quarry objects for the given Quarry Manager of the given aggregate_company_id
// @arguments:aggregate_company_id,aggregate_user_id
const fetchManagerQuarries = (
  aggregate_user_id,
  aggregate_company_id,
  callback
) => {
  fetch_manager_quarry = `SELECT * FROM quarry WHERE site_incharge_id = ? AND aggregate_company_id = ?`;
  db.query(
    fetch_manager_quarry,
    [aggregate_user_id, aggregate_company_id],
    function (err, results) {
      if (err) {
        callback([false, "Unkown Server Error"]);
      } else if (results.length > 0) {
        callback([true, results]);
      } else {
        callback([false, "No Quarries"]);
      }
    }
  );
};

exports.checkQuarryExists = checkQuarryExists;
exports.addQuarry = addQuarry;
exports.selectQuarry = selectQuarry;
exports.checkQuarryByIdAndCompany = checkQuarryByIdAndCompany;
exports.assignQuarryManager = assignQuarryManager;
exports.fetchAllQuarries = fetchAllQuarries;
exports.fetchManagerQuarries = fetchManagerQuarries;
