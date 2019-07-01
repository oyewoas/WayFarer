module.exports = {
    postgresdb_url : process.env.MONGODB_URL,
    secret: process.env.SECRET,
    port : process.env.PORT || 4000,
    environment : process.env.NODE_ENV

}
