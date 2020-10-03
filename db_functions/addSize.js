var db = require("../dbSetup");

const addSize = (size, description, callback) => {
  add_size = `INSERT INTO size SET ?`;
  db.query(
    add_size,
    {
      size,
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

const selectSize = (id, callback) => {
  console.log("----");
  select_size = `SELECT * FROM size WHERE id=?`;
  db.query(select_size, [id], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results[0]) {
      callback([true, "color Fetched", results[0]]);
    } else {
      callback([false, "Unable To Fetch color"]);
    }
  });
};

module.exports = { addSize, selectSize };
