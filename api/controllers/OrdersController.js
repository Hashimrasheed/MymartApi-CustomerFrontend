const CustomerOrder = require("../models/CustomerOrder");
const User = require("../models/User");
const Product = require("../models/Product");
const Setting = require("../models/Setting");
// const OrderStatus = require("../models/OrderStatus");
const customer = require("../models/Customer")
const ProductImage = require("../models/ProductImage");
const configuration = require("../config/constant");


let productImage = async (product_id) => {
    let image = await ProductImage.findOne({ product_id: product_id, type: "main" })
        .select(
            "_id original_image main_image thumbnail_image main_image_url thumbnail_image_url type"
        )
        .exec();
    if (image) {
        return {
            main_image_url: `${configuration.Appurl}/product/${image.main_image}`,
            thumbnail_image_url: `${configuration.Appurl}/product/${image.thumbnail_image}`,
        };
    }
    return {
        main_image_url: `${configuration.Appurl}/img/no_image_main.jpg`,
        thumbnail_image_url: `${configuration.Appurl}/img/no_image_thumb.svg`,
    };
};

exports.initiateOrder = async (req, res, next) => {
    try {
        if (req.query.id) {
            var { status } = await customer.findById(req.query.id)
        }
        let orderNo = `VIR-${new Date().getTime()}`;
        let result
        let customerOrder = {
            order_no: orderNo,
            business_slug: req.customerData.business_slug,
            customer_info: req.customerData.userId,
            // paid_amount: parseFloat(req.body.paid_amount),
            status: "incomplete",
            product_list: req.body.product_list,
            address: req.body.address,
            scheduleDate: req.body.scheduleDate,
            scheduleTime: req.body.scheduleTime,
            order_type: req.body.order_type
                ? req.body.order_type
                : "normal",
            order_class: req.body.order_class
                ? req.body.order_class
                : "Delivery"
        }
        if (typeof req.query.orderId !== 'undefined' && req.query.orderId) {
            result = await CustomerOrder.findByIdAndUpdate(req.query.orderId, customerOrder, { new: true });
        } else {
            customerOrder = new CustomerOrder(customerOrder);
            result = await customerOrder.save();
        }

        return res.status(200).json({
            data: { ...result._doc, _id: result._id },
            customerStatus: status === undefined ? true : status,
            status: 200,
            message: "Address Saved Successfully",
        });
    } catch (err) {
        return res.status(500).json({
            status: 500,
            error: err.message,
            message: "Something went wrong",
        });
    }
},

exports.createOrder = async (req, res, next) => {
    try {
        let discount = 0
        await req.body.product_list.map((item) => {
            if (item.isDiscountable) {
                discount = discount + ((item.amount - Number(item.specialPrice)) * item.quantity)
            }
        })
        let normalAmount = parseFloat(req.body.paid_amount) + discount
        if (req.body.discount_amount) {
            normalAmount = normalAmount + req.body.discount_amount
        }
        if (req.body.delivery_charge && req.body.delivery_charge != 0) {
            normalAmount = normalAmount - req.body.delivery_charge
        }
        let result = await CustomerOrder.findByIdAndUpdate(req.params.orderId, customerOrder, { new: true }).populate({ path: "product_list.product_id", select: 'general' })
        if (result) {
            await Customer.updateOne(
                { _id: req.customerData.userId },
                { $inc: { orderNumber: 1 } }
            );
        }
        return res.status(200).json({
            data: { ...result._doc, _id: result._id },
            status: 200,
            message: "Order Saved Successfully",
        });
    } catch (err) {
        return res.status(500).json({
            status: 500,
            error: err.message,
            message: "Something went wrong",
        });
    }
},

exports.track_order = async (req, res, next) => {
    try {
        let orderDetail = await CustomerOrder.findById(req.params.orderId)
            .populate({ path: "product_list.product_id", select: 'general model' })
            .lean();
        let productList = await Promise.all(orderDetail.product_list.map(async product => {
            let result = product;
            let image
            if (product.product_id) {
                image = await productImage(product.product_id._id)
                result.displayImage = image.thumbnail_image_url
            } else {
                image = product.displayImage
                result.displayImage = image
            }
            return result;
        }))
        // let trackingDetails = await OrderStatus.find({ customer_order_id: req.params.orderId }).select({
        //     status: 1,
        //     _id: 0
        // }).sort({ createdAt: 1 }).exec();
        return res.status(200).json({
            data: {
                orderDetail,
                productList,
                // trackingDetails 
            },
            status: 200,
            message: "Payment Executed Successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message,
            message: "something went wrong",
            status: 500,
        });
    }
};

exports.previousOrders = async (req, res, next) => {
    try {
        let total = await CustomerOrder.find({
            customer_info: req.customerData.userId,
            method: { $exists: true }
        }).count();
        const result = await CustomerOrder.find({
            customer_info: req.customerData.userId,
            method: { $exists: true }
        }).select('order_no status _id createdAt')
            .skip((req.query.page - 1) * parseInt(req.query.limit))
            .limit(parseInt(req.query.limit))
            .sort({ createdAt: -1 });
        return res.status(200).json({
            data: { result, total },
            status: 200,
            message: "Payment Executed Successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: error,
            status: 500,
        });
    }
}
