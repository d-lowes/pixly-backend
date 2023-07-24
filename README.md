# Pixly Backend
This repository contains the backend for Pixly, an image-sharing web application. Pixly allows users to upload, view, and interact with images shared by others. This README provides instructions on setting up and running the frontend application.

# Pixly Frontend
The frontend of Pixly is designed to work in conjunction with the Pixly backend. Once you have set up the Pixly backend, navigate to the Pixly frontend repository here: [Pixly Frontend Repository](https://github.com/d-lowes/pixly-frontend).

### Prerequisites
Before setting up the Pixly backend, ensure that you have the following dependencies installed:

Node.js (version 14 or above)
npm (Node package manager)


### Installation
To install the frontend application, follow these steps:

Clone the repository to your local machine using the following command:
``` bash
git clone https://github.com/d-lowes/pixly-backend.git
```

Navigate to the cloned repository:
``` bash
cd pixly-backend
```

Install the project dependencies:
```bash
npm install
```

This application runs using AWS, and you need to setup your own bucket beforehand to manage file storage.
Set up your .env file with the proper information:
```
SECRET_KEY=
ACCESS_KEY=
SECRET_ACCESS_KEY=
REGION=
BUCKET_NAME=
```

### Startup Instructions
To start the Pixly backend application, follow these steps:

Start the backend server by running the following command:

```bash
npm start
```

### Contributing
Contributions to the Pixly backend are welcome! If you find any issues or want to suggest improvements, please submit an issue or a pull request to this repository.
