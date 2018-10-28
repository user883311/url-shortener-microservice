# url-shortener-microservice

A full stack JavaScript URL shortener API. 

User story: 
- I can pass a URL as a parameter and I will receive an JSON object with the long and shortened URLs in the response.
- If I pass an invalid URL that doesn't follow the valid http://www.example.com format, the app sends a relevant error message. 
- When I visit that shortened URL, I will also receive an JSON object with the long and shortened URLs in the response, and it will redirect me to my original link.

Stack: Node.js, Express, Joi, Opn and Mongoose / MongoDB. 
