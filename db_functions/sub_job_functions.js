var db = require("../dbSetup");

// @description: Create A Sub Job For A Particular Job By dispatcher
// @arguments:  job_id,quarry_id,date,no_of_trucks,sub_job_quantity,
const createSubJob = (
  job_id,
  quarry_id,
  date,
  no_of_trucks,
  sub_job_quantity,
  callback
) => {
  create_sub_job = `INSERT INTO sub_job SET ?`;
  db.query(
    create_sub_job,
    {
      job_id,
      quarry_id,
      date,
      no_of_trucks,
      sub_job_quantity,
      sub_job_status: "CREATED",
      sub_job_created: new Date().toISOString().slice(0, 19).replace("T", " "),
    },
    function (err, results) {
      if (err) {
        callback([false, "Unknown Server Error"]);
      } else {
        callback([true, "Sub Job Created", results.insertId]);
      }
    }
  );
};

// @description: Get All Sub Jobs For A Particular Job By dispatcher
// @arguments:  job_id
const getSubJobs = (job_id, callback) => {
  get_sub_jobs = `
  SELECT 
  sub_job.sub_job_id,sub_job.date as sub_job_date,sub_job.sub_job_status,sub_job.no_of_trucks,sub_job.sub_job_quantity,sub_job.sub_job_created,sub_job.sub_job_completed,
  quarry.name as quarry_name,quarry.address_line_1,quarry.address_line_2,quarry.city,quarry.pincode,quarry.state,
  aggregate_user.name as quarry_manager_name,aggregate_user.email as quarry_manager_email,aggregate_user.phone_no as quarry_manager_phone_no
  FROM sub_job
  INNER JOIN quarry ON sub_job.quarry_id = quarry.quarry_id
  INNER JOIN aggregate_user ON quarry.site_incharge_id = aggregate_user.aggregate_user_id
  WHERE sub_job.job_id = ?
  `;
  db.query(get_sub_jobs, [job_id], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else {
      callback([true, "Sub Jobs Fetched", results]);
    }
  });
};

// @description: Get A Sub Jobs For A Particular Job By dispatcher
// @arguments:  job_id,sub_job_id
const getSubJob = (job_id, sub_job_id, callback) => {
  get_sub_job = `
  SELECT 
  sub_job.sub_job_id,sub_job.date as sub_job_date,sub_job.sub_job_status,sub_job.no_of_trucks,sub_job.sub_job_quantity,sub_job.sub_job_created,sub_job.sub_job_completed,
  quarry.name as quarry_name,quarry.address_line_1,quarry.address_line_2,quarry.city,quarry.pincode,quarry.state,
  aggregate_user.name as quarry_manager_name,aggregate_user.email as quarry_manager_email,aggregate_user.phone_no as quarry_manager_phone_no
  FROM sub_job
  INNER JOIN quarry ON sub_job.quarry_id = quarry.quarry_id
  INNER JOIN aggregate_user ON quarry.site_incharge_id = aggregate_user.aggregate_user_id
  WHERE sub_job.job_id = ? AND sub_job.sub_job_id = ?
  `;
  db.query(get_sub_job, [job_id, sub_job_id], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results.length > 0) {
      callback([true, "Sub Job Fetched", results[0]]);
    } else {
      callback([false, "No Such Sub Job"]);
    }
  });
};

exports.createSubJob = createSubJob;
exports.getSubJobs = getSubJobs;
exports.getSubJob = getSubJob;
