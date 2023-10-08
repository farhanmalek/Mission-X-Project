const express = require("express");
const router = express.Router();
const pool = require("../database")

//Create main project library route, where all projects are initially displayed
router.get('/',(req,res) => {
  pool.query("SELECT * FROM project", (err,results) => {
    if (err) throw (err);
    res.json(results)
  })
})

router.post('/filter', (req, res) => {
  //Get requests and put them in their respective arrays
  const subscription = req.body.subscription;
  const activityType = req.body.activityType;
  const subjectMatter = req.body.subjectMatter;
  const difficulty = req.body.difficulty;
  const yearLevel = req.body.yearLevel;
  const limit = req.body.limit;
  //Set up base query 
  let query = 'SELECT project_id,name,project_pic,activity_type,year_level,course,subscription,subject_matter FROM project';

  // Empty arrays that will store conditions and values
  const conditions = [];
  const values = [];
  //This is for the yearLevel
  const newCond = [];

  //Check if each filter has been passed through, ie. has the checkbox been selected.
  //If so, push the condition in the condition array and value in value array.
  //The placeholders creates a new array full of ???, it will calculates how many ? we need based on the length of the array.
  if (subscription && subscription.length > 0) {
    const placeholders = Array.from({ length: subscription.length }, () => '?').join(',');
    conditions.push(`subscription IN (${placeholders})`);
    values.push(...subscription);
  }
  if (activityType && activityType.length > 0) {
    const placeholders = Array.from({ length: activityType.length },() => '?').join(',');
    conditions.push(`activity_type IN (${placeholders})`);
    values.push(...activityType);
  }
  if (subjectMatter && subjectMatter.length > 0) {
    const placeholders = Array.from({ length: subjectMatter.length },() => '?').join(',');
    conditions.push(`subject_matter IN (${placeholders})`);
    values.push(...subjectMatter);
  }
  if (difficulty) {
    conditions.push(`course = ?`);
    values.push(difficulty);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND "); 
  }

  //Year level is done a bit differently as one project cannot have 2 year levels, we must add an OR clause, this is done at the end of the query.
  if(yearLevel && yearLevel.length > 0) { 
    const flattenedArray = [].concat.apply([], yearLevel);
    for (let i = 0; i < flattenedArray.length; i+=2) {
      newCond.push(` year_level BETWEEN ${flattenedArray[i]} AND ${flattenedArray[i+1]} `)
    }
    if (conditions.length === 0) {
      query += " WHERE " + newCond.join(" OR ");
    } else {
      query +=" AND " + newCond.join(" OR ");
    }
  }

  //Set Limitter Query
  if (Number.isInteger(limit)){
    query +=` LIMIT ${limit}`;
  } 
;
  pool.query(query, values, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

module.exports = router;
