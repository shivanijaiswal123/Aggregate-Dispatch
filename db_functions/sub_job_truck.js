var db = require("../dbSetup");

// @description:Create A Sub Job Truck For A Particular Sub Job By dispatcher
// @arguments:  sub_job_id,required_quantity
const createSubJobTruck = (sub_job_id, required_quantity, callback) => {
  create_sub_job_truck = `INSERT INTO sub_job_truck SET ?`;
  db.query(create_sub_job_truck, { sub_job_id, required_quantity }, function (
    err,
    results
  ) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else {
      callback([true, "Sub Job Truck Created", results.insertId]);
    }
  });
};

// @description:Get All Sub Job Trucks For A Particular Sub Job By dispatcher
// @arguments:  sub_job_id
const getSubJobTrucks = (sub_job_id, callback) => {
  get_sub_job_trucks = `
  SELECT 
  sub_job_truck.sub_job_truck_id,sub_job_truck.required_quantity as sub_job_truck_required_quantity,sub_job_truck.driver_id as sub_job_truck_driver_id,sub_job_truck.truck_id as sub_job_truck_truck_id,sub_job_truck.sub_job_id,
  truck_company_user.name as driver_name,truck_company_user.email as driver_email,truck_company_user.phone_no as driver_phone_no,
  truck.vehicle_no as truck_vehicle_no,truck.number_plate as truck_number_plate,truck.truck_type_id,
  truck_type.type as truck_type,truck_type.capacity as truck_capacity
  FROM sub_job_truck
  LEFT JOIN truck_company_user ON sub_job_truck.driver_id = truck_company_user.truck_company_user_id
  LEFT JOIN truck ON sub_job_truck.truck_id = truck.truck_id
  LEFT JOIN truck_type ON truck.truck_type_id = truck_type.truck_type_id
  WHERE sub_job_truck.sub_job_id = ?
  `;
  db.query(get_sub_job_trucks, [sub_job_id], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else {
      callback([true, "Sub Job Trucks Fetched", results]);
    }
  });
};

// @description:Get A Sub Job Truck For A Particular Sub Job By dispatcher
// @arguments:  sub_job_truck_id
const getSubJobTruck = (sub_job_truck_id, callback) => {
  get_sub_job_truck = `
  SELECT 
  sub_job_truck.sub_job_truck_id,sub_job_truck.required_quantity as sub_job_truck_required_quantity,sub_job_truck.driver_id as sub_job_truck_driver_id,sub_job_truck.truck_id as sub_job_truck_truck_id,sub_job_truck.sub_job_id,
  truck_company_user.name as driver_name,truck_company_user.email as driver_email,truck_company_user.phone_no as driver_phone_no,
  truck.vehicle_no as truck_vehicle_no,truck.number_plate as truck_number_plate,truck.truck_type_id,
  truck_type.type as truck_type,truck_type.capacity as truck_capacity
  FROM sub_job_truck
  LEFT JOIN truck_company_user ON sub_job_truck.driver_id = truck_company_user.truck_company_user_id
  LEFT JOIN truck ON sub_job_truck.truck_id = truck.truck_id
  LEFT JOIN truck_type ON truck.truck_type_id = truck_type.truck_type_id
  WHERE sub_job_truck.sub_job_truck_id = ?
  `;
  db.query(get_sub_job_truck, [sub_job_truck_id], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results.length > 0) {
      callback([true, "Sub Job Truck Fetched", results[0]]);
    } else {
      callback([false, "No Such Sub Job Truck"]);
    }
  });
};

// @description:Assign Driver and Truck to Sub Job Truck For A Particular Sub Job By dispatcher
// @arguments:  sub_job_truck_id,driver_id,truck_id
const assignFleet = (sub_job_truck_id, driver_id, truck_id, callback) => {
  assign_fleet = `UPDATE sub_job_truck SET driver_id=?, truck_id=? WHERE sub_job_truck_id=?`;
  db.query(assign_fleet, [driver_id, truck_id, sub_job_truck_id], function (
    err,
    results
  ) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else {
      console.log();
      callback([true, "Fleet Assigned"]);
    }
  });
};

exports.createSubJobTruck = createSubJobTruck;
exports.getSubJobTrucks = getSubJobTrucks;
exports.getSubJobTruck = getSubJobTruck;
exports.assignFleet = assignFleet;
