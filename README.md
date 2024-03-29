# Traveler-Tourism Website and Application (graduation-project)

## Description
"Traveler-Tourism Website and Application" provides a huge amount of data about Egypt for tourists and Egyptians(anyone), recommending the best places that fits for you, alot of information about all places in Egypt, login-points that converts to a coupoun (can be used in discounts), the owenrs of any tourist's company (restaurant, cafee, ..etc) can be a partener and uplaod his place as ads. And alot of interesting things more.



## Features 🚀🚀
- Authentication using JWT.
- Role-based Authorization.
- Signing-in using Email-Password.
- Statistics for all users.
- Cloud storage for user profile image using Cloudinary.
- Cloud storage for user data image using Mongo Atlas.
- Sending emails for (OTP) via g-mail service.
- Error and Exception handling.
- Survey for the recommendation.
- StatisticsSurvey based on the Surveies.
- Recommending places based on survey and ratings(for users and guests).
- Every government attatched to the dabase.
- Every government has its comments, ratings, supervisorsPlaces(ads) and more.
- Login-points and coupuns.
- Hosting on ec2 instance-AWS.
- Domain from namecheap by github student back for https requests.
- There's more!



## Folder Structure
```
.
├── Dockerfile
├── README.md
├── docker-compose-dev.yml
├── docker-compose-dev2.yml
├── docker-compose.yml
├── nginx
│   └── nginx.conf
├── package-lock.json
├── package.json
├── Traveler-Tourism Website and Application.yml
├── src
│   ├── controllers
│   │   ├── auth.controller.js
│   │   ├── comment.controller.js
│   │   ├── coupon.controller.js
│   │   ├── place.controller.js
│   │   └── rating.controller.js
│   │   ├── statistics.controller.js
│   │   ├── statisticsSurvey.controller.js
│   │   ├── SupervisorPlaces.controller.js
│   ├── errors
│   │   ├── auth.error.js
│   │   ├── notFound.error.js
│   │   ├── validation.error.js
│   ├── middlewares
│   │   ├── catchAllRoutes.middleware.js
│   │   ├── errorHandler.middleware.js
│   │   ├── isAuth.middleware.js
│   │   ├── isSupervisor.middlware.js
│   │   ├── upload.middleware.js
│   ├── models
│   │   ├── comment.model.js
│   │   └── coupon.model.js
│   │   └──place.model.js
│   │   └──rating.model.js
│   │   └──supervisorPlaces.model.js
│   │   └──survey.model.js
│   │   └──user.model.js
│   ├── routes
│   │   ├── auth.route.js
│   │   ├── comment.route.js
│   │   ├── coupon.route.js
│   │   ├── place.route.js
│   │   ├── rating.route.js
│   │   ├── statistics.route.js
│   │   ├── supervisorPlaces.route.js
│   ├── services
│   │   ├── passwordManager.service.js
│   ├── utils
│   │   ├── cloudinary.js
│   │   ├── file.js
│   │   ├── path.js
└── tsconfig.json
```

## Getting Started

To get started with this project, follow these steps:
### Using Docker:
```bash
docker compose up -d --build
```

### Manually:
- Install Dependencies
```bash
npm install
```

- Only Build
```bash
npm run build
```

- Build & Run in Production Mode
```bash
npm start
```

- Build & Run in Development Mode
```bash
npm run dev
```


## Technology Stack
- Language: javaScript
- Runtime Environment: NodeJS
- Framework: Express
- Database: MongoDB
- Reverse Proxy: Nginx
- Cloud: AWS
- Cloud Storage: Cloudinary
- Containerization: Docker

## Contributing
If you're interested in contributing to this project, please follow these guidelines:
1. Fork the repository.
2. Make your changes.
3. Submit a Pull Request.