const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        trim: true,
        match: [
            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            'Please enter a valid email'
        ]
    },
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    password: {
        type: String,
        required: true
    },
    photoURL: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

    // Video Conferencing Specific Fields
    recentMeetings: [
        {
            meetingId: { type: String, required: true },
            joinedAt: { type: Date, default: Date.now },
            duration: { type: Number, default: 0 } // in minutes
        }
    ],
    contacts: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            addedAt: { type: Date, default: Date.now }
        }
    ],
    meetingPreferences: {
        micMuted: { type: Boolean, default: true },
        cameraOn: { type: Boolean, default: false },
        preferredLayout: {
            type: String,
            enum: ['grid', 'speaker'],
            default: 'grid'
        },
        virtualBackground: { type: String, default: '' }
    },

    // Analytics & Activity
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    totalMeetingsHosted: {
        type: Number,
        default: 0
    },
    totalMeetingsJoined: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
});

// // Indexes for better querying
// userSchema.index({ email: 1 });
// userSchema.index({ 'badges.key': 1 });

module.exports = mongoose.model('User', userSchema);
