var db = require("../dbSetup");
const { addShifts } = require("./shift_functions");

// @description: Create Job by Customer/Sales Manager
// @arguments: job_name,customer_id,aggregate_company_id,customer_site_id,item_id,total_quantity,daily_minimum,interval_between_delivery,price_criteria,from_date,to_date,shifts,additional_notes,
const createJob = (
  job_name,
  customer_id,
  aggregate_company_id,
  customer_site_id,
  item_id,
  price_id,
  color_id,
  total_quantity,
  daily_minimum,
  interval_between_delivery,
  price_criteria,
  from_date,
  to_date,
  shifts,
  additional_notes,
  callback
) => {
  create_job = `INSERT INTO job SET ?`;
  db.query(
    create_job,
    {
      job_name,
      customer_id,
      aggregate_company_id,
      customer_site_id,
      item_id,
      price_id,
      color_id,
      total_quantity,
      daily_minimum,
      interval_between_delivery,
      price_criteria,
      from_date,
      to_date,
      job_status: "PENDING_APPROVAL",
      additional_notes,
    },
    function (err, results) {
      if (err) {
        console.log(err);
        callback([false, "Unknown Server Error"]);
      } else {
        console.log(results);
        inserted_job_id = results.insertId;
        console.log(inserted_job_id);
        console.log(shifts);
        addShifts(inserted_job_id, shifts, function (addedShifts) {
          console.log(addedShifts);
          if (addedShifts[0] == false) {
            callback([false, "Job Created But Shifts Failed"]);
          } else {
            callback([true, "Job Created", inserted_job_id]);
          }
        });
      }
    }
  );
};

// @description: Get Job For Customer by job_id
// @arguments: job_id
const getJobForCustomerByJobId = (job_id, callback) => {
  get_job_for_customer = `
  SELECT 
  job.job_id,job.job_name,job.job_status,job.total_quantity,job.daily_minimum,job.interval_between_delivery,job.price_criteria,job.from_date,job.to_date,job.additional_notes,
	aggregate_company.company_name as aggregate_company_name,
  aggregate_user.name as dispatcher_name,aggregate_user.email as dispatcher_email,aggregate_user.phone_no as dispatcher_phone_no,
  customer_site.name as customer_site_name, customer_site.address_line_1 as customer_site_address_line_1,customer_site.address_line_2 as customer_site_address_line_2,customer_site.city as customer_site_city,customer_site.state as customer_site_state,customer_site.pincode as customer_site_pincode,
  item.item_name as item_name, item.item_code as item_code    
  FROM job
  LEFT JOIN aggregate_company ON job.aggregate_company_id = aggregate_company.aggregate_company_id
  LEFT JOIN aggregate_user ON job.dispatcher_id = aggregate_user.aggregate_user_id
  LEFT JOIN customer_site ON job.customer_site_id = customer_site.customer_site_id
  LEFT JOIN item ON job.item_id = item.item_id
  WHERE job.job_id = ?
  `;
  db.query(get_job_for_customer, [job_id], function (err, results) {
    if (err) {
      console.log(err);
      callback([false, "Unknown Server Error"]);
    } else if (results.length > 0) {
      callback([true, "Job Fetched", results[0]]);
    } else {
      callback([false, "No Such Job"]);
    }
  });
};

// @description: Get All Jobs of Customer
// @arguments: customerId
const getJobsOfCustomerByCustomerId = (customerId, callback) => {
  get_job_of_customer_by_customer_id = `
  SELECT 
  job.job_id,job.job_name,job.job_status,job.total_quantity,job.daily_minimum,job.interval_between_delivery,job.price_criteria,job.from_date,job.to_date,job.additional_notes,
	aggregate_company.company_name as aggregate_company_name,
  aggregate_user.name as dispatcher_name,aggregate_user.email as dispatcher_email,aggregate_user.phone_no as dispatcher_phone_no,
  customer_site.name as customer_site_name, customer_site.address_line_1 as customer_site_address_line_1,customer_site.address_line_2 as customer_site_address_line_2,customer_site.city as customer_site_city,customer_site.state as customer_site_state,customer_site.pincode as customer_site_pincode,
  item.item_name as item_name, item.item_code as item_code    
  FROM job
  LEFT JOIN aggregate_company ON job.aggregate_company_id = aggregate_company.aggregate_company_id
  LEFT JOIN aggregate_user ON job.dispatcher_id = aggregate_user.aggregate_user_id
  LEFT JOIN customer_site ON job.customer_site_id = customer_site.customer_site_id
  LEFT JOIN item ON job.item_id = item.item_id
  WHERE job.customer_id = ?
  `;
  db.query(get_job_of_customer_by_customer_id, [customerId], function (
    err,
    results
  ) {
    if (err) {
      console.log(err);
      callback([false, "Unknown Server Error"]);
    } else {
      callback([true, "Job Fetched", results]);
    }
  });
};

