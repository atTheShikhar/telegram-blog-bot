# Telegram Blog Bot

This is a simple telegram bot that scrapes blogs from my friend's [website](https://growtholic.in/blog/)

## Installation

Make sure you have [Node.js](https://nodejs.org/) installed and run

```bash
npm install
```

## Configurations

In order to run this bot you need to set some environment variables.

* Create a `.env` file on the root of this project.
* Edit the file and add two variables: 
    ```
    BOT_TOKEN=<Your bot token received from t.me/BotFather>
    REFRESH_KEY=<The key that will be used to refresh the blog data>
    ```

## Usage

Start the server using- 

```bash
npm start
```

Use one of the following commands on your telegram bot,
Currently this bot supports only two commands: 

* `/refresh <refresh key>`: Used to refresh blog data on the server (Run everytime new blog is added).
* `/read`: Used by users to select and read blogs.