# SPX Cinemas Monorepo

![Assessment Task](https://img.shields.io/badge/Assessment-SDD-blue.svg?style=for-the-badge&logo=microsoft)
![Status](https://img.shields.io/badge/Status-Completed-brightgreen?style=for-the-badge)

This is the year 11 SDD assessment task 2 monorepo that contains both the frontend client and the backend server. In order to ensure that the project runs properly, you must have `yarn` installed as this project uses `yarn workspaces`.

## Technologies Used

This project has multiple technology stacks that are being utilised to deliver the project. The most notable are:

-   **React** - This is the primary JavaScript framework that is being used to deliver the frontend. This project also uses TypeScript to deliver a better development experience.
-   **Express** - This is the backend REST API service.
    -   **GraphQL** - Query language, used as an abstraction over REST.
-   **MongoDB** - The database.

---

## Installation Instructions

### Prerequisites

1. Please ensure that you have the latest NodeJS LTS installed (available [here](https://nodejs.org/dist/v12.18.3/node-v12.18.3-x64.msi))
2. Ensure that you have the `Yarn Package Manager` installed. It is available for download [here](https://classic.yarnpkg.com/latest.msi).
3. [MongoDB server](https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-4.4.0-signed.msi) installed, running on port 27017 (this is the default port).
    1. Optionally, install [MongoDB Compass](https://downloads.mongodb.com/compass/mongodb-compass-1.21.2-win32-x64.msi) to be able to inspect the database.

### Setup

> All commands being run below are executed in `PowerShell`, please ensure you
> do the same in order to be able to run the designated `ps1` scripts.
1. Ensure that you are in the root folder of the project (i.e. clone directory)
   and run:
   ```powershell
   .\setup.ps1
   ```
   This will install all required dependencies and seed the database with valid data.
2. Run the following command to start the development server, running on `http://localhost:3000`:
   ```bash
   yarn dev
   ```
   > You can also access the GraphQL playground by heading to `http://localhost:3001/graph`.
