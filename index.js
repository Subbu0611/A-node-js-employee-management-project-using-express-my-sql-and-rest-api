const mysql= require('mysql');
const express =  require('express');
const bodyParser = require('body-parser')

var app= express();
app.use(bodyParser.json());


var mysqlConnection= mysql.createConnection({
    host:'localhost',
    user: 'root',
    password : 'password',
    database: 'EmployeeDB',
    multipleStatements: true
});

mysqlConnection.connect((err)=>{
    if(!err)
        console.log('DB connection succeded');
    else
        console.log('DB connection failed due to \n Error :  ' +JSON.stringify(err, undefined,2));
});

app.listen(3004,()=>console.log('Express server is running server 3004'));

//Get all employees
app.get('/employees',(req, res)=>{
    mysqlConnection.query('SELECT * FROM employee',(err,rows,fields)=>{
        if(!err){
            console.log(rows);
            res.send(rows);
        }else{
            console.log(err);
        }
    })
});


//Get employee using ID
app.get('/employees/:id',(req, res)=>{
    mysqlConnection.query('SELECT * FROM employee WHERE EmpID = ?',[req.params.id],(err,rows,fields)=>{
        if(!err){
            console.log(rows);
            res.send(rows);
        }else{
            console.log(err);
        }
    })
});


//Delete an employee using ID
app.delete('/employees/:id',(req, res)=>{
    mysqlConnection.query('DELETE FROM employee WHERE EmpID = ?',[req.params.id],(err,rows,fields)=>{
        if(!err){
            console.log('DELETE SUCCESSFULLY');
            res.send({status : 200, message : 'DELETE SUCCESSFULLY', data : {}});
        }else{
            console.log(err);
        }
    })
});

//InSert an employee
app.post('/employees',(req, res)=>{
    let emp =req.body;
    var sql= "SET @EmpID = ?; SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?;CALL employeeAddOrEdit(@EmpId, @Name, @EmpCode, @Salary);";

    //mysqlConnection.query()
    mysqlConnection.query(sql,[emp.EmpID, emp.Name,emp.EmpCode, emp.Salary ],(err,rows,fields)=>{
        if(!err){
            console.log('INSERTED SUCCESSFULLY');
            rows.forEach(element => {
                if(element.constructor == Array)
             res.send('inserted employee id: '+element[0].EmpID)
            });
        }else{
            console.log(err);
        }
    })
});

//IUPDATE an employee
app.put('/employees',(req, res)=>{
    let emp =req.body;
    //var sql= "SET @EmpID = ?; SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?;CALL employeeAddOrEdit(@EmpId, @Name, @EmpCode, @Salary);";

    //mysqlConnection.query(sql,[emp.EmpID, emp.Name,emp.EmpCode, emp.Salary ],(err,rows,fields)=>{
        mysqlConnection.query(`update employee set Name=?,EmpCode=?,Salary=? where EmpID=?`,[ emp.Name,emp.EmpCode, emp.Salary, emp.EmpID ],(err,rows)=>{
        if(!err){            
            res.json({status : 200, message : 'UPDATED SUCCESSFULLY', data : rows});
        }else{
            console.log(err);
        }
    })
});