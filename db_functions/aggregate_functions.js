var db = require("../dbSetup");

// @description: Returns True if aggregate company user exists for given userId and aggregate company id
// @arguments:userId,aggregate_company_id
const checkAggregateUserExists = (
  aggregate_user_id,
  aggregate_company_id,
  callback
) => {
  check_aggregate_user_exists = `SELECT aggregate_user_id,name,email,phone_no,aggregate_company_id,role FROM aggregate_user WHERE aggregate_user_id=? AND aggregate_company_id=?`;
  db.query(
    check_aggregate_user_exists,
    [aggregate_user_id, aggregate_company_id],
    function (err, results) {
      if (err) {
        callback([false, "Unknown Server Error"]);
      } else if (results.length > 0) {
        callback([true, "User Exists"]);
      } else {
        callback([false, "No Such User"]);
      }
    }
  );
};

// @description: Returns True if aggregate company user is Admin for given userId and aggregate company id
// @arguments:aggregate_user_id,aggregate_company_id
const checkAggregateAdmin = (
  aggregate_user_id,
  aggregate_company_id,
  callback
) => {
  select_admin =
    "SELECT * FROM aggregate_user WHERE aggregate_user_id = ? AND role = ? AND aggregate_company_id = ?";

  db.query(
    select_admin,
    [aggregate_user_id, "Admin", aggregate_company_id],
    function (err, results) {
      if (err) {
        callback([false, "Unknown Server Error"]);
      } else if (results[0]) {
        callback([true, "User Valid"]);
      } else {
        callback([false, "User Not Authenticated To Perfom This Task"]);
      }
    }
  );
};

// @description: Returns the user's role for given userId and aggregate company id
// @arguments:aggregate_user_id,aggregate_company_id
const fetchUserRole = (aggregate_user_id, aggregate_company_id, callback) => {
  select_role = `SELECT role FROM aggregate_user WHERE aggregate_user_id=? AND aggregate_company_id=?`;
  db.query(select_role, [aggregate_user_id, aggregate_company_id], function (
    err,
    results
  ) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results[0]) {
      callback([true, results[0].role]);
    } else {
      callback([false, "No Such User"]);
    }
  });
};

// @description: Returns a list of all aggregate_user objects for the given aggregate_company_id
// @arguments:aggregate_company_id
const getAllMembers = (aggregate_company_id, callback) => {
  get_members = `SELECT aggregate_user_id,name,email,phone_no,aggregate_company_id,role FROM aggregate_user WHERE aggregate_company_id=?`;
  db.query(get_members, [aggregate_company_id], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results.length > 0) {
      callback([true, "Members Fetched", results]);
    } else {
      callback([false, "No Members"]);
    }
  });
};

exports.checkAggregateUserExists = checkAggregateUserExists;
exports.checkAggregateAdmin = checkAggregateAdmin;
exports.fetchUserRole = fetchUserRole;
exports.getAllMembers = getAllMembers;
