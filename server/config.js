
 const port = process.env.PORT || 3001;
 const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;

 module.exports = {
   port,
   host,
 };
