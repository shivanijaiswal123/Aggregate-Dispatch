var db = require("../dbSetup");

createTables = () => {
  // Create Table truck_types
  create_table_truck_type = `CREATE TABLE IF NOT EXISTS truck_type(
    truck_type_id int NOT NULL AUTO_INCREMENT,
    type varchar(255),
    capacity int ,
    PRIMARY KEY(truck_type_id)
  )`;

  // Create Table aggregate_company
  create_aggregate_company_table = `CREATE TABLE IF NOT EXISTS aggregate_company (
    aggregate_company_id int NOT NULL AUTO_INCREMENT,
    company_name varchar(255) NOT NULL,
    address_line_1 varchar(255) NOT NULL,
    address_line_2 varchar(255) NOT NULL,
    city varchar(255) NOT NULL,
    pincode varchar(255) NOT NULL,
    state varchar(255) NOT NULL,
    PRIMARY KEY (aggregate_company_id)
  )`;

  // Create Table customer
  create_customer_table = `CREATE TABLE IF NOT EXISTS customer (
    customer_id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    phone_no varchar(255) NOT NULL,
    address_line_1 varchar(255) NOT NULL,
    address_line_2 varchar(255) NOT NULL,
    city varchar(255) NOT NULL,
    pincode varchar(255) NOT NULL,
    state varchar(255) NOT NULL,
    PRIMARY KEY(customer_id)
  )`;

  // Create Table aggregate_user
  create_aggregate_user_table = `CREATE TABLE IF NOT EXISTS aggregate_user (
    aggregate_user_id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    phone_no varchar(255) NOT NULL,
    aggregate_company_id int,
    role varchar(255) NOT NULL,
    PRIMARY KEY(aggregate_user_id),
    FOREIGN KEY(aggregate_company_id) REFERENCES aggregate_company(aggregate_company_id)
  )`;

  // Create Table customer_site
  create_customer_site_table = `CREATE TABLE IF NOT EXISTS customer_site (
    customer_site_id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    address_line_1 varchar(255) NOT NULL,
    address_line_2 varchar(255) NOT NULL,
    city varchar(255) NOT NULL,
    pincode varchar(255) NOT NULL,
    state varchar(255) NOT NULL,
    customer_id int,
    PRIMARY KEY(customer_site_id),
    FOREIGN KEY(customer_id) REFERENCES customer(customer_id)
  )`;

  // Create Table truck
  create_truck_table = `CREATE TABLE IF NOT EXISTS truck (
    truck_id int NOT NULL AUTO_INCREMENT,
    vehicle_no varchar(255) NOT NULL,
    number_plate varchar(255) NOT NULL,
    truck_company_id int,
    truck_type_id int,
    PRIMARY KEY(truck_id),
    FOREIGN KEY(truck_company_id) REFERENCES truck_company(truck_company_id),
    FOREIGN KEY(truck_type_id) REFERENCES truck_type(truck_type_id)
  )`;

  // Create Table truck_company
  create_truck_company_table = `CREATE TABLE IF NOT EXISTS truck_company (
    truck_company_id int NOT NULL AUTO_INCREMENT,
    company_name varchar(255) NOT NULL,
    address_line_1 varchar(255) NOT NULL,
    address_line_2 varchar(255) NOT NULL,
    city varchar(255) NOT NULL,
    pincode varchar(255) NOT NULL,
    state varchar(255) NOT NULL,
    PRIMARY KEY (truck_company_id)
  )`;

  // Create Table truck_company_user
  create_truck_company_user_table = `CREATE TABLE IF NOT EXISTS truck_company_user (
    truck_company_user_id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    phone_no varchar(255) NOT NULL,
    truck_company_id int,
    role varchar(255) NOT NULL,
    PRIMARY KEY(truck_company_user_id),
    FOREIGN KEY(truck_company_id) REFERENCES truck_company(truck_company_id)
  )`;

  // Create Table truck_driver
  create_truck_driver_table = `CREATE TABLE IF NOT EXISTS truck_driver (
    truck_driver_id int NOT NULL AUTO_INCREMENT,
    truck_company_id int,
    truck_id int,
    driver_id int,
    status varchar(255) DEFAULT 'AVAILABLE',
    PRIMARY KEY(truck_driver_id),
    FOREIGN KEY(truck_company_id) REFERENCES truck_company(truck_company_id),
    FOREIGN KEY(truck_id) REFERENCES truck(truck_id),
    FOREIGN KEY(driver_id) REFERENCES truck_company_user(truck_company_user_id)
  )`;

  // Create Table quarry
  create_quarry_table = `CREATE TABLE IF NOT EXISTS quarry(
    quarry_id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    aggregate_company_id int,
    site_incharge_id int,
    address_line_1 varchar(255) NOT NULL,
    address_line_2 varchar(255) NOT NULL,
    city varchar(255) NOT NULL,
    pincode varchar(255) NOT NULL,
    state varchar(255) NOT NULL,
    PRIMARY KEY (quarry_id),
    FOREIGN KEY(aggregate_company_id) REFERENCES aggregate_company(aggregate_company_id),
    FOREIGN KEY(site_incharge_id) REFERENCES aggregate_user(aggregate_user_id)
  )`;

  // Job AND Item Tables
  create_item_table = `CREATE TABLE IF NOT EXISTS item(
    item_id int NOT NULL AUTO_INCREMENT,
    item_name varchar(255) NOT NULL,
    item_code varchar(255) NOT NULL,
    PRIMARY KEY(item_id)
  )`;

  // Create Job Table
  create_job_table = `CREATE TABLE IF NOT EXISTS job (
    job_id int NOT NULL AUTO_INCREMENT,
    job_name varchar(255) NOT NULL,
    customer_id int,
    aggregate_company_id int,
    dispatcher_id int,
    customer_site_id int,
    item_id int,
    total_quantity int,
    daily_minimum int,  
    interval_between_delivery time,
    price_criteria varchar(255),
    from_date date,
    to_date date,
    job_status varchar(255),
    additional_notes varchar(255),
    PRIMARY KEY(job_id),
    FOREIGN KEY(customer_id) REFERENCES customer(customer_id),
    FOREIGN KEY(aggregate_company_id) REFERENCES aggregate_company(aggregate_company_id),
    FOREIGN KEY(dispatcher_id) REFERENCES aggregate_user(aggregate_user_id),
    FOREIGN KEY(customer_site_id) REFERENCES customer_site(customer_site_id),
    FOREIGN KEY(item_id) REFERENCES item(item_id)
  )`;

  // Create Sub job Table
  create_sub_job_table = `CREATE TABLE IF NOT EXISTS sub_job(
    sub_job_id int NOT NULL AUTO_INCREMENT,
    job_id int,
    quarry_id int,
    date date,
    sub_job_status varchar(255),
    no_of_trucks int,
    sub_job_quantity int,
    sub_job_created datetime,
    sub_job_completed datetime,
    FOREIGN KEY(job_id) REFERENCES job(job_id),
    FOREIGN KEY(quarry_id) REFERENCES quarry(quarry_id),
    PRIMARY KEY(sub_job_id)
  )`;

  // Create Table shifts
  create_table_shift = `CREATE TABLE IF NOT EXISTS shift(
    shift_id int NOT NULL AUTO_INCREMENT,
    shift_start time,
    shift_end time,
    job_id int,
    PRIMARY KEY(shift_id),
    FOREIGN KEY(job_id) REFERENCES job(job_id)
  )`;

  // Create Table job_trucks
  create_table_sub_job_truck = `CREATE TABLE IF NOT EXISTS sub_job_truck(
    sub_job_truck_id int NOT NULL AUTO_INCREMENT,
    driver_id int,
    truck_id int,
    sub_job_id int,
    required_quantity int,
    PRIMARY KEY(sub_job_truck_id),
    FOREIGN KEY(driver_id) REFERENCES truck_company_user(truck_company_user_id),
    FOREIGN KEY(truck_id) REFERENCES truck(truck_id),
    FOREIGN KEY(sub_job_id) REFERENCES sub_job(sub_job_id)
  )`;

  // Create Table sub_job_truck_execution
  create_table_sub_job_truck_execution = `CREATE TABLE IF NOT EXISTS sub_job_truck_execution(
    sub_job_truck_execution_id int NOT NULL AUTO_INCREMENT,
    sub_job_truck_id int,
    actual_quantity int,
    enroute_loading datetime,
    loaded datetime,
    enroute_unloading datetime,
    completed datetime,
    PRIMARY KEY(sub_job_truck_execution_id),
    FOREIGN KEY(sub_job_truck_id) REFERENCES sub_job_truck(sub_job_truck_id)
  )`;

  db.query(create_table_truck_type, function (err) {
    if (err) throw err;
  });
  db.query(create_aggregate_company_table, function (err) {
    if (err) throw err;
  });
  db.query(create_aggregate_user_table, function (err) {
    if (err) throw err;
  });
  db.query(create_customer_table, function (err) {
    if (err) throw err;
  });
  db.query(create_customer_site_table, function (err) {
    if (err) throw err;
  });

  db.query(create_truck_company_table, function (err) {
    if (err) throw err;
  });
  db.query(create_truck_table, function (err) {
    if (err) throw err;
  });
  db.query(create_truck_company_user_table, function (err) {
    if (err) throw err;
  });
  db.query(create_truck_driver_table, function (err) {
    if (err) throw err;
  });

  db.query(create_quarry_table, function (err) {
    if (err) throw err;
  });

  db.query(create_item_table, function (err) {
    if (err) throw err;
  });
  db.query(create_job_table, function (err) {
    if (err) throw err;
  });
  db.query(create_sub_job_table, function (err) {
    if (err) throw err;
  });
  db.query(create_table_sub_job_truck, function (err) {
    if (err) throw err;
  });

  db.query(create_table_sub_job_truck_execution, function (err) {
    if (err) throw err;
  });

  db.query(create_table_shift, function (err) {
    if (err) throw err;
  });
};

module.exports = createTables;
