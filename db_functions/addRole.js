var db = require("../dbSetup");

const checkRoleById = (role_id, callback) => {
  //   console.log(user_id);
  query = `SELECT * FROM user_role WHERE id =? `;
  db.query(query, [role_id], function (err, results) {
    // console.log("-------------");
    // console.log(results);
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results[0]) {
      callback([true, "Role Exists"]);
    } else {
      callback([false, "Role Doesn't Exist"]);
    }
  });
};

const assignRole = (data, role_id, callback) => {
  //   console.log(data);
  console.log(data.name);

  query = `UPDATE user_role SET ? WHERE id =?`;
  db.query(query, [data, role_id], function (err, results) {
    //   console.log("!!!!!!!!!!!!!!!!!");
    //   console.log(user_id);
    //   console.log(data);
    //   console.log(results);
    if (err) {
      callback(err);
    } else {
      callback([true, role_id]);
    }
  });
};

const selectRole = (role_id, callback) => {
  query = `SELECT * FROM user_role WHERE id=?`;
  db.query(query, [role_id], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results[0]) {
      callback([true, "Role Fetched", results[0]]);
    } else {
      callback([false, "Unable To Fetch Role"]);
    }
  });
};

exports.checkRoleById = checkRoleById;
exports.assignRole = assignRole;
exports.selectRole = selectRole;
