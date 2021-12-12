// Using Express.js as the backend for our server
const express = require('express')
const app = express()
const {Client} = require('pg')

app.use(express.static('public'))
app.use(express.static('views'))
app.use(express.urlencoded({extended: true}));

// Get and post requests used through out the application that interact with the database through specific queries
app.get('/', homePage)
app.post('/', searchForBooks)
app.get('/addBook', addBook)
app.post('/addBook', addBookToStore)
app.post('/reports', showReports)
app.get('/login', login)
app.post('/login', loginUser)
app.get('/logout', logout)
app.get('/register', register)
app.get('/order', showOrder)
app.post('/order', completeOrder)
app.get('/trackOrder', trackOrder)
app.post('/trackOrder', viewOrder)
app.get('/reports', bookReports)
app.get('/books/:id', bookInfo)
app.get('/yourCart/:id', yourCart)
app.get('/yourCart', yourCartCurrently)
app.post('/registerUser', registerUser)
app.get('/:id', deleteBook)

// Initializing cart, deleted books and the user that is logged in
let cartItems = [];
let deletedBooks = [];
let currentUser = [];
let loggedOn = false;

// Connecting to the database
// To TA's/Instructor: Change the user, port password such that it will work on your local computer
// For me, the user was postgres, my port was 5432 and my password was Mohammadkhan10
// PLEASE change any of the following lines such that the database will be connected to your computer
// Create a database in pgAdmin or any tool to interact with my postgres database and call it: book_store_db
// Then change the lien for user, password port to what will work for your on your computer.

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "Mohammadkhan10",
    database: "book_store_db"
})

client.connect();

// Displays the homepage, showing all the books in the database with their links along with an option to search for books
async function homePage(request, response, next) {

    
    const allBooks = await client.query(`select * from books`)
    const getStore = await client.query(`select * from book_store`)

    if (currentUser.length == 0){
        response.format({
            "text/html": function(){
                response.status(200).render("homePage.pug", {books: allBooks.rows, user: false, status: loggedOn, storeName: getStore.rows[0].name})
            }
        })

    }else{
        response.format({
            "text/html": function(){
                response.status(200).render("homePage.pug", {books: allBooks.rows, user: currentUser[0].is_owner, name: currentUser[0].name, status: loggedOn, storeName: getStore.rows[0].name})
            }
        })
    }
    
}

// Displays the login page for the user to login to the Book store application
function login(request, response, next) {

    response.format({
        "text/html": function(){
            response.status(200).render("login.pug")
        }
    })
}

// When the user clicks logout, they will be removed from the session, their carts get emptied
// and they will be redirected back to the login page
function logout(request, response, next){
    loggedOn = false;
    currentUser = [];
    cartItems = [];
    response.redirect('/')
}

// Logs a user in and handles errors in case if the username or password is incorrect
async function loginUser(request, response, next){

    let userInfo = request.body

    // Query selects from the users relation to see if the inputted account exists by checking their username and password
    let checkUser = await client.query(`select * from users where username = $1 and password = $2`, [userInfo.username, userInfo.password])

    // If it exists, the user is logged in now and is redirected to the homepage
    // Else they entered the wrong username/password and will be redirected to login again
    if(checkUser.rows[0]){
        loggedOn = true
        currentUser.push(checkUser.rows[0])
        response.redirect('/')
    }else{
        response.setHeader("Content-Type", "text/html")
        response.write("ERROR: Wrong username or password! <a href= /login> Try Again</a>")
        response.end()
        
    }

}

// Displays the page for registering a user
function register(request, response, next){
    
    response.format({
        "text/html": function(){
            response.status(200).render("register.pug")
        }
    })
}

// Searches for a book based on the input provided by the user
async function searchForBooks(request, response, next){

    let searchInfo = request.body
    let searchedBooks = []
    let searchedGenre = []

    // Query used to see if there is a book based on the input provided by the user where they can search by title, genre,
    // ISBN, author, or by the publishing companies ID. Attributes in the books table or lowered because the user may not
    // type in their search exactly how it is in the books relation.
    const getBooks = await client.query(`select * from books where lower(title) like lower($1) or lower(genre) like lower($1) 
                     or isbn = lower($1) or lower(author) like lower($1) or p_id = $1`,[searchInfo.searchBook])

    console.log(searchInfo)
    
    // User is then shown their results that matched their search
    if (currentUser.length == 0){
        response.format({
            "text/html": function(){
                response.status(200).render("homePage.pug", {books: getBooks.rows, user: false, status: loggedOn})
            }
        })

    }else{
        response.format({
            "text/html": function(){
                response.status(200).render("homePage.pug", {books: getBooks.rows, user: currentUser[0].is_owner, name: currentUser[0].name, status: loggedOn})
            }
        })
    }
}

