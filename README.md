# streetfleet-backend

### Description

This repo is the backend for Street Fleet vehicle tracking app.

## Usage

1. Clone and run `npm install`.
2. Duplicate `.env.default` into an `.env` file and configure it with the correct database access data and queue name.
3. Start MongoDB processes in your machine.
4. Run the server with `nodemon app.js` .
5. Refer to StreetFleet.postman02_04_18.json for the expected request formats.
6. Feel free to use [apiary documentation](https://streetfleet.docs.apiary.io)
7. Follow the instruction for the [webclient](https://github.com/nikwib/streetfleet-webclient) and [mobile](https://github.com/nikwib/streetfleet-mobile)

## Tech Stack

- [Node.js](https://nodejs.org/)
- [Koa](http://koajs.com/)
- [MongoDB](https://www.mongodb.com/)/[Mongoose](http://mongoosejs.com/)
- [Redis](https://redis.io/)
- [Socket.io](https://socket.io/)

![App architecture](https://github.com/nikwib/streetfleet-backend/blob/develop/Architecture.jpg)

## Contributors

Pull requests are welcome. By participating in this project, you agree to abide by the [thoughtbot code of conduct](https://thoughtbot.com/open-source-code-of-conduct)

Fork, then clone the repository. Push to your fork and submit a pull request.



## License

This project is licensed under the MIT License
