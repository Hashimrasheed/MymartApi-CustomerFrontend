const mongoose = require('mongoose');
const ProductEcom = require('../models/Product');
const ProductEcomImage = require('../models/ProductImage');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

//ADD PRODUCT
exports.addGeneral = async (req, res, next) => {
    try {
        let general = {
            name: req.body.name,
            description: req.body.description,
            product_tag: req.body.product_tag
        }
        const product = new ProductEcom({
            _id: new mongoose.Types.ObjectId,
            business_slug: req.userData.business_slug,
            general: general,
            status: false,
        });
        const result = await product.save();
        console.log(result);
        if (result) {
            return res.status(200).json({
                status_code: 200,
                data: { "product": result },
                message: "Data Saved Successfully",
            })
        } else {
            return res.status(400).json({
                status_code: 400,
                message: "Something went wrong",
            })
        }
    } catch (error) {
        return res.status(400).json({
            status_code: 400,
            message: error.message,
            errors: "Something went wrong"
        })
    }
}

exports.addModelData = async (req, res, next) => {
    let model = {
        model: req.body.model,
        lastEditAt: Date.now(),
        price: req.body.price,
        isDiscountable: req.body.isDiscountable,
        selection_price_type: req.body.selection_price_type,
    }
    if (req.body.isDiscountable === true) {
        model.discountPercentage = req.body.discountPercentage
        model.specialPrice = req.body.specialPrice
    } else {
        model.discountPercentage = null
        model.specialPrice = null
    }
    if(req.body.selection_price_type === "selection_price") {
        model.selected_price = req.body.selected_price
    } else {
        model.selected_price = []
    }
    let result = await ProductEcom.findByIdAndUpdate(req.params.productId, { $set: { model: model }});
    if (result) {
        return res.status(200).json({
            status_code: 200,
            data: { "product": result },
            message: "Data Updated Successfully",
        })
    } else {
        return res.status(400).json({
            status_code: 400,
            message: "Something went wrong",
        })
    }
}

exports.addProductLinks = async (req, res, next) => {
    console.log(req.body);
    try {
        let links = {
            categories: req.body.categories,
            related_product: req.body.related_product,
        }
        if (req.body.manufacturer) {
            links.manufacturer = req.body.manufacturer
        }
        let result = await ProductEcom.findByIdAndUpdate(req.params.productId, { $set: { links: links } }, { new: true });

        if (result) {
            return res.status(200).json({
                status_code: 200,
                data: { "product": result },
                message: "Data Updated Successfully",
            })
        } else {
            return res.status(400).json({
                status_code: 400,
                message: "Something went wrong",
            })
        }
    } catch (error) {
        return res.status(400).json({
            status_code: 400,
            message: error.message,
            errors: "Something went wrong"
        })
    }
}

//EDIT PRODUCT


exports.editGeneral = async (req, res, next) => {
    try {
        let general = {
            name: req.body.name,
            description: req.body.description,
            product_tag: req.body.product_tag
        }

        let result = await ProductEcom.findByIdAndUpdate(req.params.productId, { $set: { general: general } }, { new: true });
        if (result) {
            return res.status(200).json({
                status_code: 200,
                data: { "product": result },
                message: "Data Saved Successfully",
            })
        } else {
            return res.status(400).json({
                status_code: 400,
                message: "Something went wrong",
            })
        }
    } catch (error) {
        return res.status(400).json({
            status_code: 400,
            message: "Something went wrong",
            errors: error.message,
        })
    }
}

//UPLOAD IMAGE

const mainImage = async (Image, fileName) => {
    let Output = `main${fileName}`
    console.log(Image, fileName);
    return sharp(Image)
        // .resize({width: 500, height: 500})
        .toFile(`./public/product/${Output}`)
        .then(data => {
            data.name = Output
            return data
        });
}

const thumbnailImage = async (Image, fileName) => {
    let Output = `thumbnail${fileName}`
    return sharp(Image)
        .resize({ width: 300, height: 300 })
        .toFile(`./public/product/${Output}`)
        .then(data => {
            data.name = Output
            return data
        });
}

exports.fetch_all_images = async (req, res, next) => {

    ProductEcomImage.find({ product_id: req.params.product_id })
        .exec()
        .then(result => {
            let resultData = [];
            if (result) {
                resultData = result.map(function (item) {
                    item.thumbnail_image_url = item.thumbnail_image_url
                    item.main_image_url = item.main_image_url
                    return item;
                })
            }
            return res.status(200).json({
                status_code: 200,
                data: result.length ? resultData : [],
                message: result.length ? "Product Images fetched Successfully" : "No product image available",
            });
        })
        .catch(err => {
            return res.status(400).json({
                status_code: 400,
                message: "Something went wrong",
                error: err.message
            })
        });
}

exports.upload_image = async (req, res, next) => {

    if (!req.file) {
        return res.status(500).json({
            status_code: 500,
            message: "No Image found",
            errors: { image: 'Please add an image to upload' },
            data: {}
        })
    }
    console.log(req.file);
    let tImage = await thumbnailImage(path.join(__dirname + '../../../public/product/' + req.file.filename), req.file.filename)
    let main_image = await mainImage(path.join(__dirname + '../../../public/product/' + req.file.filename), req.file.filename)
    if(main_image.width > 2000) {
        fs.unlinkSync(`public/product/${req.file.filename}`);
        fs.unlinkSync(`public/product/${tImage.name}`);
        fs.unlinkSync(`public/product/${main_image.name}`);
        return res.status(400).json({
            status_code: 400,
            message: "Image width should be less than 2000 px",
            error: "Image width should be less than 2000 px"
        })
    }
    let productImage = new ProductEcomImage({
        _id: new mongoose.Types.ObjectId,
        product_id: req.body.product_id,
        type: req.body.type ? req.body.type : '',
        main_image: main_image.name,
        thumbnail_image: tImage.name,
        original_image: req.file.filename,
    })
    productImage.save()
        .then(result => {
            return res.status(200).json({
                status_code: 200,
                data: { "product_image": result },
                message: "Image Uploaded Successfully",
            })
        })
        .catch(err => {
            return res.status(400).json({
                status_code: 400,
                message: "Something went wrong",
                error: "Something went wrong"
            })
        })
}

exports.remove_image = async (req, res, next) => {
    const prod_id = req.params.prod_id;
    const img_id = req.params.img_id;
    //console.log(id);
    ProductEcomImage.findOne({ _id: img_id, product_id: prod_id })
        .then(productImage => {
            if (productImage) {
                ProductEcomImage.deleteOne({ _id: img_id, product_id: prod_id })
                    .exec()
                    .then(result => {
                        fs.unlinkSync(`public/product/${productImage.original_image}`);
                        fs.unlinkSync(`public/product/${productImage.main_image}`);
                        fs.unlinkSync(`public/product/${productImage.thumbnail_image}`);
                        return res.status(200).json({
                            status_code: 200,
                            data: { "product": productImage },
                            message: "Product deleted Successfully",
                        })
                    })
                    .catch(err => {
                        return res.status(400).json({
                            status_code: 400,
                            message: "Something went wrong",
                            error: err.message
                        })
                    });
            } else {
                return res.status(400).json({
                    status_code: 400,
                    message: "No result availale",
                    error: "No result availale"
                })
            }

        }).catch(err => {
            return res.status(400).json({
                status_code: 400,
                message: "Something went wrong",
                error: "Something went wrong"
            })
        })
}
