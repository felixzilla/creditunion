
CREATE DATABASE IF NOT EXISTS creditunion;

CREATE TABLE IF NOT EXISTS account(
accountid varchar(16) not null primary key,
password varchar(30) not null,
firstname varchar(30) not null,
lastname varchar(30) not null,
address1 varchar(30) not null,
address2 varchar(30),
phone varchar(50),
email varchar(30),
nkfullname varchar(30) not null,
nkaddress varchar(30) not null,
nkphone varchar(30),
accounttype varchar(30) not null,
accountinitialdeposite float,
accountbalance float,
createdat timestamp,
lastaccessed timestamp
);

CREATE TABLE IF NOT EXISTS login(
id int auto_increment primary key,
username varchar(30) not null,
password varchar(30) not null,
logintype varchar(20) not null,
createdat timestamp,
lastaccessed timestamp
);	

CREATE TABLE IF NOT EXISTS deposite(
id int auto_increment primary key,
accountid varchar(16) not null,
depositeamount float not null, 
createdat timestamp
);

CREATE TABLE IF NOT EXISTS withdraw(
id int auto_increment primary key,
accountid varchar(16) not null,
withdrawamount float not null, 
createdat timestamp
);

CREATE TABLE IF NOT EXISTS loan(
loanid int auto_increment primary key,
firstname varchar(30) not null,
lastname varchar(30) not null,
address varchar(30),
employer varchar(30),
homephone varchar(15),
mobilephone varchar(15),
email varchar(30),
provident varchar(30),
agriculture varchar(30),
business varchar(30),
loanamount float not null,
loanperiod int not null,
loandate date,
firstpaymentdate date,
accountid varchar(30),
createdat timestamp
);

CREATE TABLE IF NOT EXISTS loanpayment(
loanid int not null,
payment float not null,
loanleft float not null,
createdat timestamp
);
