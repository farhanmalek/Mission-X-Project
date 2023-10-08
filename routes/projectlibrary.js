const express = require("express");
const router = express.Router();
const pool = require("../database")

//Create main project library route, where all projects are initially displayed


router.get('/get-projects', (req, res) => {
  //Get requests and put them in their respective arrays
  const subscription = req.query.subscription;
  const activityType = req.query.activityType;
  const subjectMatter = req.query.subjectMatter;
  const difficulty = req.query.difficulty;
  const yearLevel = req.query.yearLevel;
  const limit = req.query.limit;

  console.log(subscription,activityType,subjectMatter,yearLevel,limit,difficulty)
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

  //Year level is done a bit differently as one project cannot have 2 year levels, we must add an OR clause, this is done at the end of the query.
  if(yearLevel && yearLevel.length > 0) {  
    console.log(yearLevel)
    const yearArray = (typeof yearLevel === "string") ? [yearLevel] : yearLevel;
    // const flattenedArray = [].concat.apply([], yearArray);
    const flattenedArray = yearArray.map((year)=> {
      return year.split(",")
    })

    for (let i = 0; i < flattenedArray.length; i++) {
      newCond.push(` year_level BETWEEN ${flattenedArray[i][0]} AND ${flattenedArray[i][1]} `)
    }
    if (conditions.length === 0) {
      query += " WHERE " + newCond.join(" OR ");
    } else {
      query +=" AND " + newCond.join(" OR ");
    }
  }

  //Set Limitter Query
  if (parseInt(limit)){
    query +=` LIMIT ${limit}`;
  } 
;

  pool.query(query, values, (err, result) => {
    console.log(query)
    if (err) throw err;
    res.send(result);
  });
});

module.exports = router;

