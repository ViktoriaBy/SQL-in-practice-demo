//DEFINING HANDLERFUNCTIONS IN CONTROLLER.JS

const { CONNECTION_STRING } = process.env; //CONNECTION TO OUR DB
const Sequelize = require('sequelize');


const sequelize = new Sequelize(CONNECTION_STRING, {
 dialect: 'postgres',
 dialectOptions: {
     ssl: {
         rejectUnauthorized: false
     }
 }
})

//MIMIC USER IS LOGGED IN
const userId = 4;
const clientId = 3;


//MODULE EXPORTS IS HOUSING ALL ENDPOINTS
module.exports = {
getUserInfo: (req, res) => {
//RUN FIRST QUERY 
    sequelize.query(`
    SELECT * FROM cc_clients AS c
    JOIN cc_users AS u
    ON c.user_id = u.user_id
    WHERE u.user_id = ${userId};
   
    `)
    .then(dbRes => {
        // console.log(dbRes[0]); //GETTING BACK USERS INFO, CLIENT_ID=3, USER_ID=4
        res.status(200).send(dbRes[0])
    })
    .catch(e =>console.log(e));
},
updateUserInfo: (req, res) => {
    const { firstName, lastName, phoneNumber, email, address, city, state, zipCode} = req.body;
    sequelize.query(`
    UPDATE cc_users
    SET first_name = '${firstName}',
    last_name = '${lastName}',
    email ='${email}',
    phone_number = '${phoneNumber}'
    WHERE user_id = '${userId}';
    
    UPDATE cc_clients
    SET address = '${address}',
    state = '${state}',
    city = '${city}',
    zip_code = '${zipCode}'
    WHERE user_id = '${userId}';
    `)
    .then(() => res.sendStatus(200))
    .catch(e => console.log(e))
},
getUserAppt: (req, res) =>{
sequelize.query(`
    SELECT * FROM cc_appointments
    WHERE client_id = ${clientId}
    ORDER BY date ASC;
`)
    .then(dbRes => res.status(200).send(dbRes[0]))
    .catch(e => console.log(e))
},
requestAppointment: (req, res) => {
    const {date, service} = req.body 

    sequelize.query(`insert into cc_appointments (client_id, date, service_type, notes, approved, completed)
    values (${clientId}, '${date}', '${service}', '', false, false)
    returning *;`)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
}
}