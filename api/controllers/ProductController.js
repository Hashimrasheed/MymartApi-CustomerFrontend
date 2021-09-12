const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require('../models/User')
const Setting = require('../models/Setting')
const customer = require("../models/Customer")
const ProductImage = require("../models/ProductImage");
const configuration = require("../config/constant");
const fs = require('fs');


let productImage = async (product_id) => {
    image = await ProductImage.findOne({ product_id: product_id, type: "main" })
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

exports.fetch_all = async (req, res, next) => {
    try {
        let seller = await User.findOne({ business_slug: req.query.business_slug })
        if (req.query.id) {
            var { status } = await customer.findById(req.query.id)
        }
        const currentDate = new Date()
        let expiryDate = new Date(seller.expiryDate)
        if ((currentDate > expiryDate)) {
            await Setting.findOneAndUpdate(
                {
                    business_slug: req.query.business_slug,
                },
                { $set: { plan_expired: true } },
                {
                    upsert: true, new: true, setDefaultsOnInsert: true
                }
            ).exec()
        } else {
            await Setting.findOneAndUpdate(
                {
                    business_slug: req.query.business_slug,
                },
                { $set: { plan_expired: false } },
                {
                    upsert: true, new: true, setDefaultsOnInsert: true
                }
            ).exec()
        }
        let categories = await Category.find({
            business_slug: req.query.business_slug,
            display_home: true,
            status: true,
        }).sort({ order_no: 1 });
        let products = await Promise.all(
            categories.map(async (category, index) => {
                let result = {};
                let product = await getCategoryProduct(category._id);
                result.category = category.cat_name;
                result.categoryId = category._id;
                result.product = product;
                return result;
            })
        );
        return res.status(200).json({
            status_code: 200,
            data: products,
            customerStatus: status === undefined ? true : status,
            message: products.length
                ? "Product fetched Successfully"
                : "No Match Found",
        });
    } catch (err) {
        return res.status(400).json({
            status_code: 400,
            message: err.message,
            error: "Something went wrong",
        });
    }
};

exports.searchProducts = async (req, res, next) => {
    try {
        let matchParameter = {
            business_slug: req.query.business_slug,
            status: true,
            $text: { $search: req.query.search },
        };
        let sort = req.query.sortBy ? req.query.sortBy : 1
        const products = await Product.find(matchParameter)
            .select(
                "general.name general.description model.quantity model.model model.price model.isDiscountable model.discountPercentage model.specialPrice links status options download_link productType _id"
            )
            .populate({ path: "links.manufacturer", select: "name" })
            .populate({ path: "links.categories", select: "cat_name" })
            .sort({ "model.price": sort })
            .limit(parseInt(10))
            .exec();
        let product = await Promise.all(
            products.map(async (result) => {
                let haveDiscount = false
                if (result.options[0]) {
                    result.options.map((data) => {
                        data.varients.map((val) => {
                            if (val.isDiscountable) {
                                haveDiscount = true
                            }
                        })
                    })
                }
                let isDiscountable = result.model ? result.model.isDiscountable : "";
                let discountPercentage = result.model ? result.model.discountPercentage : "";
                let specialPrice = result.model ? result.model.specialPrice : "";
                let prod_price = result.model ? result.model.price : "";
                if (result.options.length) {
                    prod_price = ""
                }
                return {
                    product_name: result.general.name,
                    product_descripton: result.general.description,
                    prod_price: prod_price,
                    haveDiscount,
                    isDiscountable,
                    discountPercentage,
                    specialPrice,
                    quantity: result.model ? result.model.quantity : "",
                    model: result.model ? result.model.model : "",
                    manufacturer: result.links ? result.links.manufacturer.name : "",
                    status: result.status,
                    categories:
                        result.links &&
                            result.links.categories &&
                            result.links.categories.length
                            ? result.links.categories
                            : "",
                    image: await productImage(result._id),
                    _id: result._id,
                    download_link: result.download_link,
                    productType: result.productType,
                    product_link: result.product_link
                };
            })
        );
        return res.status(200).json({
            status_code: 200,
            data: { products: product },
            message: "Product fetched Successfully",
        });
    } catch (error) {
        return res.status(400).json({
            status_code: 400,
            message: error.message,
            error: "Something went wrong",
        });
    }
};

exports.getAllProducts = async (req, res, next) => {
    if (req.query.sortBy) {
        sortCondition = { "model.price": req.query.sortBy };
    } else {
        sortCondition = { created: -1 };
    }
    try {
        const products = await Product.find({
            business_slug: req.query.business_slug,
            status: true,
        })
            .select(
                "general.name productType general.description model.quantity model.model model.price model.isDiscountable model.discountPercentage model.specialPrice links options status _id"
            )
            .populate({ path: "links.manufacturer", select: "name" })
            .populate({ path: "links.categories", select: "cat_name" })
            .sort(sortCondition)
            .exec();

        let product = await Promise.all(
            products.map(async (result) => {
                let haveDiscount = false
                if (result.options[0]) {
                    result.options.map((data) => {
                        data.varients.map((val) => {
                            if (val.isDiscountable) {
                                haveDiscount = true
                            }
                        })
                    })
                }

                let prod_price = result.model ? result.model.price : "";
                let isDiscountable = result.model ? result.model.isDiscountable : "";
                let discountPercentage = result.model ? result.model.discountPercentage : "";
                let specialPrice = result.model ? result.model.specialPrice : "";
                return {
                    product_name: result.general.name,
                    product_descripton: result.general.description,
                    prod_price: prod_price,
                    isDiscountable,
                    discountPercentage,
                    specialPrice,
                    haveDiscount,
                    productType: result.productType ? result.productType : '',
                    model: result.model ? result.model.model : "",
                    quantity: result.model ? result.model.quantity : "",
                    manufacturer: result.links && result.links.manufacturer ? result.links.manufacturer.name : "",
                    status: result.status,
                    options: result.options.length > 0 ? true : false,
                    categories:
                        result.links &&
                            result.links.categories &&
                            result.links.categories.length
                            ? result.links.categories
                            : "",
                    image: await productImage(result._id),
                    _id: result._id,
                };
            })
        );
        return res.status(200).json({
            status_code: 200,
            data: product,
            message: "Product fetched Successfully",
        });
    } catch (error) {
        return res.status(400).json({
            status_code: 400,
            message: error.message,
            error: "Something went wrong",
        });
    }

};

exports.fetchProductByCategory = async (req, res, next) => {
    try {
        let products = await getCategoryProduct(req.params.catId);
        let category = await Category.findById(req.params.catId);
        let result = {}
        result.category = category.cat_name;
        result.categoryId = category._id;
        result.product = products;
        result.seo = category.seo
        return res.status(200).json({
            status_code: 200,
            data: { products: result },
            message: "Product fetched Successfully",
        });
    } catch (error) {
        return res.status(400).json({
            status_code: 400,
            message: error.message,
            error: "Something went wrong",
        });
    }
};

exports.fetchSingleProduct = async (req, res, next) => {
    try {
        const result = await Product.findOne({
            _id: req.params.productId,
            status: true,
        })
            .select("general model Specification links seo status download_link productType _id")
            .populate({ path: "links.manufacturer", select: "name" })
            .populate({ path: "links.categories", select: "cat_name" })
            .exec();
        if (result) {
            const product = {
                product: result,
                product_link: result.product_link,
                image: await allProductImage(result._id),
                _id: result._id,
                relatedProducts: await getRelatedProduct(result.links.related_product),
            };
            return res.status(200).json({
                status_code: 200,
                data: product,
                message: "Product fetched Successfully",
            });
        } else {
            return res.status(400).json({
                status_code: 400,
                message: "Product no longer available",
                error: "Product no longer available",
            });
        }
    } catch (error) {
        return res.status(400).json({
            status_code: 400,
            message: error.message,
            error: "Something went wrong",
        });
    }
};

let allProductImage = async (product_id) => {
    const images = await ProductImage.find({ product_id: product_id })
        .select(
            "main_image thumbnail_image main_image_url thumbnail_image_url type"
        )
        .sort({ type: 1 })
        .exec();
    return images;
}

let getCategoryProduct = async (categoryId) => {
    let products = await Product.find({
        "links.categories": { $in: categoryId },
        status: true,
    })
        .select(
            "general.name general.description model.quantity model.model model.price model.isDiscountable model.discountPercentage model.specialPrice links status download_link productType _id order_no"
        )
        .populate({ path: "links.manufacturer", select: "name" })
        .populate({ path: "links.categories", select: "cat_name" })
        .sort({order_no: 1})
        .exec();
        console.log("seller",products);

    let product = await Promise.all(
        products.map(async (result) => {
            let prod_price = result.model ? result.model.price : "";
            let isDiscountable = result.model ? result.model.isDiscountable : "";
            let discountPercentage = result.model ? result.model.discountPercentage : "";
            let specialPrice = result.model ? result.model.specialPrice : "";
            let haveDiscount = false
            if (result.product_add_ons[0]) {
                result.product_add_ons.map((data) => {
                    data.varients.map((val) => {
                        if (val.isDiscountable) {
                            haveDiscount = true
                        }
                    })
                })
            }
            return {
                product_name: result.general.name,
                product_descripton: result.general.description,
                prod_price: prod_price,
                isDiscountable: isDiscountable,
                haveDiscount: haveDiscount,
                discountPercentage: discountPercentage,
                specialPrice: specialPrice,
                options: result.options.length > 0 ? true : false,
                model: result.model ? result.model.model : "",
                quantity: result.model ? result.model.quantity : "",
                manufacturer: result.links && result.links.manufacturer ? result.links.manufacturer.name : "",
                status: result.status,
                quantity: result.model.quantity ? result.model.quantity : "",
                categories:
                    result.links &&
                        result.links.categories &&
                        result.links.categories.length
                        ? result.links.categories
                        : "",
                image: await productImage(result._id),
                _id: result._id,
                productType: result.productType,
                product_link: result.product_link,
            };
        })
    );
    return product;
};

let getRelatedProduct = async (productIds, locale) => {
    // Product.setDefaultLanguage(locale);
    // console.log()
    const products = await Product.find({
        _id: { $in: productIds },
        status: true,
    })
        .populate("links.manufacturer")
        .select(
            "general.name model.model options model.price model.isDiscountable model.quantity links model.specialPrice model.discountPercentage _id"
        )
        .sort({ created: -1 })
        .limit(parseInt(10))
        .exec();

    let product = await Promise.all(
        products.map(async (result) => {
            let haveDiscount = false
            if (result.options) {
                await result.options.map(async (data) => {
                    await data.varients.map((val) => {
                        if (val.isDiscountable) {
                            haveDiscount = true
                        }
                    })
                })
            }
            return {
                product_name: result.general.name,
                prod_price: result.model ? result.model.price : "",
                isDiscountable: result.model ? result.model.isDiscountable : false,
                specialPrice: result.model ? result.model.specialPrice : "",
                discountPercentage: result.model ? result.model.discountPercentage : "",
                manufacturer: result.links.manufacturer ? result.links.manufacturer.name : "",
                haveDiscount,
                quantity: result.model ? result.model.quantity : "",
                options: result.options,
                image: await productImage(result._id),
                _id: result._id,
            };
        })
    );
    return product;
};
