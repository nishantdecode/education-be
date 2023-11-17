const { FAQ } = require('../models/index');

exports.getFaqs = async (req, res, next) => {
    try {
        const faq = await FAQ.find();
        if (faq)
            res.json(faq);
        else
            res.status(404).json({ error: 'No FAQS Found right now!' });
    } catch (error) {
        next(error);
    }
};

exports.getFaq = async (req, res, next) => {
    try {
        const faq = await FAQ.findById(req.params.id);
        if (faq)
            res.json(faq);
        else
            res.status(404).json({ error: 'No FAQ Found!' });
    } catch (error) {
        next(error);
    }
};

exports.createFaq = async (req, res, next) => {
    try {
        const faq = new FAQ({
            Question: req.body.Question,
            Answer: req.body.Answer
        });
        await faq.save();
        res.json(faq);
    } catch (error) {
        next(error);
    }
};

exports.updateFaq = async (req, res, next) => {
    try {
        const existingfaq = await FAQ.findById(req.params.id);
        if (existingfaq) {
            existingfaq.Question = req.body.Question || existingfaq.Question;
            existingfaq.Answer = req.body.Answer || existingfaq.Answer;
            await existingfaq.save();
            res.json({ message: 'FAQ updated successfully', existingfaq });
        }
        else {
            res.status(404).json({ error: 'Faq not found' });
        }
    } catch (error) {
        next(error);
    }
};

exports.deleteFaq = async (req, res, next) => {
    try {
        const faq = await FAQ.findById(req.params.id);
        if (faq) {
            await FAQ.findByIdAndDelete(req.params.id);
            res.json({ message: 'FAQ deleted successfully' });
        }
        else
            res.status(404).json({ error: 'No FAQ found!' });
    } catch (error) {
        next(error);
    }
};


