# Welcome to Pazar!

## Description

Pazar, a robust platform constructed with the MERN stack, seamlessly integrates with third-party APIs to facilitate three distinct operational flows:

1. **Buyers**: Effortlessly navigate through an extensive assortment of categories, products, and brands.
2. **Merchants**: Exercise complete control over brand components, presenting products in a manner that best aligns with their vision.
3. **Administrators**: Command complete oversight and management over all components within Pazar.

## Features
- Backend powered by Node.js.
- Express middleware for efficient request and route handling.
- Mongoose schemas diligently model application data.
- React efficiently renders UI components.
- Redux meticulously manages the application's state.
- Redux Thunk middleware facilitates asynchronous redux actions.

## Database Seed
- The seed command initializes an admin user in the database.
- Pass the email and password as arguments within the command.
- Reference the example command below, replacing brackets with actual email and password.
- Dive deeper into the code [here](server/utils/seed.js).

```
npm run seed:db [email-***@****.com] [password-******] // Example usage.
```

## Installation
Clone the Pazar repository using the following Git commands:

```
$ git clone https://github.com/tahozc/Pazar.git
$ cd project
$ npm install
```

## Setup
Create a `.env` file and include:

```
* MONGO_URI & JWT_SECRET
* PORT & BASE_SERVER_URL & BASE_API_URL & BASE_CLIENT_URL
* ... (Other Configurations)
```

## Development & Production
Start development:

```
$ npm run dev
```
Build for production:

```
$ npm run build
```
Run in production:

```
$ npm start
```

## Technologies & Tools
- [Node](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [React](https://reactjs.org/)
- [Webpack](https://webpack.js.org/)

### Code Formatter
Add a `.vscode` directory with a `settings.json` file. Ensure Prettier - Code Formatter is installed in VSCode, and include the snippet below:

```json
{
  "editor.formatOnSave": true,
  "prettier.singleQuote": true,
  "prettier.arrowParens": "avoid",
  "prettier.jsxSingleQuote": true,
  "prettier.trailingComma": "none",
  "javascript.preferences.quoteStyle": "single",
}
```

Welcome to the world of Pazar! 🚀