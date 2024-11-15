![Logo](https://aadityamall.vercel.app/images/certimail.png)

# CertiMail

CertiMail is a streamlined and efficient web application designed to automate certificate generation, distribution, and mass emailing. Originally created for [IET MPSTME On Campus](https://ietmpstme.in), CertiMail simplifies workflows by enabling users to send personalized certificates and mass emails in just a few clicks.

---

## Features

### 🎓 Certificate Sender
CertiMail allows users to:
- Upload an Excel sheet containing names and email addresses.
- Select a base certificate template and customize it with attributes like font style, coordinates, font size, and color.
- Customize the template by adding text dynamically, and preview the generated PDF with real-time editing.
- Send certificates automatically to recipients with personalized information populated from the Excel file.

### 📧 Mass Email Sender
CertiMail also includes a mass email tool that allows users to:
- Send emails to large numbers of recipients from a single email account using your email and app password.
- Customize the email subject and body using a rich text editor, with options to style text and add images.

## Technologies Used
- **Frontend:** React, Tailwind CSS, React Bootstrap
- **Backend:** Node.js, Express, Nodemailer
- **PDF Generation:** PDF-lib
- **CSV Parsing:** Papaparse
- **Frontend Components:** React Quill for email body customization, React Dropzone for file uploads


## Installation


1. **Clone the Repository:**
   
   ```bash
   git clone https://github.com/AadityaMall/CertiMail.git
   cd CertiMail

## Directory Details

- **frontend/**: Contains all the code for the frontend, built using React. This includes components, pages, and styling for the user interface of CertiMail.
- **backend/**: Contains the backend code for handling API requests, certificate generation, and email distribution. Uses Node.js, Express, and Nodemailer.
- **README.md**: Documentation file that provides an overview and usage instructions for the project.

## Prerequisites

Make sure you have the following installed:
- Node.js

## Usage
### Backend

1. **Navigate to Backend Directory and Install Dependencies**
   
   ```bash
   cd ./backend
   npm install

2. **Navigate to Setup Folder, Create config.env and add following content for your application**
   
   ```plain-text
   SMTP_MAIL =your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   
3. **Go to root directory and Start the server**
   ```bash
   cd ../..
   npm start
 
### Frontend

1. **Navigate to Frontend Directory and Install Dependencies**
   
   ```bash
   cd ../frontend
   npm install

2. **Navigate to Setup Folder, Create .env.development and add following content for your application**
   
   ```plain-text
   REACT_APP_API_LINK = https://your-backend-url/api-route

1. **Start the Project**
   ```bash
   npm start


  **Your project should be ready and running at http://localhost:3000**

## Contact

**Developer:** Aaditya Mall

- **Address:** B1/101 Harasiddh Park, Pawar Nagar, Thane West, 400610
- **Phone:** +91 9326430750
- **Email:** [aadityarmall@gmail.com](mailto:aadityarmall@gmail.com)
- **LinkedIn:** [linkedin.com/in/aadityamall](https://linkedin.com/in/aadityamall)
- **GitHub:** [github.com/AadityaMall](https://github.com/AadityaMall)
- **Portfolio:** [aadityamall.tech](https://aadityamall.tech)
