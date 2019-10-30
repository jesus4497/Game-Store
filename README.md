# GameStore
An e-commerce using React, Apollo, GraphQL, Prisma
# Technologies
- [ ] ReactJS
- [ ] Apollo
- [ ] JavaScript
- [ ] Styled-Components
- [ ] GraphQL
- [ ] Prisma
# Getting Started
- Clone this project
- Run npm install in the directory where you cloned this project
- Run prisma -g install in the backend folder
- You must create a Prisma account and choose the demo server with Prisma init command.
- You will need to create a file called variables.env or just .env for enviroment variables, there you can add your Prisma server endpoint.
- In this project I used mailtrap, stripe and JWT, so you will need to declare them in the variables.env as well. The file gonna look something like this:
    <pre>
        FRONTEND_URL="http://localhost:7777"
        PRISMA_ENDPOINT="the_url_of_your_prisma_server"
        PRISMA_SECRET="kokoookokofo"
        APP_SECRET="secretmyfriend"
        STRIPE_SECRET="my_api_from_stripe"
        PORT=4444
        MAIL_HOST="smtp.mailtrap.io"
        MAIL_PORT=2525
        MAIL_USER="mailtrap-user"
        MAIL_PASS="mailtrap-pass"
    </pre>
- Run npm run dev in both backend and frontend
- Enjoy!
