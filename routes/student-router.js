const getStudentData = require('./student-data');
const express = require('express');
const path = require('path');
const studentRouter = express.Router();
const user = require('./data');
const axios = require("axios");
const dbConn = require('./database/db-connection');
const bodyParser = require('body-parser');
studentRouter.use(express.json());
//studentRouter.use(bodyParser)

const base = "http://set.unza.zm/api/all/courses/sis";


studentRouter.post('', async (req, res) => {
    console.log(req.body)
    const url = `http://set.unza.zm/api/all/courses/sis`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {  'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        
        if (!response.ok) {
            console.error('Failed to fetch student data:', response);
            return res.status(response.status).json({ success: false, message: 'Failed to fetch student data' });
        }

        console.log('Response received from student data API');
        const data = await response.json();
        //console.log('Received Data',data)
        res.json({ success: true, json: data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        console.error('Error fetching student data:', error);
    }    
});
studentRouter.post('/unfiltered', async (req, res) => {
    console.log(req.body)
    const url = `http://set.unza.zm/api/all/unfiltered/courses/sis`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {  'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        
        if (!response.ok) {
            console.error('Failed to fetch student data:', response);
            return res.status(response.status).json({ success: false, message: 'Failed to fetch student data' });
        }
        
        console.log('Response received from student data API');
        const data = await response.json();
        //console.log('Received Data',data)
        res.json({ success: true, json: data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        console.error('Error fetching student data:', error);
    }    
});

studentRouter.post('/test', (req, res) => {
    res.json({ success: true, json: user });
});

studentRouter.post("/student/data", async (req, res) => {
  const { username, password } = req.body;
 console.log(req.body)
  if (!username || !password) {
    return res.status(400).json({ error: "student_id and password are required" });
  }

  try {
    console.log("👉 Sending request to get courses:", { username, password });

    // Step 1: Fetch student courses
    const studentResponse = await fetch(
      base,
      { 
        method:'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password  })
      }
    );
    
    if (!studentResponse.ok) {
      throw new Error(`Failed to fetch student data: ${studentResponse.statusText}`);
    }
    const studentData = await studentResponse.json();
    console.log("✅ Successfully fetched student data:", studentData);
    const coursesWithLecturers = await Promise.all(
      studentData.courses.map(async (course) => {
        console.log(`👉 Sending request to get lecturers for course: ${course.id}`);
        try {
          const lecturerResponse = await axios.post(
            'http://set.unza.zm/api/all/course/lecturers/sis',
            { course_id: course.id },
            { headers: { "Content-Type": "application/json" } }
          );

          console.log(`✅ Lecturer API response for ${course.id}:`);

          return {
            ...course,
            lecturers: lecturerResponse.data || [],
          };
        } catch (err) {
          console.error(
            `❌ Error fetching lecturers for ${course.id}:`,
            err.response?.data || err.message
          );
          return { ...course, lecturers: [] };
        }
      })
    );
    // Step 3: Rebuild response
    const sql = 'SELECT * FROM status WHERE student_id = ?'
      dbConn.query(sql,[username],(err,result)=>{
        if(err) return res.json({error:'Error retrieving data'})
        const finalResponse = {
          student_id: studentData.comp_no,
          first_name: studentData.first_name,
          last_name: studentData.last_name,
          status:result.length===0? []:result[0],
          test:[],
          courses: coursesWithLecturers,
      };
      console.log("Final response to client:", finalResponse);
      res.json(finalResponse);
    })
    
  } catch (error) {
    console.error("❌ Error fetching student data:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch student data" });
  }
});
studentRouter.post("/student/initialize", async (req, res) => {
  console.log(req.body)
  const { student_id } = req.body;
  const sql = "INSERT IGNORE INTO status (student_id) VALUES (?)";

  try {
    dbConn.query(sql, [student_id], (err, result) => {
      if (err) {
        console.error("Error inserting student:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (result.affectedRows === 0) {
        // entry already exists
        return res.status(200).json({flag:true, message: "Student already initialized" });
      }

      res.status(201).json({ message: "Student initialized", result });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/*studentRouter.post('/student/config/set',(req, res)=>{

})*/
module.exports = studentRouter;