// Displays the page for the user to order the books in their cart with proper error handling where necessary
function showOrder(request, response, next){

    if (currentUser.length == 0) {
        response.setHeader("Content-Type", "text/html")
        response.write("[ERROR] You need to be logged in to order books. <a href= /login> Try Again</a>")
        response.end()
    
    } else {
    response.format({
        "text/html": function(){
            response.status(200).render("placeOrder.pug", {user: currentUser[0].is_owner, name: currentUser[0].name, status: loggedOn})
        }
    })

    }
}

// Completing an order which will tell the user that the order was successful or unsuccessful, give them their order number
// to track their order and the stock of the books depending on how many were sold gets updated accordingly

async function completeOrder(request, response, next){
    let loggedInUser = currentUser[0].username
    let address = request.body

    // Create some dummy data when user will inquire about where their order currently is
    let shippingCompany = "DB Shipping Company"
    let status = "Arriving in 3 days"

    let order_number = Math.floor(1000 + Math.random() * 9000);

    // Get the current month, as we will update the stock of the books based on how many of those books
    // were sold that month
    let date = new Date()
    let month = date.getMonth() + 1 
    

    try {
        // Insert into the track_order table the information inputted by the user (assuming the info they enter is correct)
        let order = await client.query(`insert into track_order (order_number, username, shipping_company, shipping_street_number,
            shipping_street_name, shipping_city, shipping_province, shipping_postal_code, status)
            values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [order_number, loggedInUser, shippingCompany,
            address.shipping_street_number, address.shipping_street_name, address.shipping_city, address.shipping_province,
            address.shipping_postal_code, status]);

            // Store the order numbers each times the user makes an order so that they can inquire later
            // on where there order is currently
            const getInquired = await client.query(`insert into inquires (order_number, username) values ($1, $2)`,
                                                    [order_number, loggedInUser])

            

        for (let i = 0; i < cartItems.length; i++){
            let order_id = Math.floor(1000 + Math.random() * 9000);

            // Insert into the ordered_books table the books that the user has ordered
            const orderBook = await client.query(`insert into ordered_books (order_id, isbn, num_books, month)
                                                values ($1, $2, $3, $4)`, [order_id, cartItems[i], 1, month])

            // Store the orders users make into the orders relation
            // Store the which book has been ordered with the order_id
            const orders = await client.query(`insert into orders (order_id, username, month) values ($1, $2, $3)`,
                                                    [order_id, loggedInUser, month])
            const boook_ordered = await client.query(`insert into book_ordered (order_id, isbn) values ($1, $2)`,
                                                    [order_id, cartItems[i]])

            
    
            // When a book is sold, the stock needs to decrease by 1 each time for every books sold                                    
            const getStock = await client.query(`select stock from books where isbn = $1`, [cartItems[i].toString()])
            for (let j = 0; j < getStock.rowCount; j++) {

                // Update the stock for the books that have been sold
                const updateStock = await client.query(`update books set stock = $1 where isbn = $2`, [getStock.rows[j].stock - 1, cartItems[i]])
                const getCount = await client.query(`select * from all_orders where month = $1`, [month])

                for (let k = 0; k < getCount.rowCount; k++){

                    // Restock books if the current stock falls under the threshold value (for this book store, it is 10)
                    // If there are less than or equal to 10 books, restock the books by adding to the stock the number of books
                    // that were sold for that month.
                    const restock = await client.query(`update books set stock = (select count from all_orders where isbn = $1) + (select stock from books where isbn = $2)
                                                    where stock <= 10 and isbn = $3`, 
                                                    [getCount.rows[k].isbn, getCount.rows[k].isbn, getCount.rows[k].isbn])
                }
            }
        }

        // Notify the user that the order was successful and redirect them to track their order or to go home
        response.setHeader("Content-Type", "text/html")
        response.write("[SUCCESS] Your Order was successfully placed! Your order number is " + order_number + ". Track your order <a href= /trackOrder> here</a> or <a href= /> Search for more books</a>")
        response.end()
    
        cartItems = []

        // Handle any errors that occur
    } catch (err){
        console.log(err)
        response.setHeader("Content-Type", "text/html")
        response.write("[ERROR] Order could not be completed / No items in cart. <a href= /order> Try Again</a>")
        response.end()
    }
        
}

// Display page that tracks the users order by taking input from the user which would be their order number
// If their order can be found, then they will be able to view the deatils as to where their order currently is 
async function viewOrder(request, response, next){

    let searchOrderNumber = request.body
    console.log(searchOrderNumber.orderNumber)

    // Track the users order based on the order number they passed
    const getOrder = await client.query(`select * from inquires where order_number = $1`, [parseInt(searchOrderNumber.orderNumber)])
    const getDetails = await client.query(`select * from track_order where order_number = $1`, [getOrder.rows[0].order_number])
    console.log(getDetails.rows)

    // Propery handle errors and format the response that shows all the details for the users order when they inquire about it
    if (currentUser.length == 0){
        response.setHeader("Content-Type", "text/html")
        response.write("[ERROR] You must be logged in to track your order! <a href= /login>Login</a>")
        response.end()

    }else{
        response.format({
            "text/html": function(){
                response.status(200).render("trackOrder.pug", {order: getDetails.rows, user: currentUser[0].is_owner, name: currentUser[0].name, status: loggedOn})
            }
        })
    }

}

// Display the track order page for the user when they click on the link that is on the navigation bar
function trackOrder(request, response, next){
    
    if (currentUser.length == 0){
        response.setHeader("Content-Type", "text/html")
        response.write("[ERROR] You must be logged in to track your order! <a href= /login>Login</a>")
        response.end()

    }else{
        response.format({
            "text/html": function(){
                response.status(200).render("trackOrder.pug", {user: currentUser[0].is_owner, name: currentUser[0].name, status: loggedOn})
            }
        })
    }
}

// Display the page that shows the book reports (sales per author, sales per genre, sales per publishing company)
// when the book store owner clicks on it
async function bookReports(request, response, next){
    

    // Handle any errors and display the page when the owner inquires about the book reports
    if (currentUser.length == 0){
        response.setHeader("Content-Type", "text/html")
        response.write("[ERROR] You must be logged in as an owner to view the reports! <a href= /login>Login</a>")
        response.end()

    }else{
        response.format({
            "text/html": function(){
                response.status(200).render("reports.pug", {user: currentUser[0].is_owner, name: currentUser[0].name, status: loggedOn})
            }
        })
    }
    
}

// Register the user if they don't have an account. Insert the information they passed into the users relation and redirect them
// to the login page for them to login to their account. If they try to register with a username that already exists in the users
//relation, an error occurs, it is handled and they will be redirected back to the registration page to try again.

async function registerUser(request, response, next){

    let owner = false;
    let newUserInfo = request.body
    
    // If they are an owner, set the owner boolean to true, otherwise false
    if (request.body.owner == "yes"){
        owner = true

    }else{
        owner = false
    }

    // Check to see if the username they try registering with already exists in the database
    // If it does, send an error message and redirect them back to the registration page to try agin
    /*const user = await client.query(`select * from users where username = $1`, [newUserInfo.username])

    if (user.rows[0].username == newUserInfo.username){
        response.setHeader("Content-Type", "text/html")
        response.write("[ERROR]: User with that username already exists. <a href= /register> Try Again</a>")
        response.end()
    
    // Otherwise, all the info they passed is valid and their account information is inserted into the users and is_registerd relation
    // and they are redirected to the login page
    } else {*/

        try {
            let newUser = await client.query(`insert into users (username, password, name, email, street_number, street_name, city,
                        province, postal_code, is_owner)
                        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, [newUserInfo.username, newUserInfo.password, newUserInfo.name,
                        newUserInfo.email, newUserInfo.street_number, newUserInfo.street_name, newUserInfo.city, newUserInfo.province,
                        newUserInfo.postal_code, owner])

            let getStore = await client.query(`select * from book_store`)
            let registerdUser = await client.query(`insert into is_registered (username, name) values ($1, $2)`, [newUserInfo.username, getStore.rows[0].name])
            
            response.format({
                "text/html": function(){
                    response.redirect('/login')
                }
            })
        } catch(err) {
            response.setHeader("Content-Type", "text/html")
            response.write("[ERROR]: User with that username already exists. <a href= /register> Try Again</a>")
            response.end()
        }
}

