var db = require("../dbSetup");

const addColor = (color_name, image, callback) => {
  add_color = `INSERT INTO color SET ?`;
  db.query(
    add_color,
    {
      color_name,
      image,
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

const selectColor = (color_id, callback) => {
  console.log("----");
  select_color = `SELECT * FROM color WHERE color_id=?`;
  db.query(select_color, [color_id], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results[0]) {
      callback([true, "color Fetched", results[0]]);
    } else {
      callback([false, "Unable To Fetch color"]);
    }
  });
};

const getColors = (callback) => {
  get_colors = `SELECT * FROM color`;
  db.query(get_colors, function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else {
      callback([true, "Colors Fetched", results]);
    }
  });
};

module.exports = { addColor, selectColor, getColors };
