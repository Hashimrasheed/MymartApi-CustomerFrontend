const mongoose = require("mongoose");
let Schema = mongoose.Schema;

const AddOns = {
  addon_id: { type: mongoose.Schema.Types.ObjectId },
  type: { type: String, enum: ["single", "multiple"] },
  options: [{ type: mongoose.Schema.Types.ObjectId }],
};

const cartProduct = new Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId },
  selection_type: { type: String, enum: ["normal", "selection_price"] },
  selection_price_id: { type: mongoose.Schema.Types.ObjectId },
  quantity: { type: Number },
  // removables: [{ type: mongoose.Schema.Types.ObjectId }],
  // product_add_ons: [AddOns],
});

const CartProductSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    customerType: { type: String, enum: ["Guest", "Registered"] },
    business_slug: { type: String },
    cartProducts: [cartProduct],
  },
  { timestamps: true }
);

module.exports = mongoose.models.Cart || mongoose.model("Cart", CartProductSchema);