// Show the details for a books when the user clicks on the link for a specific books
// Display all contents for the book including ISBN, author, genre, price etc.
async function bookInfo(request, response, next){
    
    let id = request.params.id
    console.log(request.params)

    // Use the ISBN parameter for /books:isbn and use a query to get the information for the book with that ISBN
    // Also get the publishing company name for the book
    const bookDetails = await client.query(`select * from books where isbn = $1`, [id])
    const publisherName = await client.query(`select name from publisher_comp where p_id = $1`, [bookDetails.rows[0].p_id])
 
    // Format the information of the book accordingly
    if (currentUser.length == 0){

        response.format({
            "text/html": function(){
                response.status(200).render("bookInfo.pug", {b: bookDetails.rows[0], p: publisherName.rows[0].name, status: loggedOn, user: false})
            }
        })

    } else {
        response.format({
            "text/html": function(){
                response.status(200).render("bookInfo.pug", {b: bookDetails.rows[0], p: publisherName.rows[0].name, status: loggedOn, user: currentUser[0].is_owner, name: currentUser[0].name})
            }
        })
    }
}

// Display all the books the user currently has in their cart when they click on "Your Cart"
async function yourCart(request, response, next){
    
    console.log(request.params)
    cartItems.push(request.params.id)
    let item = []
    let totalCost = 0

    for (let i = 0; i < cartItems.length; i++){

        // Get all the books that are in the cart that match the ISBN in the books relation and display the total cost
        // of the books that are in the users cart
        const getBooks = await client.query(`select * from books where isbn = $1`, [cartItems[i]])
        item.push(getBooks.rows[0])
        totalCost += parseFloat((getBooks.rows[0].price))
    }


    console.log(totalCost)

    response.redirect('/yourCart')

}

