var db = require("../dbSetup");

const addPermission = (role_name, edit_user, view_user, add_user, callback) => {
  add_permission = `INSERT INTO user_role SET ?`;
  db.query(
    add_permission,
    {
      role_name,
      edit_user,
      view_user,
      add_user,
    },
    function (err, results) {
      if (err) {
        console.log("------------------------------");
        console.log(err);
        callback([false, "Unknown Server Error"]);
      } else {
        callback([true, results.insertId]);
      }
    }
  );
};

const selectPermission = (id, callback) => {
  console.log("----");
  select_permission = `SELECT * FROM user_role WHERE id=?`;
  db.query(select_permission, [id], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results[0]) {
      callback([true, "permission Fetched", results[0]]);
    } else {
      callback([false, "Unable To Fetch permision"]);
    }
  });
};

const getPermissions = (callback) => {
  permissions = `SELECT * FROM user_role`;
  db.query(permissions, function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else {
      callback([true, "permissions  Fetched", results]);
    }
  });
};

module.exports = { addPermission, selectPermission, getPermissions };
