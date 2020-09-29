var db = require("../dbSetup");

// @description: Check Item Exists by item_id.Returns True If Exists
// @arguments: item_id
const checkItemExistsById = (item_id, callback) => {
  check_item_exists = `SELECT * FROM item WHERE item_id=?`;
  db.query(check_item_exists, [item_id], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results.length > 0) {
      callback([true, "Item Exists"]);
    } else {
      callback([false, "Item Does Not Exist"]);
    }
  });
};

// @description: Get All Items
// @arguments:
const getItems = (callback) => {
  get_items = `SELECT * FROM item`;
  db.query(get_items, function (err, results) {
    if (err) {
      callback([false, "Unknown Servre Error"]);
    } else {
      callback([true, "Items Fetched", results]);
    }
  });
};

// @description: Get Particular Item
// @arguments: item_id
const getItem = (item_id, callback) => {
  get_item = `SELECT * FROM item WHERE item_id = ?`;
  db.query(get_item, [item_id], function (err, results) {
    if (err) {
      callback([false, "Unknown Servre Error"]);
    } else if (results.length > 0) {
      callback([true, "Item Fetched", results[0]]);
    } else {
      callback([false, "No such Item"]);
    }
  });
};

exports.checkItemExistsById = checkItemExistsById;
exports.getItems = getItems;
exports.getItem = getItem;
