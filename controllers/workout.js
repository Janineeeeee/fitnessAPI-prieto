const Workout = require('../models/Workout');
const auth = require("../auth");

module.exports.addWorkout = (req, res) => {
    const { name, duration } = req.body;
    const userId = req.user.id;

    let newWorkout = new Workout({
        userId: userId,
        name: name,
        duration: duration
    });

    Workout.findOne({ userId: userId, name: name })
        .then(existingWorkout => {
            if (existingWorkout) {
                return res.status(409).send({ message: 'Workout Already Exists' });
            }
            return newWorkout.save();
        })
        .then(workout => res.status(201).send(workout))
        .catch(error => {
            return res.status(500).send({ message: 'An error occurred', error: error.message });
        });
};


module.exports.getMyWorkouts = (req, res) => {

	const userId = req.user.id;

	return Workout.find({userId})
    .then(workouts => {
        if(workouts.length > 0){
            return res.status(200).send({workouts: workouts});
        }
        else{
            return res.status(404).send({message: 'No Workouts Found'});
        }
    })
    .catch(error => {
            return res.status(500).send({ message: 'An error occurred', error: error.message });
        });
}

module.exports.updateWorkout = (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    let updatedWorkout = {
        name: req.body.name,
        duration: req.body.duration,
    };

    return Workout.findOneAndUpdate({ _id: id, userId }, updatedWorkout, { new: true })
        .then(workout => {
            if (workout) {
                res.status(200).send({ message: 'Workout updated successfully', updatedWorkout: workout });
            } else {
                res.status(404).send({ message: 'Workout not found' });
            }
        })
        .catch(error => {
            return res.status(500).send({ message: 'An error occurred', error: error.message });
        });
};


module.exports.deleteWorkout = (req, res) => {
    const userId = req.user.id;

    return Workout.findOneAndDelete({ _id: req.params.id, userId })
        .then(workout => {
            if (workout) {
                return res.status(200).send({ message: 'Workout deleted successfully' });
            } else {
                return res.status(404).send({ message: 'Workout not found' });
            }
        })
        .catch(error => {
            return res.status(500).send({ message: 'An error occurred', error: error.message });
        });
};


module.exports.completeWorkoutStatus = (req, res) => {
    const userId = req.user.id;

    Workout.findOne({ _id: req.params.id, userId })
        .then(workout => {
            if (!workout) {
                return res.status(404).send({ message: 'Workout not found' });
            }

            if (workout.status === 'completed') {
                return res.status(200).send({ message: 'Workout is already in completed status' });
            }

            workout.status = 'completed';
            return workout.save();
        })
        .then(updatedWorkout => {
            return res.status(200).send({
                message: 'Workout status updated successfully',
                updatedWorkout: updatedWorkout
            });
        })
        .catch(error => {
            return res.status(500).send({ message: 'An error occurred', error: error.message });
        });
};





