exports.UpdateSettingRequest = async (req, res, next) => {
    req.body = JSON.parse(JSON.stringify(req.body))
    let messages = {
        store_name: "", //Required
        tag_line: "", //Required
        address: {
            address_line1: "", //Required
            address_line2: "", //Optional
            landmark: "", //Optional
            city: "", //Required
            state: "", //Required
            country: "", //Required
            zipcode: "", //Optional
            status: "", //Required
        },
        store_publish: false, //Required
        email: "",  //Required
        contact_no: "",   //Required
        delivery: '',
    }
    let requiredThings = []
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res.status(500).json({
            status_code: 500,
            message: "Request body can't be empty",
            errors: "Request body can't be empty",
            data: {}
        })
    }
    flag = true;

    if (req.body.store_publish) {

        if (!req.body.store_name) {
            flag = false
            messages.store_name = "Store Name field is required"
            requiredThings.push("Store Name")
        }

        if (!req.body.email) {
            flag = false
            messages.email = "Store Email is required"
            requiredThings.push("email")
        }

        if (!req.body.contact_no) {
            flag = false
            messages.contact_no = "Store Contact No is required"
            requiredThings.push("Store Contact")
        }

        if (!req.body.status) {
            flag = false
            messages.status = "Store Status Field is required"
            requiredThings.push("Status")
        }

        if (!req.body.store_publish.toString()) {
            flag = false
            messages.store_publish = "Store Contact No is required"
            requiredThings.push("Store Publish")
        }
    }

    if (!flag) {
        return res.status(500).json({
            status_code: 500,
            message: "Errors",
            errors: {messages, requiredThings},
            data: {}
        })
    }

    next();
}
