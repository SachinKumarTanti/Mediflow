# Mediflow
A Hospital management system 
# Hospital Management System (HMS)

This project is a full-stack Hospital Management System designed to streamline hospital operations. It includes a **React** frontend powered by **Vite** and a **Django** backend with **Django REST Framework** for APIs.

## Features

### Frontend
- Built with **React** and styled using **TailwindCSS**.
- **React Router** for navigation.
- **Framer Motion** for animations.
- Key pages:
  - **HomePage**: Overview of hospital services.
  - **Admin Dashboard**: Manage patients, medicines, and more.
  - **Patient Queue**: View and manage patient queues by OPD.
  - **Medicine Stock**: Manage medicine inventory.

### Backend
- Built with **Django** and **Django REST Framework**.
- Custom **User Model** for authentication.
- **JWT Authentication** for secure API access.
- Key APIs:
  - Patient management (add, delete, list).
  - Medicine inventory management.

## Setup

### Backend
1. Navigate to the `backend` folder.
2. Install dependencies:
   ```sh
   pip install -r requirements.txt
Run migrations:
	python manage.py migrate
Start the server:
	python manage.py runserver
Frontend
Navigate to the mediflow folder.
Install dependencies:
	npm install
Start the development server:
 	npm run dev

License
This project is licensed under the IITG License. ```
