# Chat Stats

This project uses yarn workspace, to install the dependencies, simply use `yarn` command. After the dependencies are installed, run `yarn build` in the root directory, to build the packages. You will also need a PostgreSQL database, and configure the connection details in the `Database.ts` file.

To configure the backend, update the `config.json` file in the `api` directory. There, you can customize the `http` and `https` details.

The bot will listen on the channels configured in the `channels.json` file.

The API endpoint that the frontend will use, can be configured in the `config.json` file in the `frontend` directory.
