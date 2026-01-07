import express from 'express';
import auth from '../middleware/auth.js';
import Survey from '../models/Survey.js';
import Response from '../models/Response.js';

const router = express.Router();

// @route   POST api/surveys
// @desc    Create a survey
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { title, questions } = req.body;

        const newSurvey = new Survey({
            title,
            questions,
            user: req.user.id
        });

        const survey = await newSurvey.save();
        res.json(survey);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/surveys
// @desc    Get all surveys
// @access  Public
router.get('/', async (req, res) => {
    try {
        const surveys = await Survey.find().sort({ createdAt: -1 });
        res.json(surveys);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/surveys/my
// @desc    Get logged in user's surveys
// @access  Private
router.get('/my', auth, async (req, res) => {
    try {
        const surveys = await Survey.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(surveys);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/surveys/:id
// @desc    Get survey by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const survey = await Survey.findById(req.params.id);
        if (!survey) {
            return res.status(404).json({ msg: 'Survey not found' });
        }
        res.json(survey);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Survey not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/surveys/:id
// @desc    Delete a survey
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const survey = await Survey.findById(req.params.id);

        if (!survey) {
            return res.status(404).json({ msg: 'Survey not found' });
        }

        // Check user
        if (survey.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await survey.deleteOne(); // or remove() depending on Mongoose version

        res.json({ msg: 'Survey removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Survey not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST api/surveys/:id/responses
// @desc    Submit a response to a survey
// @access  Public (or Private options)
router.post('/:id/responses', async (req, res) => {
    try {
        const { answers } = req.body;
        // Optionally handle user if logged in
        // const userId = req.user ? req.user.id : null; 
        
        // Basic validation: check if survey exists
        const survey = await Survey.findById(req.params.id);
        if (!survey) {
            return res.status(404).json({ msg: 'Survey not found' });
        }

        const newResponse = new Response({
            survey: req.params.id,
            answers
            // user: userId
        });

        const response = await newResponse.save();
        res.json(response);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/surveys/:id/responses
// @desc    Get all responses for a survey
// @access  Private (Owner only)
router.get('/:id/responses', auth, async (req, res) => {
    try {
        const survey = await Survey.findById(req.params.id);
        if (!survey) {
            return res.status(404).json({ msg: 'Survey not found' });
        }

        // Check user
        if (survey.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const responses = await Response.find({ survey: req.params.id }).sort({ createdAt: -1 });
        res.json(responses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
