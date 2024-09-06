<h1 align="center">Easy Booking</h1>

         
<p align="center">
  <a href="https://booking-app-p6i5.onrender.com/ " target="_blank">Live</a> - Full Stack Booking Web App with User-friendly Interface
</p>

## Demo

Watch a video showcasing the project in action: 


https://github.com/Kuwar20/Easy-Booking/assets/66473902/fecb30d8-f21c-4904-9c85-96857653a70b


## Prerequisites


- [Node.js](https://nodejs.org/)&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- JavaScript runtime built on Chrome's V8 JavaScript engine
- [npm](https://www.npmjs.com/)&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Package manager for JavaScript
- [MongoDB](https://www.mongodb.com/)&nbsp; &nbsp;&nbsp;&nbsp;  - NoSQL database for storing application data
- [Tailwind CSS](https://tailwindcss.com/)&nbsp; - Utility-first CSS framework for styling

## Installation & Executing the website locally

Use the package manager [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to install Auth App - Installation

```bash
npm install -g npm
```
Download this repo using
```bash
git clone https://github.com/Kuwar20/Easy-Booking
```

* Step-by-step Instruction - Frontend
```bash
Open a terminal

# get insise frontend dir 
cd "Mern Booking App/frontend"

# install the dependencies 
npm install

# run frontend
npm run dev
```


* Step-by-step Instruction - Backend
```bash
Open another terminal

# get inside backend dir
cd "Mern Booking App/backend"

# install the dependencies 
npm install

# run backend
npm run dev

# run backend for test
npm run e2e
```

* Note
```text
For running this project locally, note that certain functionalities will be unavailable due to the absence of environment variables
file specified in the .gitignore file to exclude sensitive information like API keys, Database URI. Ensure you have the necessary
configuration in your local environment.
```
## Backend Configuration

1. **Environment Files**: Navigate to the `backend` folder and create two files: `.env` and `.env.e2e`. Add the following contents to both files:

   ```bash
    MONGODB_CONNECTION_STRING=

    JWT_SECRET_KEY=
    FRONTEND_URL=

    # Cloudinary Variables
    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=

    # Stripe
    STRIPE_API_KEY=
    ```
## Frontend Configuration

1. **Environment Files**: Navigate to the `frontend` folder and create `.env` file. Add the following contents to both files:

   ```bash
    #FRONTEND_URL
    VITE_API_BASE_URL=

    # Stripe
    VITE_STRIPE_PUB_KEY=
    ``` 
Folder Structure 
============================

> The project was made with the intent of hosting it on Render, Thus shaping it's current folder structure .

### Top-level directory layout
         .
         ├── backend   
         |   |
         │   ├── src 
         |   |   |
         │   │   ├── routes                # API routes
         │   │   ├── middleware            # Middleware functions
         │   │   ├── models                # Data models
         │   │   └── index.ts              # Entry point for backend
         |   |
         │   └── README.md             
         │
         ├── e2e-test  
         |   |
         │   ├── playwright-report        # Report generated by Playwright
         │   ├── test-results             # Results of tests
         │   └── tests                    # Test scripts
         │       └── auth.spec.ts           
         │       
         ├── frontend
         |   |
         │   ├── src   
         |   |   |
         │   │   ├── components            # Reusable UI components
         │   │   ├── contexts              # React contexts
         │   │   ├── layouts               # Page layouts
         │   │   ├── pages                 # Individual pages/views
         │   │   ├── api-client.ts         # API client configuration
         │   │   └── App.tsx               # Entry point for frontend
         |   |
         │   └── README.md              
         │
         └── README.md                     # Project-wide documentation


| Main | Folder | File Name | Details 
|----|--------|------|-------|
| frontend  | src | App.tsx | Entry point for Frontend
| backend  | src | index.ts | Entry point for Backend

## Dependencies used

#### Frontend:
* react-router-dom
* tailwindcss
* State Management: React Query
* Form Handling: React Hook Form
* UI Components: Material Tailwind, React Icons
* Date Picker: React Datepicker
* Payment Integration: Stripe (via @stripe/react-stripe-js and @stripe/stripe-js)

#### Backend:


* Framework: Express.js
* Image Storage: Cloudinary
* Validation: Express Validator
* Middleware: CORS, Cookie Parser
* Development Utilities: Nodemon, TypeScript
* jsonwebtoken
* mongoose
* multer


## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

  </tr>



## Authors Note

While I was the main developer of this MERN stack project, this project couldn't have even started without the help of these open-source projects, special thanks to:

- [JavaScript](https://www.javascript.com/)
- [TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [MongoDB](https://www.mongodb.com/)
- [Express.js](https://expressjs.com/)
- [React.js](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Playwright](https://playwright.dev/docs/writing-tests)
- [Swagger Api](https://swagger-autogen.github.io/docs/getting-started/quick-start/)


## Version History

* 0.4
    * Made Responsive for Smaller Screens
* 0.3
    * Made Prod [Live](https://booking-app-p6i5.onrender.com/)
* 0.2
    * Various bug fixes and optimizations
    * See [commit change](https://github.com/Kuwar20/Auth-fullstack-P-2/commits/main/) 
* 0.1
    * Initial Release

## License

This project is licensed under the MIT License - see the LICENSE Tab for details

## Acknowledgments

Inspiration, code snippets, etc.
* [React Documentation](https://react.dev/learn)
* [Create React App](https://create-react-app.dev/docs/getting-started)
* [Expressjs Doc](https://expressjs.com/en/starter/installing.html)
* [Mongo University](https://learn.mongodb.com/learning-paths/introduction-to-mongodb)
* [Playwright E2E Test](https://playwright.dev/docs/writing-tests)