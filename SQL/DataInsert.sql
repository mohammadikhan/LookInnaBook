delete from publisher_comp;
delete from publishes;
delete from books;
delete from users;
delete from book_store;

-- Adding sample publishers that will be publishing the books in our database
-- All relevant information for a publisher is added
insert into publisher_comp values('567564', 'Scholastic', '123 Main St.', 'scholastic@yahoo.com', '4165556667', '2665314213');
insert into publisher_comp values('567999', 'HarperCollins', '568 Tuple St.', 'harpercollins@yahoo.com', '1234652311', '5653211987');
insert into publisher_comp values('236652', 'Macmillan', '435 West Dr.', 'macmillan@outlook.com', '9059969973', '4232214789');
insert into publisher_comp values('111222', 'Bertelsmann', '68 Yonge St.', 'bertelsmann@gmail.com', '1234567891', '6266333999');
insert into publisher_comp values('368995', 'McGraw-Hill', '186 Main St.', 'mcgrawhill@outlook.com', '5765641236', '8221423369');
insert into publisher_comp values('142365', 'HQN', '250 Database Dr.', 'HQN@gmail.com', '6476665555', '4586662314');
insert into publisher_comp values('785214', 'Annick', '416 Toronto St.', 'Annick@yahoo.com', '4165711234', '2956533214');
insert into publisher_comp values('652321', 'Red Deer Press', '58 City Saint St.', 'reddeerpress@outlook.com', '9055556574', '9156689231');
insert into publisher_comp values('451236', 'MIRA', '95 Raptor St.', 'mira@gmail.com', '4166623147', '2344463213');
insert into publisher_comp values('568424', 'Nelson', '86 St. Barbara', 'nelson@yahoo.com', '4165712399', '1236665488');

-- Storing the information for the publishers and what books they have published
insert into publishes values('1679514567', '567564');
insert into publishes values('1243557891', '567564');
insert into publishes values('2634365473', '568424');
insert into publishes values('2652758741', '568424');
insert into publishes values('4987289413', '451236');
insert into publishes values('6984258415', '451236');
insert into publishes values('7898317856', '652321');
insert into publishes values('3945199842', '785214');
insert into publishes values('9955125478', '142365');
insert into publishes values('2432136589', '368995');
insert into publishes values('5642178456', '111222');
insert into publishes values('4789554123', '236652');
insert into publishes values('8695421478', '567999');
insert into publishes values('2655923657', '567999');

-- Sample book that are added to our bookstore
insert into books values('1679514567', 'Ultimate Spider-Man', '567564', 'Brian Michael Bendis', 'Action', 60, 25.99, 15);
insert into books values('1243557891', 'Holes', '567564', 'Louis Sachar', 'Adventure', 265, 20.99, 15);
insert into books values('2634365473', 'Divergent', '568424', 'Veronica Roth', 'Science Fiction', 487, 30.50, 15);
insert into books values('2652758741', 'The Last Magician', '568424', 'Lisa Maxwell', 'Fantasy', 500, 29.99, 15);
insert into books values('4987289413', 'Percy Jackson & the Olympians: The Lightning Thief', '451236', 'Rick Riordan', 'Fantasy', 377, 40.00, 15);
insert into books values('6984258415', 'Percy Jackson & the Olympians: The Sea of Monsters', '451236', 'Rick Riordan', 'Fantasy', 279, 42.00, 15);
insert into books values('7898317856', 'Radiant Darkness', '652321', 'Emily Whitman', 'Fantasy', 274, 24.50, 15);
insert into books values('3945199842', 'The Chosen', '785214', 'Taran Matharu', 'Action', 368, 9.99, 15);
insert into books values('9955125478', 'Dark Blade', '142365', 'Steve Feasey', 'Thriller', 337, 15.00, 15);
insert into books values('2432136589', 'The Adventures of Captain Underpants', '368995', 'Dav Pilkey', 'Comedy', 125, 10.00, 15);
insert into books values('5642178456', 'Diary of a Wimpy Kid', '111222', 'Jeff Kinney', 'Comedy', 114, 15.00, 15);
insert into books values('4789554123', 'Charlotte''s Web', '236652', 'E. B. White', 'Fiction', 192, 20.99, 15);
insert into books values('8695421478', 'Silverwing', '567999', 'Kenneth Oppel', 'Fantasy', 272, 25.99, 15);
insert into books values('2655923657', 'Dune', '567999', 'Frank Herbert', 'Science Fiction', 688, 30.50, 15);

-- Sample users that are inserted for testing purposes
-- The 'Regular' user is a normal user who can search and purchase books as well as track where there order is currently
-- The 'Owner' user is the owner of the bookstore and has root privleges including adding and removing books and requesting
-- the reports for a specific month*/
insert into users values('regular', '123', 'Regular', 'regular@gmail.com', '123', 'Main Street', 'Ottawa', 'ON', 'Q1P5Z3', false);
insert into users values('owner', '123', 'Owner', 'owner@gmail.com', '123', 'Root Street', 'Ottawa', 'ON', 'Q1P5V3', true);

-- Create a sample store for our application called 'Look Inna Book' and 
-- make the 'owner' user the owner
insert into book_store values('Look Inna Book', 'owner', '500 Book Store St.')



