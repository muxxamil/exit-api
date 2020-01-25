'use strict';
const {
    Agent,
} = require('../models');

const ChangeDisplayOrderOfAgents = {};

ChangeDisplayOrderOfAgents.run = async () => {
    try {
        await Agent.updateDisplayOrder();
    } catch (error) {
    }
};

module.exports = ChangeDisplayOrderOfAgents;