// Display all the books that are in the users cart everytime they add a new book
// to their cart. Each time a new book is added to their cart, it formats it in a way
// such that we see all the items in the cart as well as a link to the book
async function yourCartCurrently(request, response, next){
    
    let item = []
    let totalCost = 0

    for (let i = 0; i < cartItems.length; i++){
        // Get all the books that are in the cart that match the ISBN in the books relation and display the total cost
        // of the books that are in the users cart
        const getBooks = await client.query(`select * from books where isbn = $1`, [cartItems[i]])
        item.push(getBooks.rows[0])
        totalCost += parseFloat((getBooks.rows[0].price))
    }

    // Format the users cart, and notify them that they have items in their cart, but they are not logged in
    if (currentUser.length == 0) {

        response.format({
            "text/html": function(){
                response.status(200).render("cart.pug", {items: item, cost: totalCost.toPrecision(4), user: false, status: loggedOn})
            }
        })

    }else {
        response.format({
            "text/html": function(){
                response.status(200).render("cart.pug", {items: item, cost: totalCost.toPrecision(4), user: currentUser[0].is_owner, name: currentUser[0].name, status: loggedOn})
            }
        })

    }
}

// Option for the bookstore owner to delete a book in the bookstore. Once they click on a book, they will have the option
// to delete it. Once deleted, the book is no longer present in the book store
async function deleteBook(request, response, next){

    deletedBooks.push(request.params.id) 
    let deletedBookID = request.params.id

    // Each time the owner wants to delete a book, we go through all the books and call a query to delete the book
    for (let i = 0; i < deletedBooks.length; i++){

        // Delete the book based on its ISBN
        const deletedBooks = await client.query(`delete from books where isbn = $1`, [deletedBookID])
     
    }


    // Redirect the owner back to the homepage

    response.redirect('/')
    
}

// Display the 'Add Book' page when the bookstore owner clicks on it
function addBook(request, response, next){
    
    if (currentUser.length == 0) {
        response.setHeader("Content-Type", "text/html")
        response.write("[ERROR]: You need to be logged in as the owner to add books. <a href= /login> Try Again</a>")
        response.end()

    } else{
        response.format({
            "text/html": function(){
                response.status(200).render("addBook.pug", {user: currentUser[0].is_owner, name: currentUser[0].name, status: loggedOn})
            }
        })
    }
    
}

// Show the bookstore owner the reports when they inquire about it. The owner has the option to display the reports from either this
// month or last month. They click the drop down menu and can select one of the two options. If they select the "This month" option and
// then click submit, the reports for the sales per author, sales per genre and sales per publishing company are all diaplyed for the 
// current month. If they select the "Last month" option, the reports from the previous months sales will be shown. The details
// for each report are used through the queries from that interact with the views in "Views.sql"

