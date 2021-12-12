# COMP 3005 Final Project (Look Inna Book)
     Name: Mohammad Khan
     Student ID: 101155812
    
My COMP 3005 Final Project repository. This is a web application that uses Express.js, PUG, JavaScript and CSS that interacts with a PostgreSQL relational database that implements a book store where users can search and purchase books and track their orders. The owners have the option to add, remove and view reports for books in the bookstore

# Report and Design/Implementation Details
Refer to my project report for the design and implementation details for my application including my ER-Diagram, Schema Diagram and UI screenshots explaining how application works for the user and owner interface. The report can be found [here](https://drive.google.com/file/d/1MXNrh_CZ55Phg7fLuqJ8nUonfWXQmo_P/view?usp=sharing)

# Running the application
1. First, make sure you have Node.js installed on your computer. You can install it [here](https://nodejs.org/en/)
2. Download all the files, SQL files and source code from my project repository
3. Open up a SQL editor or pgAdmin and create a new database called: ```book_store_db``
4. Open up a SQL editor and copy and paste the contents from ```DDL.sql, DataInsert.sql``` and ```Views.sql``` into your SQL editor which will create the tables, insert the sample data and gerenate the views for database respectively. Please do it in this order: create the tables from ```DDL.sql```, insert the data from ```DataInsert.sql``` and insert the views using ``Views.sql``. Additonally you can open the SQL files in pgAdmin or some other SQL editor and run the file. Again, please do it in the order specified as before.
5. Connect to the database on your computer by doing the following:
    - Go to lines 44-50 in index.js and you will see the following:
    ```
    const client = new Client({
        host: "localhost",
        user: "postgres",
        port: 5432,
        password: "Mohammadkhan10",
        database: "book_store_db"
    })
    
    ```       
     - Change any of the following lines such as the host, user, port number, or password in order to connect to the database on your local computer. In most cases, you would just need to change the password that will work on your local computer but if any of the parameters differ on your local computer, PLEASE change it so that you will be able to connect to the database. This is very important. Otherwise you wont be ablet to connect to the database.
     - Once you have changed the lines in ```const client```, save the file.

6. Assuming you are in the directory where you have my project repository/folder and all the files associated with my project, the application can now start.
7. To install all the dependencies, open up the terminal and change the directory such that you are in the directory that has my project and type: ```npm install```
8. To run the application, type: ```node index.js```
9. You will an output in the console that reads: ```Server is up and running on http://localhost:3000```
10. Open up your web browser and type: http://localhost:3000
11. The application can now be used. NOTE: the CSS is not to scale on all screen sizes and may look out of place on larger screens. Adjust your web browser window accordingly such that the application looks more adjusted/presentable. This does not have to be done and the application will still run normally but adjusting your web browser window will make it look better
12. The application can now be used.
13. ADDITIONAL NOTES: When trying to add books to the bookstore, you may not know the publisher id. For reference, you can use these as the publisher id's when attemping to add a book to the database: 567564, 568424, 567999, 236652

