var db = require("../dbSetup");

const checkUserById = (user_id, callback) => {
  //   console.log(user_id);
  query = `SELECT * FROM user WHERE id =? `;
  db.query(query, [user_id], function (err, results) {
    // console.log("-------------");
    // console.log(results);
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results[0]) {
      callback([true, "User Exists"]);
    } else {
      callback([false, "User Doesn't Exist"]);
    }
  });
};

const assignUser = (data, user_id, callback) => {
  //   console.log(data);
  console.log(data.name);

  query = `UPDATE user SET name=?,email=?,password=?,phone_no=?,role=?,add_user=?,view_user=?,edit_user=? WHERE id =?`;
  db.query(
    query,
    [
      data.name,
      data.email,
      data.password,
      data.phone_no,
      data.role,
      data.add_user,
      data.view_user,
      data.edit_user,
      user_id,
    ],
    function (err, results) {
      //   console.log("!!!!!!!!!!!!!!!!!");
      //   console.log(user_id);
      //   console.log(data);
      //   console.log(results);
      if (err) {
        callback(err);
      } else {
        callback([true, user_id]);
      }
    }
  );
};

const selectUser = (user_id, callback) => {
  query = `SELECT * FROM user WHERE id=?`;
  db.query(query, [user_id], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results[0]) {
      callback([true, "User Fetched", results[0]]);
    } else {
      callback([false, "Unable To Fetch User"]);
    }
  });
};

exports.checkUserById = checkUserById;
exports.assignUser = assignUser;
exports.selectUser = selectUser;
