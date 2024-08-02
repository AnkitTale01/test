const planModel = require('../models/planModel');

const planList = async (req, res) => {
    try {
        let limit = req.query.limit ? req.query.limit : 10;
        let search = req.query.q;
        let q = {}
        if (search) {
            let or = [];
            or[0] = { name: { $regex: search, $options: "i" } }
            q.$or = or;
        }
        let records = await planModel.count(q);
        var page = req.query.page
        if (page == 0) {
            page = 1
        }
        let result = await planModel.find(q).select({ __v: 0 }).sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit).exec();

        if (result) {
            return res.status(200).send({ status: 1, message: "success", data: { totalPlan: records, page: page, result } })
        } else {
            return res.status(500).send({ status: 0, message: "Something went wrong !!!" })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const createPlan = async (req, res) => {
    try {
        let data = req.body;
        let { icon, name, price, validity, features, discounted_price } = data
        if (!name) { return res.status(200).send({ message: 'please enter a plan Name' }) }
        if (!price) { return res.status(200).send({ message: 'please enter a price' }) }
        let obj = {
            icon: icon,
            name: name,
            features: features,
            price: price,
            discounted_price: discounted_price,
            validity: validity
        }
        let plan = await planModel.create(obj)

        return res.status(200).send({ status: 1, message: "Successfully create", data: plan })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const updatePlan = async (req, res) => {
    try {
        let data = req.body;

        let { id, icon, name, price, validity, features, discounted_price } = data
        if (!id) {
            return res.status(400).send({ status: 0, message: "Please enter plan Id!" })
        }
        let obj = {}
        if (icon) { obj.icon = icon }
        if (name) { obj.name = name }
        if (price) { obj.price = price }
        if (validity) { obj.validity = validity }
        if (features) { obj.features = features }
        if (discounted_price) { obj.discounted_price = discounted_price }

        let updatePlan = await planModel.findByIdAndUpdate(id, obj, { new: true })

        return res.status(200).send({ status: 1, message: "Successfully update plan!", data: updatePlan })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const deletePlan = async (req, res) => {
    try {
        const data = req.body
        const { id } = data

        if (!id) {
            return res.status(200).send({ status: 0, message: "id is required" })
        }

        let response = await planModel.findByIdAndDelete(id);

        if (response) {
            return res.status(201).send({ status: 1, message: "Successfully deleted", data: response })
        } else {
            return res.status(500).send({ status: 0, message: "Something went wrong !!!" })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", body: null })
    }
}

const changePlanStatus = async (req, res) => {
    try {
        const data = req.body
        const { id, is_active } = data

        if (!id) {
            return res.status(200).send({ status: 0, message: "id is required!" })
        }
        let obj = {
            is_active: is_active
        }
        let update = await planModel.findByIdAndUpdate(id, obj, { new: true });
        if (update) {
            let stts = update.is_active

            if (stts == true) {
                return res.status(200).send({ status: 1, message: "plan actived!" })
            } else {
                return res.status(200).send({ status: 1, message: "plan deactived!" })
            }
        }
        //else {
        //     return res.status(500).send({ status: 0, message: "Something went wrong !!!" })
        // }

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", body: null })
    }
}

module.exports = { createPlan, updatePlan, deletePlan, planList, changePlanStatus }