# ImageAI

ImageAI is a powerful application that generates alternative text for images or tunified avatars based on user input. This repository contains the source code for both the frontend and backend of the ImageAI application.

## Features

- Automatic generation of image alt text for accessibility

- Creation of tunified avatars based on input images

- User-friendly and responsive interface

- Utilizes Hugging Face API for advanced image processing

## Tech Stack

### Frontend

- Framework: React

- Styling: CSS/SCSS, TailwindCSS 

### Backend

- Language: Python

- Framework: FastAPI 

- API Integration: Hugging Face API

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)

- Python (v3.8 or later)

- Package managers: npm and pip

- Hugging Face API key

## Installation

1. Clone the repository:
```
git clone https://github.com/shanmuka7482/ImageAI.git
cd ImageAI
```

2. Set up the backend:
```
cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```
3. Set up the frontend:
```
cd ../frontend
npm install
```

### Configuration

1. Backend:

- Create a .env file in the backend directory.

- Add the following variables:
```
HUGGING_FACE_API_KEY=<your-hugging-face-api-key>
```

## Running the Application

1. Start the backend server:
```
cd backend
uvicorn app:app
```
2. Start the frontend development server:
```
cd frontend
npm start
````
3. Open your browser and navigate to http://localhost:3000.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
