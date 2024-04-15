const path                       = require( 'path' );
const express                    = require( 'express' );
const dotenv                     = require( 'dotenv' );
const morgan                     = require( 'morgan' );
const connectDB                  = require( './config/mysqlDB' );
const colors                     = require ( 'colors' );
// const productRoutes              = require( './routes/' );
// const userRoutes                 = require( './routes/userRoutes' );
// const orderRoutes                = require( './routes/orderRoutes' );
const uploadRoutes               = require( './routes/uploadRoutes' );
const { notFound, errorHandler } = require( './middleware/errorMiddleware' );
const ProductController = require('./controllers/ProductController');
const userController = require('./controllers/userController');
const paymentController = require('./controllers/paymentController');
const cors = require('cors');
dotenv.config();

connectDB();

const app = express();

if ( process.env.NODE_ENV === 'development' ) {
    app.use( morgan( 'dev' ) );
}
app.use(cors());
app.use( express.json() );

app.get('/', (req, res) => {
    res.send('Hello, world!');
  });
app.use( '/api/products', ProductController );
app.use( '/api/users', userController );
// app.use( '/api/orders', orderRoutes );
app.use( '/api/upload', uploadRoutes );
app.use('/api/payment', paymentController);
// app.use('/api/orders/',orderController);

app.use( '/uploads', express.static( path.join( __dirname, '/uploads' ) ) );

// 404 route  
app.use( notFound ); 

// custom error handler 
app.use( errorHandler );

const PORT = process.env.PORT || 5000;

app.listen( PORT, console.log( `Server running in ${process.env.NODE_ENV} mode on port ${PORT}...`.yellow.bold ));