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
  get_items = `SELECT * FROM items`;
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

const addItem = (item_name, item_code, quantity, callback) => {
  add_item = `INSERT INTO items SET ?`;
  db.query(
    add_item,
    {
      item_name,
      item_code,
      quantity,
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

const selectItem = (item_id, callback) => {
  console.log("----");
  select_item = `SELECT * FROM items WHERE item_id=?`;
  db.query(select_item, [item_id], function (err, results) {
    if (err) {
      callback([false, "Unknown Server Error"]);
    } else if (results[0]) {
      callback([true, "items Fetched", results[0]]);
    } else {
      callback([false, "Unable To Fetch items"]);
    }
  });
};

exports.checkItemExistsById = checkItemExistsById;
exports.getItems = getItems;
exports.getItem = getItem;
exports.selectItem = selectItem;
exports.addItem = addItem;
