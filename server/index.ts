'use strict';

// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// Import required packages
import http from "http";
import Express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import mongoose from "mongoose";
import path from "path";
import swaggerUi from 'swagger-ui-express';

// Import services and utilities
import {
	IS_PROD,
	MONGODB_URI_PROD,
	MONGODB_URI,
	SERVER_PORT,
	SESSION_SECRET
} from "@server/services/const";
import { getCurrentAccount } from "@server/middlewares/auth";
import { cors } from "@server/middlewares/cors";
import { initializeSettings } from "@server/services/utils";
import { initializeSocket } from "./services/socket";
import _bo_server_, { _bo_get_now_, _bo_swagger_ } from "./services/_";

// Import routes
import authRoutes from "@server/routes/auth";
import testRoutes from "@server/tests/route";

// MongoDB connection
mongoose.set("strictQuery", false);

const mongoUri = IS_PROD ? MONGODB_URI_PROD : MONGODB_URI;
mongoose.connect(mongoUri)
	.then(() => {
		console.log(`🔗 ${_bo_get_now_()} | MongoDB ${IS_PROD ? 'ONLINE' : 'LOCAL'} / url: ${mongoUri}`);
	})
	.catch(err => {
		console.log(`❌ ${_bo_get_now_()} | Error connecting to MongoDB: ${err}`);
	});

// Initialize Express app
const app = Express();
// Serve static files for back office (production or development)
const buildPath = IS_PROD
	? path.join(__dirname, '../../client/build')
	: path.join(__dirname, '../client/build');

// Session configuration
app.use(session({
	secret: SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
}));

// Apply middlewares
app.use(cors);
app.use(cookieParser());
app.use(Express.urlencoded({ extended: true }));
app.use(Express.json());
app.use(getCurrentAccount);

// use my Config
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(_bo_swagger_()));
app.use('/uploads', Express.static(path.join(__dirname, '../uploads')));
app.use('/uploads/pdps', Express.static(path.join(__dirname, '../uploads/pdps')));
app.use(Express.static(buildPath));
app.get(/^\/(?!api|uploads).*/, (req, res) => {
	res.sendFile(path.join(buildPath, 'index.html'));
});

// use Routes
app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);


// Initialize settings from database
initializeSettings();

// Socket.io setup
const server = http.createServer(app);
const io = initializeSocket(server);
export { io };

// Start the server and listen for incoming requests
server.listen(SERVER_PORT, () => _bo_server_());

