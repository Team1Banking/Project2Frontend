# ANT - Associated Network Of Transactions

![ant-high-resolution-logo-color-on-transparent-background_(4)](https://github.com/Team1Banking/Project2/assets/107225817/8d27752a-6d91-434d-a0fe-cb6b9f1efd9d)

A banking web application that consists of a back-end system built with the Spring Framework and a front-end application developed using React. The back-end system utilizes various components of the Spring Framework, including Spring Boot, Spring Data, Spring Web, and Spring Security with JWT authentication. The front-end communicates with the back-end through Axios requests.

## Overview

Simulates an online banking system. It allows users to register/login, deposit/withdraw money from accounts, transfer money between accounts and recipients, and view transactions.

### Back-End:
- Spring Boot: Used for the creation and setup of the application.
- Spring Data: Utilized for communication with a PostgreSQL database.
- Spring Web: Used for HTTP request handling and creation of controllers.
- Spring Security: Implements JWT-based authentication for secure access.
  
### Front-End:
- React: The front-end is built using React, a popular JavaScript library for building user interfaces.
- Axios: Used for making HTTP requests from the front-end to the back-end.
  
## AWS:
- RDS: The database is hosted on an AWS RDS instance using the PostgreSQL dialect.
- EC2: The back-end is deployed on an AWS EC2 instance.
- S3: The front-end application is deployed using an AWS S3 instance.

## Features 
- Track expenses and income
- Deposit and withdraw money
- Transfer money between bank accounts
- Transfer money to other users

## Installation
Clone the repository: git clone <https://github.com/Team1Banking/Project2.git>

### Set up the back-end:

- Install dependencies: cd backend && mvn install
- Configure the database connection in application.properties.
- Run the back-end: mvn spring-boot:run

### Set up the front-end:
- Install dependencies: cd frontend && npm install
- Configure the API endpoint in src/api/config.js.
- Run the front-end: npm start

### Deployment:
- Set up an AWS RDS instance and import the database schema.
- Launch an AWS EC2 instance and deploy the back-end.
- Configure the necessary security groups and network settings.
- Deploy the front-end application to an AWS S3 instance.
- Update the API endpoint in the front-end configuration to point to the deployed back-end.

### Compilation:
<img width="1369" alt="j unit test" src="https://github.com/Team1Banking/Project2/assets/107225817/70a78b09-174d-437f-a090-622c068389e3">

### Use/Case:
<img width="1358" alt="Screenshot 2023-07-17 at 11 01 23 PM" src="https://github.com/Team1Banking/Project2/assets/107225817/9c068c58-9851-45d3-81ad-f62eaa5eb159">

### ER Diagram:
<img width="1363" alt="Screenshot 2023-07-17 at 11 02 08 PM" src="https://github.com/Team1Banking/Project2/assets/107225817/b8d47e0d-8d8f-4001-9f62-e234b36bed3f">