async function showReports(request, response, next){

    // Generate reports for this month
    if (request.body.time_period === "this_month"){
        console.log("Generating reports from this month")
        let date = new Date()
        let thisMonth = date.getMonth() + 1
    
        // Get the sales per author, genre and publishing company using a query that connects to the specific view.
        const getAuthorReports = await client.query(`select * from sales_per_author where month = $1 order by (total_sales) desc`, [thisMonth])
        const getGenreReports = await client.query(`select * from sales_per_genre where month= $1 order by (total_sales) desc`, [thisMonth])
        const getPublisherReports = await client.query(`select * from sales_per_publishing_comp where month = $1 order by (total_sales) desc`, [thisMonth])

        // Format the reports accordingly
        if (currentUser.length == 0){
            response.format({
                "text/html": function(){
                    response.status(200).render("reports.pug", {user: false, status: loggedOn, rows: getAuthorReports.rows, rows2: getGenreReports.rows, y: date.getFullYear(), rows3: getPublisherReports.rows})
                }
            })

        }else{
            response.format({
                "text/html": function(){
                    response.status(200).render("reports.pug", {user: currentUser[0].is_owner, name: currentUser[0].name, status: loggedOn, rows: getAuthorReports.rows, rows2: getGenreReports.rows, y: date.getFullYear(), rows3: getPublisherReports.rows})
                }
            })
        }

    // Generate reports for this month
    }else if (request.body.time_period === "last_month"){
        console.log("Generating reports from last month")
        let date = new Date()
        let lastMonth = date.getMonth()
    
         // Get the sales per author, genre and publishing company using a query that connects to the specific view.
        const getAuthorReports = await client.query(`select * from sales_per_author where month = $1 order by (total_sales) desc`, [lastMonth])
        const getGenreReports = await client.query(`select * from sales_per_genre where month= $1 order by (total_sales) desc`, [lastMonth])
        const getPublisherReports = await client.query(`select * from sales_per_publishing_comp where month = $1 order by (total_sales) desc`, [lastMonth])

        // Format the reports accordingly
        if (currentUser.length == 0){
            response.format({
                "text/html": function(){
                    response.status(200).render("reports.pug", {user: false, status: loggedOn, rows: getAuthorReports.rows, rows2: getGenreReports.rows, y: date.getFullYear(), rows3: getPublisherReports.rows})
                }
            })

        }else{
            response.format({
                "text/html": function(){
                    response.status(200).render("reports.pug", {user: currentUser[0].is_owner, name: currentUser[0].name, status: loggedOn, rows: getAuthorReports.rows, rows2: getGenreReports.rows, y: date.getFullYear(), rows3: getPublisherReports.rows})
                }
            })
        }
    }

    
}

// Display the option for the bookstore owner to add a book to the bookstore. When they select this option, the owner is prompted
// to input the information for the new book to be added. If a book with a certain ISBN already exists, the book cannot be added
// and the owner will be redirected back to the page to add the book again properly.

async function addBookToStore(request, response, next){
    

    let book = request.body
    console.log(book.isbn)

    // Get all the books currently in the book store.
    const checkBook = await client.query(`select * from books`)

    console.log(checkBook.rows[0].isbn)

    // Attempt to add the book using an insert query which inserts the new book into the books relation 
    // based on the input passed by the owner. If successful, redirect them back to the to homepage
    try {
        let newBook = await client.query(`insert into books (isbn, title, p_id, author, genre, pages, price, stock)
                                         values ($1, $2, $3, $4, $5, $6, $7, $8)`, [book.isbn, book.title, book.p_id, 
                                        book.author, book.genre, book.pages, book.price, book.stock])

        let newPublishedBoook = await client.query(`insert into publishes (isbn, p_id ) values ($1, $2)`, [book.isbn, book.p_id])            
        
        console.log("Book successfully added")
        response.redirect('/')
        
        // Handle the error in the case that the owner attempts to add a book that has an ISBN that already exists in the
        // books relation and redirect them back to the 'Add Book' page to try again
        } catch(err){
            response.setHeader("Content-Type", "text/html")
            response.write("[ERROR]: Book with that ISBN already exists or Publishing Company ID not recognized. <a href= /addBook> Try Again</a>")
            response.end()
        }
    
}

// Listen on port 3000. Once the server is running, this message should be outputted.
// Open a web browser and type http://localhost:3000 and the bookstore web application will be running
app.listen(3000)
console.log("Server is up and running on http://localhost:3000")