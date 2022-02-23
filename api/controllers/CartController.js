const Cart = require("../models/Cart");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../config/constant");
const mongoose = require("mongoose")
const _ = require("lodash")

exports.fetchCart = async (req, res, next) => {
  try {
    let customerType = req.body.customerType;
    let userId = req.body.userId;
    let cartData,
      totalItem = 0,
      totalAmount = 0;
    if (customerType == "Registered") {
      cartData = await Cart
        .findOne({ customerId: userId, customerType: customerType })
        .exec();
    } else {
      cartData = await Cart
        .findOne({ guestId: userId, customerType: customerType })
        .exec();
    }
    if (cartData && cartData.cartProducts && cartData.cartProducts[0]) {
      await Promise.all(
        cartData.cartProducts.map(async (cartproduct, i) => {
          let product = await Product.findOne({ _id: cartproduct.product_id })
            .exec();

          let productTotal = 0;
          productTotal = product.prod_price;

          if (product.is_discountable) {
            productTotal = product.special_price;
          }
          if (
            cartproduct.product_add_ons &&
            cartproduct.product_add_ons[0] &&
            product.product_add_ons &&
            product.product_add_ons[0]
          ) {
            cartproduct.product_add_ons.map((addOn) => {
              if (addOn.options && addOn.options[0]) {
                addOn.options.map((option) => {
                  product.product_add_ons.map((addOnDb) => {
                    if (addOnDb.options && addOnDb.options[0]) {
                      addOnDb.options.map((optionDb) => {
                        if (
                          option.option_id == optionDb._id &&
                          addOn.addon_id == addOnDb._id
                        ) {
                          productTotal = productTotal + optionDb.price;
                        }
                      });
                    }
                  });
                });
              }
            });
          }
          if (
            product.selection_price_type == "selection_price" &&
            cartproduct.selection_price_id &&
            product.selected_price[0] &&
            product.selected_price
          ) {
            product.selected_price.map((selection) => {
              if (selection._id == cartproduct.selection_price_id) {
                productTotal = productTotal + selection.price;
              }
            });
          }
          totalItem = totalItem + cartproduct.quantity;
          totalAmount = totalAmount + productTotal * cartproduct.quantity;
          // return
        })
      );

      return res.status(200).json({
        data: {
          totalAmount,
          totalItem,
        },
        status: 200,
        message: "Cart fetched successfully",
      });
    } else {
      return res.status(200).json({
        data: {
          totalAmount,
          totalItem,
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
    let { customerType, userId, cartProductId, quantity } = req.body

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
    let { customerType, userId, cartProductId } = req.body

    await Cart.updateOne(
      {
        customerId: userId,
      }, {
      $pull: { "cartProducts": {_id: cartProductId }}
    }
    )
    return res.status(200).json({
      status: 200,
      message: "Product removed successfully",
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
      status: 400,
      message: "Something went wrong",
    });
  }
};