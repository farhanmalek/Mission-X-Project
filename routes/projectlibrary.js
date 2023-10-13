const express = require("express");
const router = express.Router();
const pool = require("../database")

router.post('/', (req, res) => {
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
  // const newCond = [];

  //Check if each filter has been passed through, ie. has the checkbox been selected.
  //If so, push the condition in the condition array and value in value array.
  //The placeholders creates a new array full of ???, it will calculates how many ? we need based on the length of the array.
  if (subscription && subscription.length > 0) {
    const subArray = (typeof subscription === "string") ? [subscription] : subscription;
    const placeholders = Array.from({ length: subArray.length }, () => '?').join(',');
    conditions.push(`subscription IN (${placeholders})`);
    values.push(...subArray);
  }
  if (activityType && activityType.length > 0) {
    const activityArray = (typeof activityType === "string") ? [activityType] : activityType;
    const placeholders = Array.from({ length: activityArray.length },() => '?').join(',');
    conditions.push(`activity_type IN (${placeholders})`);
    values.push(...activityArray);
  }
  if (subjectMatter && subjectMatter.length > 0) {
    const subjectArray = (typeof subjectMatter === "string") ? [subjectMatter] : subjectMatter;
    const placeholders = Array.from({ length: subjectArray.length },() => '?').join(',');
    conditions.push(`subject_matter IN (${placeholders})`);
    values.push(...subjectArray);
  }
  if (difficulty) {
    conditions.push(`course = ?`);
    values.push(difficulty);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND "); 
  }

  //set last due to or condition  [[1,4],[5,6]]
  if (yearLevel && yearLevel.length > 0) {
    const flattenedArray = [].concat.apply([], yearLevel);
    const newCond = [];
  
    for (let i = 0; i < flattenedArray.length; i += 2) {
      newCond.push(` year_level BETWEEN ${flattenedArray[i]} AND ${flattenedArray[i + 1]} `);
    }
  
    if (conditions.length === 0) {
      query += " WHERE " + newCond.join(" OR ");
    } else {
      query += " AND " + newCond.join(" OR ");
    }
  }
  

//Set Limit
if (Number.isInteger(limit)) {
  query +=` LIMIT ${limit}`
}

  pool.query(query, values, (err, result) => {
    console.log(query)
    if (err) throw err;
    res.send(result);
  });
});

module.exports = router;

