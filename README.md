# PetPal

PetPal is a full-stack application developed as a group project for CSC309. It is designed to serve as a platform for pet adoption and management.

## Features

- **Pet Adoption:** Browse and adopt pets available for adoption.
- **User Profiles:** Create user accounts, manage favorite pets, and track adoption history.
- **Pet Management:** Admin panel for managing pets available for adoption.
- **Search & Filters:** Search pets by breed, age, or location.
- **Responsive Design:** Built using React and Bootstrap CSS for a user-friendly interface.

## Tech Stack

- **Frontend:** React, Bootstrap CSS
- **Backend:** Django
- **Hosting:** AWS
- **Web Server:** Nginx
- **Application Server:** Gunicorn

## Installation

### Prerequisites

- Node.js and npm for the frontend
- Python and Django for the backend

### Setup Instructions

1. **Frontend Setup:**

   ```bash
   cd frontend
   npm install
   npm start
   ```
2. **Backend Setup:**

   ```bash
   cd backend
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

### Deployment
PetPal is deployed on AWS using Nginx as the web server and Gunicorn as the application server. Follow these steps to deploy the application:

1. Set up an AWS account and create EC2 instances.
2. Install and configure Nginx and Gunicorn on the EC2 instances.
3. Clone the PetPal repository onto the EC2 instance.
4. Configure environment variables and settings for production deployment.
5. Start Gunicorn and configure Nginx to serve the application.
