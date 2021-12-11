-- Table for book store owners that stores the information for 
-- a particular publishing company. In this case, their name,
-- address, email, phone_number and their bank account

create table publisher_comp (
	p_id    			varchar(6),
	name    			varchar(50),
	address 			varchar(50),
	email   			varchar(50),
	phone_number  			varchar(10),
	bank_account_number 		varchar(10),
	percentage			numeric(2,2),
	primary key (p_id)
);


-- Table that stores all the information regarding a specific book.
-- Stores the most important attributes of a book including its
-- ISBN (this is how we uniquely identify a book, where a user can
-- search for a book by ISBN or a book can be added such that it does not have
-- the same ISBN as another books), title, author, genre, the number of pages the
-- book has, its price and stock (number of books that are currentl available in the bookstore)

create table books (
	isbn				varchar(10),
	title 				varchar(50),
	p_id 				varchar(6),
	author 				varchar(50),
	genre 				varchar(20),
	pages				numeric(3,0),
	price 				numeric(6,2),
	stock 				numeric(2,0),
	primary key (isbn),
	foreign key (p_id) references publisher_comp(p_id)
);

-- Table that stores all the users of the database. The attributes for
-- the table correspond to the form the user uses to register an account
-- for the bookstore. These attributes include the username (no two users can have
-- the same username), password, their name, email, address (street_number, street_name, 
-- city province, postal_code) and whether or not the user is an owner or not (assumption
-- was made that owners are also user, just with root privileges)

create table users (
	username		 	varchar(50),
	password			varchar(50),
	name				varchar(50),
	email				varchar(60),
	street_number			numeric(4, 0),
	street_name			varchar(50),
	city				varchar(40),
	province			varchar(2),
	postal_code			varchar(6),
	is_owner			boolean,
	primary key (username)
);

-- Table for the store. Assume that we there is only one owner for the 
-- book store, so we would simply represent the store by it's name, the owner
-- and it's address (the address would be the store's headquarters)
-- In our case the store is called 'Look Inna Book'

create table book_store (
  	name	 	 varchar(30),
 	username	 varchar(50),
 	address		 varchar(60),
  	primary key(name),
 	foreign key(username) references users(username)
);

-- Table that stores all the information for all the books that have been orderd.
-- Shows the number of books sold for a specific ISBN and the month that it was sold

create table ordered_books (
	order_id	varchar(8),
	isbn		varchar(10),
	num_books	numeric(2,0),
	month		numeric(2,0),
	primary key(order_id),
	foreign key (isbn) references books(isbn)
);

-- Table that shows all the information for the users order
-- and where it is currently. Displays the order_number along
-- with the username that made the order, the shipping address
-- the shipping company and the status of the delievery
-- (i.e when it will arrive)

create table track_order(
	order_number			numeric(5, 0),
	username			varchar(50),
	shipping_company		varchar(20),
	shipping_street_number		numeric(5, 0),
	shipping_street_name		varchar(60),
	shipping_city			varchar(50),
	shipping_province		varchar(2),
	shipping_postal_code		varchar(6)
	status				varchar(30),
	primary key (order_number),
	foreign key (username) references users(username)
);

-- Modelling the relationship between the publishing company 
-- and the book
create table publishes (
	isbn			varchar(10),
	p_id			varchar(6),
	primary key(isbn),
	foreign key(p_id) references publisher_comp(p_id)
);

-- Modelling the relationship between the books that have been orderd
-- and the users that ordered books

create table orders (
	order_id		varchar(8),
	username		varchar(50),
	month			numeric(2, 0),
	primary key(order_id),
	foreign key(order_id) references ordered_books(order_id) on delete cascade,
	foreign key(username) references users(username)
);

-- Modelling the relationship between the order_number for an order
-- and the user that inquires to track where there order is currently

create table inquires (
	order_number		numeric(5),
	username			varchar(50),
	primary key(order_number),
	foreign key(order_number) references track_order(order_number),
	foreign key(username) references users(username)
);

-- Storing all the users that become registered upon creating an account
-- This is done to keep track of the users registered in the database

create table is_registered (
 	username		varchar(50),
 	name			varchar(30),
 	primary key(username),
 	foreign key(username) references users(username),
 	foreign key(name) references book_store(name)
);

-- Relationship between a book and the book that has been ordered. Each ordered
-- book corresponds to some book in the database where multiple of the same book
-- can be ordered.

create table book_ordered (
 	order_id		varchar(8),
   	isbn			varchar(10),
  	primary key (order_id),
  	foreign key(order_id) references ordered_books(order_id),
   	foreign key(isbn) references books(isbn) on delete cascade
);