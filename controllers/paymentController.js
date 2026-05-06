const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const Book = require('../models/Book');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
// @access  Private
exports.createPaymentOrder = async (req, res) => {
  try {
    const { books, couponCode } = req.body;

    if (!books || !Array.isArray(books) || books.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one book is required'
      });
    }

    // CRITICAL: Calculate amount on backend (never trust frontend)
    let calculatedAmount = 0;

    for (const bookItem of books) {
      const book = await Book.findById(bookItem.bookId);
      
      if (!book || !book.isActive) {
        return res.status(400).json({
          success: false,
          message: `Book not available: ${bookItem.bookId}`
        });
      }

      const quantity = bookItem.quantity || 1;
      calculatedAmount += book.discountedPrice * quantity;
    }

    // Apply coupon if provided
    if (couponCode) {
      const coupon = await Coupon.findOne({ 
        code: couponCode.toUpperCase(),
        isActive: true 
      });

      if (coupon && coupon.category === 'BOOK' && coupon.expiryDate >= new Date()) {
        if (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) {
          let discount = 0;
          if (coupon.type === 'PERCENT') {
            discount = (calculatedAmount * coupon.value) / 100;
          } else {
            discount = coupon.value;
          }
          calculatedAmount = Math.max(0, calculatedAmount - discount);
        }
      }
    }

    // Round to avoid floating point issues
    calculatedAmount = Math.round(calculatedAmount);

    if (calculatedAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order amount'
      });
    }

    const order = await razorpay.orders.create({
      amount: calculatedAmount * 100, // Convert to paise
      currency: 'INR',
      receipt: `order_${Date.now()}`
    });

    res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: calculatedAmount, // Return in rupees
        amountInPaise: order.amount, // Store this for verification
        currency: order.currency
      }
    });
  } catch (error) {
    console.error('Create Payment Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating payment order',
      error: error.message
    });
  }
};

// @desc    Verify payment and create order
// @route   POST /api/payment/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      books,
      couponCode,
      address
    } = req.body;

    // CRITICAL FIX #2: Check for duplicate payment
    const existingOrder = await Order.findOne({ razorpayPaymentId: razorpay_payment_id });
    if (existingOrder) {
      return res.status(400).json({
        success: false,
        message: 'Order already processed with this payment'
      });
    }

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // CRITICAL FIX #1: Recalculate prices on backend (never trust frontend)
    let calculatedTotalPrice = 0;
    let calculatedDiscount = 0;
    const processedBooks = [];

    for (const bookItem of books) {
      const book = await Book.findById(bookItem.bookId);
      
      if (!book) {
        return res.status(404).json({
          success: false,
          message: `Book not found: ${bookItem.bookId}`
        });
      }

      // FIX #7: Check if book is active
      if (!book.isActive) {
        return res.status(400).json({
          success: false,
          message: `Book "${book.title}" is no longer available`
        });
      }

      const bookPrice = book.discountedPrice;
      const quantity = bookItem.quantity || 1;
      const bookTotal = bookPrice * quantity;

      calculatedTotalPrice += bookTotal;

      processedBooks.push({
        bookId: book._id,
        quantity,
        price: bookPrice
      });
    }

    // Apply coupon if provided (FIX #6: Validate category)
    let finalCouponDiscount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ 
        code: couponCode.toUpperCase(),
        isActive: true 
      });

      if (!coupon) {
        return res.status(400).json({
          success: false,
          message: 'Invalid coupon code'
        });
      }

      // FIX #6: Check coupon category
      if (coupon.category !== 'BOOK') {
        return res.status(400).json({
          success: false,
          message: 'This coupon cannot be applied to books'
        });
      }

      // Check expiry
      if (coupon.expiryDate < new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Coupon has expired'
        });
      }

      // Check usage limit
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return res.status(400).json({
          success: false,
          message: 'Coupon usage limit reached'
        });
      }

      // Check new user only
      if (coupon.isNewUserOnly) {
        const orderCount = await Order.countDocuments({ userId: req.user._id });
        if (orderCount > 0) {
          return res.status(400).json({
            success: false,
            message: 'This coupon is only for new users'
          });
        }
      }

      // Calculate discount
      if (coupon.type === 'PERCENT') {
        finalCouponDiscount = (calculatedTotalPrice * coupon.value) / 100;
      } else {
        finalCouponDiscount = coupon.value;
      }
    }

    // FIX #3: Prevent negative prices
    let calculatedFinalPrice = Math.max(0, calculatedTotalPrice - finalCouponDiscount);

    // Round to avoid floating point issues
    calculatedTotalPrice = Math.round(calculatedTotalPrice);
    finalCouponDiscount = Math.round(finalCouponDiscount);
    calculatedFinalPrice = Math.round(calculatedFinalPrice);

    // Create order in database with backend-calculated prices
    const order = new Order({
      userId: req.user._id,
      books: processedBooks,
      totalPrice: calculatedTotalPrice,
      discount: finalCouponDiscount,
      finalPrice: calculatedFinalPrice,
      couponCode: couponCode || null,
      paymentStatus: 'SUCCESS',
      orderStatus: 'PLACED',
      address,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature
    });

    await order.save();

    // Update coupon usage if applied
    if (couponCode) {
      await Coupon.findOneAndUpdate(
        { code: couponCode.toUpperCase() },
        { $inc: { usedCount: 1 } }
      );
    }

    res.json({
      success: true,
      message: 'Payment verified and order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Verify Payment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while verifying payment',
      error: error.message
    });
  }
};

// @desc    Get user's orders (purchase history)
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('books.bookId', 'title image discountedPrice')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get My Orders Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders',
      error: error.message
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('books.bookId', 'title image discountedPrice');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Users can only view their own orders
    if (order.userId.toString() !== req.user._id.toString() && 
        req.user.role !== 'super_admin' && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order',
      error: error.message
    });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private (Super Admin & Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page, limit } = req.query;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 0;

    let query = {};
    if (status) {
      query.orderStatus = status;
    }

    let ordersQuery = Order.find(query)
      .populate('userId', 'name email')
      .populate('books.bookId', 'title image')
      .sort({ createdAt: -1 });

    if (limitNum > 0) {
      const skip = (pageNum - 1) * limitNum;
      ordersQuery = ordersQuery.skip(skip).limit(limitNum);
    }

    const orders = await ordersQuery;

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get All Orders Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders',
      error: error.message
    });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private (Super Admin & Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (!['PLACED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status'
      });
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update Order Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status',
      error: error.message
    });
  }
};
