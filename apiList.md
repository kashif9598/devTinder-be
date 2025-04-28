# DevTinder API'S

# authRouter
- POST /signup
- POST /login
- POST /logout

# profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

# connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId

- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

# userRouter
- GET /connections
- GET /requests/received
- GET /feed - Gets you profiles of other users on platform

Status: ignored, interested, accepted, rejected


# DEPLOYMENT

connecting to ec2 instance - ssh -i "devTinder-secret.pem" ubuntu@ec2-51-21-245-176.eu-north-1.compute.amazonaws.com
Install Node Version
Git clone
- Frontend
    - npm install
    - npm run build
    -update ubuntu - sudo apt update
    -install nginx - sudo apt install nginx
    -sudo systemctl start nginx
    -sudo systemctl enable nginx
    - copy code from dist(build folder) tp /var/www/html/
    - sudo scp -r dist/* /var/www/html/
    - Enable port :80 on your instance

- backend
    - npm install
    -- allowed ec2 instance public IP on MongoDB Server
    -- enable port 8000 on security
    -- npm install pm2 -g
    -- pm2 start npm -- start
    -- pm2 logs (to check logs)
    -- pm2 start npm --name "devTinder-be" -- start  // change name to devTinder-be
    -- pm2 stop

    -- add config in nginx config file 

    sudo nano /etc/nginx/sites-available/default
    server_name 51.21.245.176;

        location /api/ {
                proxy_pass http://localhost:8000/;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
    }

    restart nginx - sudo systemctl restart nginx

    modify baseURL in frontend to "/api"


# Adding a custom domain name

- purchase domain name from goDaddy
- signup on cloudflare and add a new domain name
- change the nameservers on goDaddy and point to cloudflare
- create A record in cloudflare with IP address of ec2 instance
- enable ssl/tls certificate


# sending emails using AWS SES

- Create a IAM User
- Give access to Amazon SES Full Accecss
- Amazon SES: Create an Identity
- Verify Domain Name
- Verify Email address identity
- Access Credentials should be created in IAM Under security Credentials Tab
- Add the credentials to the env files
- write code for SES Client
- write code for sending email address
- Make the email dynamic by passing more parameters to run function




    

