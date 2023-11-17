const { Generalinfo } = require('../models/generalinfo');
const { createGeneralinfo } = require('../models/generalinfo');

const createAdd = async (req, res) => {
    const { tnclink, pplink, contact, email } = req.body;

    try {
        const generalinfo = await createGeneralinfo({ tnclink, pplink, contact, email });
        res.status(201).json({ message: 'Generalinfo created successfully', generalinfo });
    } catch (error) {
        res.status(500).json({ message: 'Error creating generalinfo', error: error.message });
    }
};

const getAllGeneralinfos = async (req, res) => {
    try {
        const generalinfos = await Generalinfo.findAll();
        res.status(200).json({ message: 'All generalinfos retrieved successfully', generalinfos });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving generalinfos', error: error.message });
    }
};

const getGeneralinfoById = async (req, res) => {
    const { id } = req.params;

    try {
        const generalinfo = await Generalinfo.findByPk(id);
        if (!generalinfo) {
            return res.status(404).json({ message: 'Generalinfo not found' });
        }
        res.status(200).json({ message: 'Generalinfo retrieved successfully', generalinfo });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving generalinfo', error: error.message });
    }
};

const updateGeneralinfo = async (req, res) => {
    const { id } = req.params;
    const { tnclink, pplink, contact, email } = req.body;

    try {
        const generalinfo = await Generalinfo.findByPk(id);
        if (!generalinfo) {
            return res.status(404).json({ message: 'Generalinfo not found' });
        }

        generalinfo.tnclink = tnclink;
        generalinfo.pplink = pplink;
        generalinfo.contact = contact;
        generalinfo.email = email;

        await generalinfo.save();

        res.status(200).json({ message: 'Generalinfo updated successfully', generalinfo });
    } catch (error) {
        res.status(500).json({ message: 'Error updating generalinfo', error: error.message });
    }
};

module.exports = {
    createAdd,
    getAllGeneralinfos,
    getGeneralinfoById,
    updateGeneralinfo,
};
