const mongoose = require('mongoose');
const CustomerAddress = require('../models/CustomerAddress');

exports.saveAddress = async (req, res, next) => {
    if (!req.isAuth) {
        throw new Error('Token missing or mismatch error')
    }
    try {
        console.log(req.customerData)
        const addressCount = await CustomerAddress.countDocuments({
            customer_id: req.customerData.userId,
            isDefault: true
        });

        console.log(addressCount);
        customerAddress = new CustomerAddress({
            _id: new mongoose.Types.ObjectId,
            customer_id: req.customerData.userId,
            business_slug: req.customerData.business_slug,
            isDefault: addressCount > 0 ? false : true,
            deliverable: true,
            ...req.body
        })
        customerAddress.populate('deliveryArea')
        customerAddress.populate('countries')
        customerAddress.populate('governorates')
            .execPopulate();
        result = await customerAddress.save();
        let responseData = await CustomerAddress.findOne({ _id: result.id })
            .populate('deliveryArea')
            .populate('countries')
            .populate('governorates')
            .exec()
        console.log("one", responseData);
        console.log("two", result._doc);
        return res.status(200).json({
            data: responseData,
            // data: { ...result._doc, _id: result.id },
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
}

exports.fetch_all_address = async (req, res, next) => {
    try {
        const result = await CustomerAddress.find({ customer_id: req.customerData.userId })
            .populate('countries')
            .populate('governorates')
            .populate({ path: 'deliveryArea', populate: { path: 'country_id', select: 'name' } })
            .populate({ path: 'deliveryArea', populate: { path: 'governorate_id', select: 'name' } })
            .sort({ address_type: -1 });
        await result.map((addr) => {
            if ((addr.deliveryArea && addr.deliveryArea.status)) {
                if (addr.countries && addr.countries.status && addr.governorates && addr.governorates.status) {
                    addr.deliverable = true
                }
            }
        })
        return res.status(200).json({
            data: result,
            status: 200,
            message: "Address fetched Successfully",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            error: error.message,
            message: "Something went wrong",
        });
    }
}

exports.mark_default_address = async (req, res, next) => {
    try {
        await CustomerAddress.updateMany(
            { customer_id: req.customerData.userId },
            { $set: { isDefault: false } },
            { multi: true }
        );
        console.log(req.customerData, req.body);
        await CustomerAddress.findOneAndUpdate(
            { customer_id: req.customerData.userId, _id: req.body.id },
            { $set: { isDefault: true } }, { new: true }
        );
        // res.send(result);
        const result = await CustomerAddress.find({ customer_id: req.customerData.userId })
            .populate('countries')
            .populate('governorates')
            .populate({ path: 'deliveryArea', populate: { path: 'country_id', select: 'name' } })
            .populate({ path: 'deliveryArea', populate: { path: 'governorate_id', select: 'name' } })
            .sort({ address_type: -1 });
        await result.map((addr) => {
            if ((addr.deliveryArea && addr.deliveryArea.status)) {
                if (addr.countries && addr.countries.status && addr.governorates && addr.governorates.status) {
                    addr.deliverable = true
                }
            }
        })
        return res.status(200).json({
            data: result,
            status: 200,
            message: "Address Marked As Default Successfully",
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            status: 500,
            error: error.message,
            message: "Something went wrong",
        });
    }
}

exports.fetch_default_address = async (req, res, next) => {
    try {
        let result = await CustomerAddress.find({ customer_id: req.customerData.userId, isDefault: true })
            .populate({ path: "deliveryArea", populate: { path: 'country_id', select: 'name' } })
            .populate({ path: "deliveryArea", populate: { path: 'governorate_id', select: 'name' } })
            .sort({ address_type: -1 });
        return res.status(200).json({
            data: result,
            status: 200,
            message: "Default Address Fetch Successfully",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            error: error.message,
            message: "Something went wrong",
        });
    }
}

exports.deleteAddress = async (req, res, next) => {

    try {
        console.log(req.query);
        let address = await CustomerAddress.findOne({ _id: req.params.addressId });
        if (address) {
            if (address.isDefault) {
                return res.status(400).json({
                    status: 400,
                    error: "Default address can't be deleted",
                    message: "Default address can't be deleted",
                });
            } else {
                result = await CustomerAddress.remove({ _id: req.params.addressId }).exec();
                if (result) {
                    return res.status(200).json({
                        status_code: 200,
                        data: { "address": address },
                        message: "Address deleted successfully",
                    })
                } else {
                    return res.status(500).json({
                        status: 500,
                        error: "Something went wrong",
                        message: "Something went wrong",
                    });
                }
            }
        }
    } catch (err) {
        return res.status(500).json({
            status: 500,
            error: err.message,
            message: "Something went wrong",
        });
    }
}

exports.editAddress = async (req, res, next) => {

    try {
        let updatedVal = { ...req.body }
        if (updatedVal.address_type == 'home') {
            updatedVal.office_no = null
            updatedVal.building_no = null
            updatedVal.floor_no = null
            updatedVal.flat_no = null
            updatedVal.apartment_no = null
        }
        if (updatedVal.address_type == 'apartnment' || updatedVal.address_type == 'apartment') {
            updatedVal.house_no = null
            updatedVal.office_no = null
        }
        if (updatedVal.address_type == 'office') {
            updatedVal.house_no = null
            updatedVal.apartment_no = null
        }
        result = await CustomerAddress.findOneAndUpdate({ _id: req.params.addressId }, { $set: updatedVal }, { new: true });
        if (result) {
            return res.status(200).json({
                data: { ...result._doc, _id: result.id },
                status: 200,
                message: "Address Updated Successfully",
            });
        } else {
            return res.status(400).json({
                status: 400,
                error: err.message,
                message: "Something went wrong",
            });
        }
    } catch (err) {
        return res.status(400).json({
            status: 400,
            error: err.message,
            message: "Something went wrong",
        });
    }
}

exports.saveDefaultAddress = async (req, res, next) => {
    // if (!req.isAuth) {
    //     throw new Error('Token missing or mismatch error')
    // }
    const session = await mongoose.startSession();
    session.startTransaction();
    try {

        let result = await CustomerAddress.updateMany({ customer_id: req.customerData.userId }, { $set: { isDefault: false } }, { new: true });
        customerAddress = new CustomerAddress({
            _id: new mongoose.Types.ObjectId,
            customer_id: req.customerData.userId,
            business_slug: req.customer.business_slug,
            isDefault: true,
            ...req.body
        })
        result = await customerAddress.save();
        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({
            data: { ...result._doc, _id: result.id },
            status: 200,
            message: "Address Saved Successfully",
        });

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({
            status: 500,
            error: err.message,
            message: "Something went wrong",
        });
    }
}

