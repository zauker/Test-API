'use strict';

const fortune = require('fortune-teller')


class Ctrl {

  constructor() {}

  getFortune(req, res) {
    res.status(200).json(fortune.fortune());
  }
}

module.exports = new Ctrl();