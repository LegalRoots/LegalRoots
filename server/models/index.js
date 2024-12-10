// const mongoose = require("mongoose");
// const Employee = require("./employee");

// const createEmployee = async () => {
//   try {
//     const newEmployee = await Employee.create({
//       first_name: "John",
//       last_name: "Doe",
//       ssid: "123456789",
//       email: "admin@test.com",
//       job: "Software Engineer",
//       birthdate: "1990-01-15",
//       phone: "1234567890",
//       employee_photo: "default.png",
//       isValid: true,
//       password: "123",
//       passwordConfirm: "123",
//       gender: "Male",
//       notifications: [
//         {
//           message: "Welcome to the company!",
//           createdAt: new Date(),
//           read: false,
//         },
//       ],
//     });

//     console.log("Employee created:", newEmployee);
//   } catch (err) {
//     console.error(err);
//   } finally {
//     mongoose.connection.close();
//   }
// };

// createEmployee();