// @description: Get Job For Aggregate User by job_id
// @arguments: job_id
const getJobForAggregateUserByJobId = (job_id, callback) => {
  get_job_for_aggregate_user = `
  SELECT 
  job.job_id,job.job_name,job.job_status,job.total_quantity,job.daily_minimum,job.interval_between_delivery,job.price_criteria,job.from_date,job.to_date,job.additional_notes,
	aggregate_company.company_name as aggregate_company_name,
  aggregate_user.name as dispatcher_name,aggregate_user.email as dispatcher_email,aggregate_user.phone_no as dispatcher_phone_no,
  customer_site.name as customer_site_name, customer_site.address_line_1 as customer_site_address_line_1,customer_site.address_line_2 as customer_site_address_line_2,customer_site.city as customer_site_city,customer_site.state as customer_site_state,customer_site.pincode as customer_site_pincode,
  item.item_name as item_name, item.item_code as item_code    
  FROM job
  LEFT JOIN aggregate_company ON job.aggregate_company_id = aggregate_company.aggregate_company_id
  LEFT JOIN aggregate_user ON job.dispatcher_id = aggregate_user.aggregate_user_id
  LEFT JOIN customer_site ON job.customer_site_id = customer_site.customer_site_id
  LEFT JOIN item ON job.item_id = item.item_id
  WHERE job.job_id = ?
  `;
  db.query(get_job_for_aggregate_user, [job_id], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results.length > 0) {
      callback([true, "Job Fetched", results[0]]);
    } else {
      callback([false, "No Such Job"]);
    }
  });
};

// @description: Get All Jobs of Aggregate Company
// @arguments: aggregate_company_id
const getJobsOfAggregateCompanyById = (aggregate_company_id, callback) => {
  get_job_of_aggregate_company_by_id = `
  SELECT 
  job.job_id,job.job_name,job.job_status,job.total_quantity,job.daily_minimum,job.interval_between_delivery,job.price_criteria,job.from_date,job.to_date,job.additional_notes,
	aggregate_company.company_name as aggregate_company_name,
  aggregate_user.name as dispatcher_name,aggregate_user.email as dispatcher_email,aggregate_user.phone_no as dispatcher_phone_no,
  customer_site.name as customer_site_name, customer_site.address_line_1 as customer_site_address_line_1,customer_site.address_line_2 as customer_site_address_line_2,customer_site.city as customer_site_city,customer_site.state as customer_site_state,customer_site.pincode as customer_site_pincode,
  item.item_name as item_name, item.item_code as item_code  
  FROM job
  LEFT JOIN aggregate_company ON job.aggregate_company_id = aggregate_company.aggregate_company_id
  LEFT JOIN aggregate_user ON job.dispatcher_id = aggregate_user.aggregate_user_id
  LEFT JOIN customer_site ON job.customer_site_id = customer_site.customer_site_id
  LEFT JOIN item ON job.item_id = item.item_id
  WHERE job.aggregate_company_id = ?
  `;
  db.query(
    get_job_of_aggregate_company_by_id,
    [aggregate_company_id],
    function (err, results) {
      if (err) {
        callback([false, "Unknown Server Error"]);
      } else {
        callback([true, "Job Fetched", results]);
      }
    }
  );
};

// @description: Get Job Status of Particular Job
// @arguments: job_id
const getJobStatus = (job_id, callback) => {
  get_job_status = "SELECT job_id,job_status FROM job WHERE job_id=?";
  db.query(get_job_status, [job_id], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results.length > 0) {
      callback([true, "Job Status Fetched", results[0].job_status]);
    } else {
      callback([false, "No Such Job"]);
    }
  });
};

// @description: Approve Job By Dispatcher
// @arguments: job_id,dispatcher_id
const approveJobByDispatcher = (job_id, dispatcher_id, callback) => {
  approve_job_by_dispatcher = `UPDATE job SET dispatcher_id = ?, job_status = ? WHERE job_id=?`;
  db.query(
    approve_job_by_dispatcher,
    [dispatcher_id, "APPROVED", job_id],
    function (err, results) {
      if (err) {
        callback([false, "Unknown Server Error"]);
      } else {
        callback([true, job_id]);
      }
    }
  );
};

exports.createJob = createJob;
exports.getJobForCustomerByJobId = getJobForCustomerByJobId;
exports.getJobsOfCustomerByCustomerId = getJobsOfCustomerByCustomerId;
exports.getJobForAggregateUserByJobId = getJobForAggregateUserByJobId;
exports.getJobsOfAggregateCompanyById = getJobsOfAggregateCompanyById;
exports.getJobStatus = getJobStatus;
exports.approveJobByDispatcher = approveJobByDispatcher;
