const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const bookingController = require('../controllers/bookingController');
const chatController = require('../controllers/chatController');
const searchController = require('../controllers/searchController');
const accountController = require('../controllers/accountController');
const { authenticateUser } = require('../middleware/auth');
const profileController = require('../controllers/profileController');
const aiController = require('../controllers/aiController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Account type selection routes
router.get('/account-type', authenticateUser, accountController.getAccountTypePage);
router.post('/account-type', authenticateUser, accountController.setAccountType);

// Dashboard routes
router.get('/client/dashboard', authenticateUser, accountController.getClientDashboard);
router.get('/painter/dashboard', authenticateUser, accountController.getPainterDashboard);
router.get('/builder/dashboard', authenticateUser, accountController.getBuilderDashboard);

// User routes
router.post('/profile', authenticateUser, userController.createOrUpdateProfile);
router.get('/profile', authenticateUser, userController.getProfile);
router.get('/professionals', userController.getProfessionals);
router.put('/professionals/availability', authenticateUser, userController.updateAvailability);
router.post('/professionals/:professionalId/reviews', authenticateUser, userController.addReview);
router.put('/professionals/portfolio', authenticateUser, userController.updatePortfolio);

// Profile routes
router.get('/profile', authenticateUser, profileController.getProfile);
router.put('/profile', authenticateUser, upload.single('profilePicture'), profileController.updateProfile);
router.delete('/profile', authenticateUser, profileController.deleteProfile);
router.get('/profile/bookings', authenticateUser, profileController.getUserBookings);

// Portfolio routes
router.post('/profile/portfolio', authenticateUser, upload.single('image'), profileController.addPortfolioItem);
router.delete('/profile/portfolio/:itemId', authenticateUser, profileController.removePortfolioItem);

// Booking routes
router.post('/bookings', authenticateUser, bookingController.createBooking);
router.get('/bookings', authenticateUser, bookingController.getUserBookings);
router.get('/bookings/:id', authenticateUser, bookingController.getBookingDetails);
router.put('/bookings/:id', authenticateUser, bookingController.updateBooking);
router.delete('/bookings/:id', authenticateUser, bookingController.cancelBooking);
router.put('/bookings/:id/status', authenticateUser, bookingController.updateBookingStatus);

// Chat routes
router.post('/chats', authenticateUser, chatController.createChat);
router.post('/chats/:chatId/messages', authenticateUser, chatController.sendMessage);
router.get('/chats/:chatId/messages', authenticateUser, chatController.getChatMessages);
router.get('/chats', authenticateUser, chatController.getUserChats);
router.put('/chats/:chatId/read', authenticateUser, chatController.markChatAsRead);

// Enhanced search routes
router.get('/search', searchController.advancedSearch);
router.get('/search/suggestions', searchController.getSuggestions);
router.get('/search/history', authenticateUser, searchController.getSearchHistory);

// AI routes
router.post('/ai/query', authenticateUser, aiController.generateResponse);
router.post('/ai/search', authenticateUser, aiController.searchProfessionals);

module.exports = router; 