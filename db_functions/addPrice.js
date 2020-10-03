var db = require("../dbSetup");

const addPrice = (color, size, price, callback) => {
  add_price = `INSERT INTO price SET ?`;
  db.query(
    add_price,
    {
      color,
      size,
      price,
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

const selectPrice = (id, callback) => {
  console.log("----");
  select_price = `SELECT * FROM price WHERE id=?`;
  db.query(select_price, [id], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results[0]) {
      callback([true, "color Fetched", results[0]]);
    } else {
      callback([false, "Unable To Fetch color"]);
    }
  });
};

const getPrices = (callback) => {
  get_prices = `SELECT * FROM price`;
  db.query(get_prices, function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else {
      callback([true, "Prices Fetched", results]);
    }
  });
};

module.exports = { addPrice, selectPrice, getPrices };
