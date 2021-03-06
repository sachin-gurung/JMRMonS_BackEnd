const { Monster } = require("../models/monster.js");
//Controller functions to get data from the models, return it, and display it

// get all monsters
function index(req, res) {
  Monster.find({})
    .then((monster) => {
      res.status(200).json(monster);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
}
// get individual Monsters by Id
function show(req, res) {
  Monster.findById(req.params.id)
    .then((monster) => res.status(200).json(monster))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
}
// Update or change individual monster by id
function update(req, res) {
  Monster.findByIdAndUpdate(req.params.id, req.body, { new: true })
    //.then((monster) => res.status(200).json(monster))
    .then(
      res.redirect("https://mosserryan.github.io/JMRmonS_FrontEnd/monsters")
    )
    .catch((err) => {
      console.log(req.body);
      console.log(err);
      res.status(500).json(err);
    });
}
// delete individual monster by id
function deleteMonster(req, res) {
  Monster.findByIdAndDelete(req.params.id)
    .then(
      res.redirect("https://mosserryan.github.io/JMRmonS_FrontEnd/monsters")
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
}
// create monster method
function create(req, res) {
  Monster.create(req.body)
    .then(
      res.redirect("https://mosserryan.github.io/JMRmonS_FrontEnd/monsters")
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
}
// find monster by querying option 1
function search(req, res) {
  Monster.find({ name: { $regex: req.params.search, $options: "i" } })
    .then((monster) => res.status(200).json(monster))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
}

module.exports = { index, create, deleteMonster, update, show, search };
