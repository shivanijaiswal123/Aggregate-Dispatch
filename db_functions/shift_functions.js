var db = require("../dbSetup");

// @description: Add Shifts to A particular job
// @arguments: job_id,shifts
const addShifts = (job_id, shifts, callback) => {
  create_shift = `INSERT INTO shift SET ?`;
  // console.log(shiftItem.shift_start);
  // console.log(shiftItem.shift_end);

  db.query(
    create_shift,
    {
      shift_start: shifts[0],
      shift_end: shifts[1],
      job_id,
    },
    function (err, results) {
      if (err) {
        callback([false, "Unknown Server Error"]);
      } else {
        callback([true, "Shifts Added"]);
      }
    }
  );
};

// @description: Get Shifts for A particular job
// @arguments: job_id
const getShiftsByJobId = (job_id, callback) => {
  get_shifts_by_job_id = `SELECT * FROM shift WHERE job_id=?`;
  db.query(get_shifts_by_job_id, [job_id], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results.length > 0) {
      callback([true, "Shifts Fetched", results]);
    } else {
      callback([false, "No Shifts For This Job"]);
    }
  });
};

exports.addShifts = addShifts;
exports.getShiftsByJobId = getShiftsByJobId;
