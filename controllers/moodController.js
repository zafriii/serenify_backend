const Mood = require('../models/moodModel');

// Helper function to determine mental health status
const determineMentalHealthStatus = (moodCount) => {
    const happyCount = moodCount['happy'] || 0;
    const totalMoods = Object.values(moodCount).reduce((sum, count) => sum + count, 0);

    if (totalMoods === 0) {
        return 'Unknown'; // If no moods are recorded, return 'Unknown'
    }

    if (happyCount / totalMoods >= 0.5) {
        return 'Good';  // If at least 50% of moods are happy
    } else {
        return 'Bad';  // Otherwise, mental health status is bad
    }
};


exports.saveMood = async (req, res) => {
    try {
        const { mood } = req.body;

        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: 'User not authenticated' });
        }

        if (!mood) {
            return res.status(400).json({ message: 'Mood is required' });
        }

        if (!['happy', 'sad', 'angry', 'depressed', 'frustrated', 'heartbroken'].includes(mood)) {
            return res.status(400).json({ message: 'Invalid mood' });
        }

        // Save the mood for the logged-in user
        const newMood = new Mood({ user: req.user.id, mood });
        await newMood.save();

        // Fetch updated mood count
        const moods = await Mood.find({ user: req.user.id });
        const moodCount = moods.reduce((counts, moodRecord) => {
            counts[moodRecord.mood] = (counts[moodRecord.mood] || 0) + 1;
            return counts;
        }, {});

        const mentalHealthStatus = determineMentalHealthStatus(moodCount);

        res.status(201).json({ message: 'Mood saved successfully', moodCount, mentalHealthStatus });
    } catch (error) {
        console.error('Error saving mood:', error);
        res.status(500).json({ message: 'Error saving mood', error });
    }
};




exports.getMoodHistory = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: 'User not authenticated' });
        }

        const moods = await Mood.find({ user: req.user.id });

        if (!moods || moods.length === 0) {
            return res.status(404).json({ message: 'No mood history found for this user' });
        }

        const moodCount = moods.reduce((counts, moodRecord) => {
            counts[moodRecord.mood] = (counts[moodRecord.mood] || 0) + 1;
            return counts;
        }, {});

        const mentalHealthStatus = determineMentalHealthStatus(moodCount);

        res.status(200).json({ moodCount, mentalHealthStatus });
    } catch (error) {
        console.error('Error fetching mood history:', error);
        res.status(500).json({ message: 'Error fetching mood history', error });
    }
};
