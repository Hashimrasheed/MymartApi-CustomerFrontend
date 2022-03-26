const Cart = require("../models/Cart");
const Product = require("../models/Product")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../config/constant");
const mongoose = require("mongoose")
const _ = require("lodash")

exports.fetchCart = async (req, res, next) => {
  try {
    let { customerType, userId } = req.body
    let cartData;
    cartData = await Cart
      .findOne({ customerId: userId, customerType: customerType })
      .exec();
    if (cartData && cartData.cartProducts && cartData.cartProducts[0]) {
      let cartDetails = await cartData.cartProducts.reduce(async (acc, cartproduct) => {
        const accumulator = await acc;
        let product = await Product.findOne({ _id: cartproduct.product_id })
          .exec();
        let productTotal = 0;

        if (
          product.model.selection_price_type == "selection_price" &&
          cartproduct.selection_price_id &&
          product.model.selected_price &&
          product.model.selected_price[0]
        ) {

          product.model.selected_price.forEach((selection) => {
            if (String(selection._id) == String(cartproduct.selection_price_id)) {
              productTotal = productTotal + selection.price;
            }
          });
        } else {
          productTotal = product.model.price;
          if (product.model.isDiscountable) {
            productTotal = product.model.specialPrice;
          }
        }
        return {
          totalItem: accumulator.totalItem + cartproduct.quantity,
          totalAmount: accumulator.totalAmount + productTotal * cartproduct.quantity
        }
      }, { totalItem: 0, totalAmount: 0 })
      return res.status(200).json({
        data: cartDetails,
        status: 200,
        message: "Cart fetched successfully",
      });
    } else {
      return res.status(200).json({
        data: {
          totalAmount: 0,
          totalItem: 0,
        },
        status: 200,
        message: "Cart fetched successfully",
      });
    }
  } catch (error) {
    return res.status(400).json({
      error: error.message,
      status: 400,
      message: "Something went wrong",
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    let { customerType, userId } = req.body
    let cartData = await Cart
      .findOne({
        customerId: userId,
        customerType: customerType
      })
      .lean()
      .exec();

    let product = {
      product_id: req.body.product.product_id,
      selection_type: req.body.product.selection_type,
      selection_price_id: req.body.product.selection_price_id,
    }
    if (cartData && cartData.cartProducts && cartData.cartProducts[0]) {
      let haveSameProduct = false
      await cartData.cartProducts.forEach(async (cartProduct) => {
        let cartProductData = {
          product_id: String(cartProduct.product_id),
          selection_type: cartProduct.selection_type,
          selection_price_id: cartProduct.selection_price_id ? String(cartProduct.selection_price_id) : null,
        }
        console.log(product, cartProductData)
        if (_.isEqual(product, cartProductData)) {
          haveSameProduct = true
          await Cart.updateOne(
            {
              customerId: userId,
              "cartProducts._id": { $in: cartProduct._id },
            }, {
            $inc: { "cartProducts.$.quantity": req.body.product.quantity }
          }
          )
        }
      })
      if (!haveSameProduct) {
        product.quantity = req.body.product.quantity
        await Cart.updateOne(
          {
            customerId: userId,
          }, {
          $push: { cartProducts: product }
        }
        )
      }
      return res.status(200).json({
        data: {
          product: req.body.product.product_id
        },
        status: 200,
        message: "Product added to cart",
      });
    } else if (cartData) {
      product.quantity = req.body.product.quantity
      await Cart.updateOne(
        { customerId: userId },
        { $push: { cartProducts: product } }
      )
        .exec();
      return res.status(200).json({
        data: {
          product: req.body.product.product_id
        },
        status: 200,
        message: "Product added to cart",
      });
    } else {
      product.quantity = req.body.product.quantity
      let newCustomerCart = {
        _id: new mongoose.Types.ObjectId,
        business_slug: req.body.business_slug,
        customerId: userId,
        customerType: customerType,
        cartProducts: [product],
      }
      let newCustomerCartDetails = new Cart(newCustomerCart)
      newCustomerCartDetails.save()
      return res.status(200).json({
        data: {
          product: req.body.product.product_id
        },
        status: 200,
        message: "Product updated successfully",
      });
    }
  } catch (error) {
    return res.status(400).json({
      error: error.message,
      status: 400,
      message: "Something went wrong",
    });
  }
};

exports.changeQuantity = async (req, res) => {
  try {
    let { userId, cartProductId, quantity } = req.body

    await Cart.updateOne(
      {
        customerId: userId,
        "cartProducts._id": { $in: cartProductId },
      }, {
      $set: { "cartProducts.$.quantity": quantity }
    }
    )
    return res.status(200).json({
      status: 200,
      message: "Quantity updated successfully",
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
      status: 400,
      message: "Something went wrong",
    });
  }
};

exports.removeProduct = async (req, res) => {
  try {
    let { userId, cartProductId } = req.body

    let removeProduct = await Cart.updateOne(
      {
        customerId: userId,
        "cartProducts.$._id": cartProductId,
      }, {
      $pull: { "cartProducts": { _id: cartProductId } }
    }
    ).exec()
    console.log(removeProduct)
    if(removeProduct.removeProduct) {
      return res.status(200).json({
        status: 200,
        message: removeProduct.removeProduct ? "Product removed successfully": "Product not found",
      });
    } else {
      return res.status(400).json({
        status: 400,
        message: removeProduct.removeProduct ? "Product removed successfully": "Product not found",
      });
    }
  } catch (error) {
    return res.status(400).json({
      error: error.message,
      status: 400,
      message: "Something went wrong",
    });
  }
};