var db = require("../dbSetup");

// @description: Checks if aggregate company exists. Returns True/False
// @arguments: aggregate_company_id
const checkAggregateCompanyExists = (aggregate_company_id, callback) => {
  check_aggregate_company_exists = `SELECT * FROM aggregate_company WHERE aggregate_company_id = ?`;
  db.query(check_aggregate_company_exists, [aggregate_company_id], function (
    err,
    results
  ) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results.length > 0) {
      callback([true, "Aggregate Company Exists"]);
    } else {
      callback([false, "Aggregate Company Does Not Exist"]);
    }
  });
};

// @description: Returns a List of aggregate companies.
// @arguments:
const getAggregateCompanies = (callback) => {
  get_aggregate_companies = `SELECT * FROM aggregate_company`;

  db.query(get_aggregate_companies, function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else {
      callback([true, "Aggregate Companies Fetched", results]);
    }
  });
};

// @description: Returns a particular aggregate company object for the given aggregate_company_id
// @arguments: aggregate_company_id
const getAggregateCompany = (aggregate_company_id, callback) => {
  get_aggregate_company = `SELECT * FROM aggregate_company WHERE aggregate_company_id=?`;

  db.query(get_aggregate_company, [aggregate_company_id], function (
    err,
    results
  ) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results.length > 0) {
      callback([true, "Aggregate Company Fetched", results[0]]);
    } else {
      callback([false, "No Such Aggregate Company"]);
    }
  });
};

exports.checkAggregateCompanyExists = checkAggregateCompanyExists;
exports.getAggregateCompanies = getAggregateCompanies;
exports.getAggregateCompany = getAggregateCompany;
