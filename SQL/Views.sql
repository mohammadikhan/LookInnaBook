-- A view that shows all the orders for a book for a specific month
-- Returns a table that is grouped by the books ISBN the number of books
-- that book had sold for the given month

create view all_orders as
select isbn, count(num_books), ordered_books.month
from ordered_books
group by (isbn, ordered_books.month);

-- A view that makes use of the all_orders view which returns
-- a table for the sales of all books by author for the given month. 
-- Groups by the author name and the month to show the sales of books by author for that month

create view sales_per_author as 
select author, sum(total_sales) as total_sales, foo.month from
(select books.author, sum(price) * all_orders.count as total_sales, all_orders.month from books, all_orders
where books.isbn = all_orders.isbn
group by(books.author, all_orders.month, all_orders.count)) as foo
group by(author, foo.month);

-- A view that makes use of the all_orders view which returns
-- a table for the sales of all books by genre for the given month. 
-- Groups by the book genre and the month to show the sales of books by genre for that month

create view sales_per_genre as 
select genre, sum(total_sales) as total_sales, foo.month from
(select books.genre, sum(price) * all_orders.count as total_sales, all_orders.month from books, all_orders
where books.isbn = all_orders.isbn
group by(books.genre, all_orders.month, all_orders.count)) as foo
group by(genre, foo.month);

-- A view that makes use of the all_orders view which returns
-- a table for the sales of all books by a publishing company for the given month.
-- We take for each book sold, the publising company of the books will recieve 20%
-- of the profit (e.g books costs $20 and they get 20% of the profit, which would be $4)
-- Groups by the publishing company name and the month to show the sales of books by publishing company for that month

create view sales_per_publishing_comp as 
select name, sum(total_sales) as total_sales, foo.month from
(select publisher_comp.name, (sum(price) * all_orders.count) * publisher_comp.percentage as total_sales, all_orders.month from books, all_orders, publisher_comp
where books.isbn = all_orders.isbn and books.p_id = publisher_comp.p_id
group by(publisher_comp.name, publisher_comp.percentage, all_orders.month, all_orders.count)) as foo
group by(name, foo.month);