var db = require("../dbSetup");

// @description: Get A Particular Truck And Driver Pair
// @arguments: truck_driver_id
const getTrucksAndDriversById = (truck_driver_id, callback) => {
  get_trucks_and_drivers = `SELECT * FROM truck_driver WHERE truck_driver_id=?`;
  db.query(get_trucks_and_drivers, [truck_driver_id], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results.length > 0) {
      callback([true, results[0]]);
    } else {
      callback([false, "No Such Truck And Driver"]);
    }
  });
};

// @description: Get All Available Truck And Driver Pairs for A truck_company
// @arguments: truck_company_id
const getAvailablTrucksAndDrivers = (truck_company_id, callback) => {
  get_available_trucks_and_drivers = `
  SELECT 
  truck_driver.truck_driver_id as truck_driver_id,truck_driver.status,
  truck.vehicle_no,truck.number_plate,
  truck_type.type as truck_type,truck_type.capacity as truck_capacity,
  truck_company_user.name as driver_name,truck_company_user.email as driver_email,truck_company_user.phone_no as driver_phone_no 
  FROM truck_driver 
  INNER JOIN truck_company_user ON truck_driver.driver_id = truck_company_user.truck_company_user_id 
  INNER JOIN truck ON truck_driver.truck_id = truck.truck_id 
  INNER JOIN truck_type ON truck.truck_type_id = truck_type.truck_type_id 
  WHERE truck_driver.truck_company_id = ? AND status = ?`;
  db.query(
    get_available_trucks_and_drivers,
    [truck_company_id, "AVAILABLE"],
    function (err, results) {
      if (err) {
        callback([false, "Unknown Server Error"]);
      } else if (results.length > 0) {
        callback([true, "Trucks And Drivers Fetched", results]);
      } else {
        callback([false, "No Available Trucks And Drivers"]);
      }
    }
  );
};

exports.getAvailablTrucksAndDrivers = getAvailablTrucksAndDrivers;
exports.getTrucksAndDriversById = getTrucksAndDriversById;
