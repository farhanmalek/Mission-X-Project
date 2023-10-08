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
  //Set up base query 
  let query = 'SELECT project_id,name,project_pic,activity_type,year_level,course,subscription,subject_matter FROM project';

  // Empty arrays that will store conditions and values
  const conditions = [];
  const values = [];
  const newCond = [];

  //Check if each filter has been passed through, ie. has the checkbox been selected.
  //If so, push the condition in the condition array and value in value array.
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

  if(yearLevel && yearLevel.length > 0) { 
    const flattenedArray = [].concat.apply([], yearLevel);
    if (conditions.length === 0) {
      for (let i = 0; i < flattenedArray.length; i+=2) {
        newCond.push(` year_level BETWEEN ${flattenedArray[i]} AND ${flattenedArray[i+1]} `)
      }
      query += " WHERE " + newCond.join(" OR ");
    } else {
      for (let i = 0; i < flattenedArray.length; i+=2) {
        newCond.push(` year_level BETWEEN ${flattenedArray[i]} AND ${flattenedArray[i+1]} `)
      }
      query +=" AND " + newCond.join(" OR ");
    }
  }
  // //If any filters have been selected and sent through, link the query up.
  // if (conditions.length > 0) {
  //   query += " WHERE " + conditions.join(" AND "); 
  // }
;
  pool.query(query, values, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

module.exports = router;
