var db = require("../dbSetup");

const addComplain = (complain_type, description, callback) => {
  add_complain = `INSERT INTO customer_complain SET ?`;
  db.query(
    add_complain,
    {
      complain_type,
      description,
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

const selectComplain = (complain_id, callback) => {
  console.log("----");
  select_complain = `SELECT * FROM customer_complain WHERE complain_id=?`;
  db.query(select_complain, [complain_id], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results[0]) {
      callback([true, "complain Fetched", results[0]]);
    } else {
      callback([false, "Unable To Fetch color"]);
    }
  });
};

const getComplain = (callback) => {
  get_complains = `SELECT * FROM customer_complain`;
  db.query(get_complains, function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else {
      callback([true, "complains Fetched", results]);
    }
  });
};

module.exports = { addComplain, selectComplain, getComplain };
