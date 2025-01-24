// Importing requires npm modules
import express from 'express';
import dotenv from 'dotenv';
import ejsMate from 'ejs-mate';
import path from 'path';

// Importing custom modules
import indexRoutes from './routes/indexRoutes.js';
import { ExpressError } from './utils/ExpressError.js';

// Setting express app
dotenv.config();
const app = express();
app.set('view engine', 'ejs');

// Set the path to the views folder
const __dirname = path.resolve();
// console.log(__dirname);
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine('ejs', ejsMate);

// Use the router
app.use('/', indexRoutes);

// 404 middleware
app.use('*', (req, res, next) => {
    next(new ExpressError(404, 'Page not found'));
})

// Error handling middleware
app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong' } = err;
    res.status(status).render('error', { err });    
})

// Listen on port 
app.listen(process.env.PORT || 8080, () => {
    console.log('Server is running on port 3000\nhttp://localhost:3000');
});