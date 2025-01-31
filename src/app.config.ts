
export const AppConfig = () => ({
    PORT: process.env.PORT || 3500,
    DATABASE_URL: process.env.DATABASE_URL || `postgresql:postgres:0000@localhost:5432/invoice-sys`,
    WEB_URL: process.env.WEB_URL || `http://www.localhost:4200`,
    API_URL: process.env.API_URL || `http://www.localhost:3500`,
    JWT_SECRET: process.env.JWT_SECRET || 'JWTSECRET12039393920EEE00007',
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'INVOICESYSTEMENCRYPTIONKEY961231234567890',
    CLIENT_ENCRYPTION_KEY: process.env.CLIENT_ENCRYPTION_KEY || 'CLIENT_ENCRYPTION_KEY',
    RABBITMQ_URL : process.env.RABBITMQ_URL || 'amqp://localhost'
});