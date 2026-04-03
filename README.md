# Airbnb Backend System

This project is a backend system inspired by Airbnb, built using **Node.js**, **Express**, and **PostgreSQL**. It focuses on managing bookings, customers, and availability while ensuring strong database consistency and clean code organization.

The system is designed to simulate a real-world reservation workflow where users can create bookings, manage customers, and track availability. A key emphasis of the project is maintaining **data integrity and reliability** using PostgreSQL’s ACID-compliant transaction system.

---

## Architecture (MVC Pattern)

The project follows a structured **MVC (Model-View-Controller)** architecture with an additional **Service and Repository layer** for better scalability and separation of concerns.

### 🔹 Controller Layer
- Handles incoming HTTP requests and sends responses  
- Acts as the entry point of the application  
- Calls the service layer for business logic  

### 🔹 Service Layer
- Contains core business logic  
- Processes data and applies rules (e.g., booking logic, validations)  
- Manages transactions to ensure consistency  

### 🔹 Repository Layer
- Responsible for direct database interaction  
- Executes SQL queries using PostgreSQL  
- Abstracts database operations from the rest of the application  

### 🔹 Model / DTO Layer
- Defines structured data transfer objects  
- Ensures consistent input/output formats  
- Helps with validation and type safety  

---

## Application Flow

1. Client sends request (e.g., create booking)  
2. Controller receives the request  
3. Service layer processes business logic  
4. Repository interacts with PostgreSQL  
5. Response is returned back through the controller  

---

## Database Reliability

The system leverages PostgreSQL to ensure:

- **Atomicity:** Transactions either fully complete or fail entirely  
- **Consistency:** Constraints and relationships maintain valid data  
- **Isolation:** Concurrent operations do not conflict  
- **Durability:** Committed data is permanently stored  

---

## Key Highlights

- Clean separation of concerns using MVC + Service + Repository  
- Scalable and maintainable backend design  
- Reliable booking workflow with transaction management  
- Strong focus on database integrity and real-world system design  

---
