var db = require("../dbSetup");
const bcrypt = require("bcryptjs");

var generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

const checkTruckerAdmin = (userId, companyId, callback) => {
  select_admin =
    "SELECT * FROM truck_company_user WHERE truck_company_user_id = ? AND role = ? AND truck_company_id = ?";

  db.query(select_admin, [userId, "Admin", companyId], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results[0]) {
      callback([true, "User Valid"]);
    } else {
      callback([false, "User Not Authenticated To Perfom This Task"]);
    }
  });
};

const fetchUserRole = (id, companyId, callback) => {
  select_role = `SELECT role FROM truck_company_user WHERE truck_company_user_id=? AND truck_company_id=?`;
  db.query(select_role, [id, companyId], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results[0]) {
      callback([true, results[0].role]);
    } else {
      callback([false, "No Such User"]);
    }
  });
};

const getAllMembers = (companyId, callback) => {
  get_members = `SELECT truck_company_user_id,name,email,phone_no,truck_company_id,role FROM truck_company_user WHERE truck_company_id=?`;
  db.query(get_members, [companyId], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results.length > 0) {
      callback([true, "Members Fetched", results]);
    } else {
      callback([false, "No Members"]);
    }
  });
};

const checkTruckByNumberPlateAndCompany = (
  companyId,
  number_plate,
  callback
) => {
  get_truck = `SELECT * FROM truck WHERE truck_company_id=? AND number_plate=?`;
  db.query(get_truck, [companyId, number_plate], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results.length > 0) {
      callback([false, "Truck Already Exists"]);
    } else {
      callback([true, "Truck Can Be Added"]);
    }
  });
};

const addTruck = (
  company_id,
  vehicle_no,
  number_plate,
  truck_type_id,
  callback
) => {
  add_truck = `INSERT INTO truck SET ?`;
  db.query(
    add_truck,
    { truck_company_id: company_id, vehicle_no, number_plate, truck_type_id },
    function (err, results) {
      if (err) {
        callback([false, "Unknown Server Error"]);
      } else {
        callback([true, results.insertId]);
      }
    }
  );
};

const getTruck = (companyId, id, callback) => {
  get_truck = `SELECT * FROM truck WHERE truck_company_id = ? AND truck_id = ?`;
  db.query(get_truck, [companyId, id], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results.length > 0) {
      callback([true, "Truck Fetched", results[0]]);
    } else {
      callback([false, "No Such Truck"]);
    }
  });
};

const getTrucks = (companyId, callback) => {
  get_trucks = `SELECT * FROM truck WHERE truck_company_id=?`;
  db.query(get_trucks, [companyId], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else {
      callback([true, "Trucks Fetched", results]);
    }
  });
};

const getTruckOfDriver = (userId, companyId, callback) => {
  get_truck_of_driver =
    `SELECT * FROM truck WHERE truck_id = (SELECT truck_id FROM truck_driver WHERE driver_id=` +
    userId +
    `)`;
  db.query(get_truck_of_driver, function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results.length > 0) {
      callback([true, "Truck Fetched", results]);
    } else {
      callback([false, "This Driver Does Not Have An Assigned Truck"]);
    }
  });
};

const checkDriverByEmail = (email, callback) => {
  check_driver = `SELECT * FROM truck_company_user WHERE email = ? `;
  db.query(check_driver, [email], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results.length > 0) {
      callback([false, "Driver Already Existent"]);
    } else {
      callback([true, "Driver Can Be Added"]);
    }
  });
};

const addDriver = (company_id, name, email, phone_no, user_role, callback) => {
  add_driver = `INSERT INTO truck_company_user SET ?`;
  let password = generateHash("12345");
  db.query(
    add_driver,
    {
      truck_company_id: company_id,
      name,
      email,
      phone_no,
      role: user_role,
      password,
    },
    function (err, results) {
      if (err) {
        callback([false, "Unknown Server Error"]);
      } else {
        callback([true, "Driver Added", results.insertId]);
      }
    }
  );
};

const getDriver = (company_id, id, callback) => {
  get_driver = `SELECT truck_company_user_id,name,email,phone_no,truck_company_id,role FROM truck_company_user WHERE truck_company_id=? AND truck_company_user_id = ?`;
  db.query(get_driver, [company_id, id], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results.length > 0) {
      callback([true, "Driver Fetched", results[0]]);
    } else {
      callback([false, "Failed To Fetch Driver"]);
    }
  });
};

const checkTruckExistsById = (company_id, truck_id, callback) => {
  check_truck_exists = `SELECT * FROM truck WHERE truck_company_id=? AND truck_id=?`;
  db.query(check_truck_exists, [company_id, truck_id], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results.length > 0) {
      callback([true, "Truck Exists"]);
    } else {
      callback([false, "Truck Does Not Exist"]);
    }
  });
};

const checkDriverExistsById = (company_id, driver_id, callback) => {
  check_driver_exists = `SELECT * FROM truck_company_user WHERE truck_company_id=? AND truck_company_user_id=?`;
  db.query(check_driver_exists, [company_id, driver_id], function (
    err,
    results
  ) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results.length > 0) {
      callback([true, "Driver Exists"]);
    } else {
      callback([false, "Driver Does Not Exist"]);
    }
  });
};

const checkTruckNotAssigned = (truck_id, callback) => {
  check_truck_not_assigned = `SELECT * FROM truck_driver WHERE truck_id=? `;
  db.query(check_truck_not_assigned, [truck_id], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results.length > 0) {
      callback([false, "Truck Already Assigned"]);
    } else {
      callback([true, "Truck Not Assigned"]);
    }
  });
};

const checkDriverNotAssigned = (driver_id, callback) => {
  check_driver_not_assigned = `SELECT * FROM truck_driver WHERE driver_id=? `;
  db.query(check_driver_not_assigned, [driver_id], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results.length > 0) {
      callback([false, "Driver Already Assigned"]);
    } else {
      callback([true, "Driver Not Assigned"]);
    }
  });
};

const assignTruck = (truck_company_id, driver_id, truck_id, callback) => {
  assign_truck = `INSERT INTO truck_driver SET ?`;
  db.query(assign_truck, { truck_company_id, truck_id, driver_id }, function (
    err,
    results
  ) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else {
      callback([true, "Truck Assigned"]);
    }
  });
};

exports.checkTruckerAdmin = checkTruckerAdmin;
exports.fetchUserRole = fetchUserRole;
exports.getAllMembers = getAllMembers;
exports.checkTruckByNumberPlateAndCompany = checkTruckByNumberPlateAndCompany;
exports.addTruck = addTruck;
exports.getTruck = getTruck;
exports.getTrucks = getTrucks;
exports.getTruckOfDriver = getTruckOfDriver;
exports.checkDriverByEmail = checkDriverByEmail;
exports.addDriver = addDriver;
exports.getDriver = getDriver;
exports.checkTruckExistsById = checkTruckExistsById;
exports.checkDriverExistsById = checkDriverExistsById;
exports.checkTruckNotAssigned = checkTruckNotAssigned;
exports.checkDriverNotAssigned = checkDriverNotAssigned;
exports.assignTruck = assignTruck;
