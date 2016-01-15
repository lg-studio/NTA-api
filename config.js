module.exports = {
    PORT: process.env.PORT || 3000,
    NEO4J: process.env.NEO4J || 'https://555f9eeb0a3fc:ppgfbT53mD0yfIke1Btim0o7KwwwoCxkGMnRUDMv@neo-555f9eeb0a3fc-364459c455.do-stories.graphstory.com:7473',
    MONGODB: process.env.MONGODB || 'mongodb://admin:admin@ds053972.mongolab.com:53972/ny-api',
    MONGODB_DEV: 'mongodb://admin:admin@ds055812.mongolab.com:55812/ny-api-dev',
    //MONGODB_DEV: process.env.MONGODB_DEV || 'mongodb://admin:admin@ds055812.mongolab.com:55812/ny-api-dev',
    MONGODB_TEST: process.env.MONGODB_TEST || 'mongodb://admin:admin@ds047592.mongolab.com:47592/ny-api-test',
    GCM_SERVER_API_KEY: process.env.GCM_SERVER_API_KEY || false,
    GCM_PROJECT_NUMBER: process.env.GCM_PROJECT_NUMBER || false,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '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',
    SENDGRID_SENDER: process.env.SENDGRID_SENDER || 'o.chaplya@usinformatic.com',
    FEEDBACK_MAIL: process.env.FEEDBACK_MAIL || 'o.chaplya@usinformatic.com',
}
