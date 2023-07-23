export function extractToken(authorization = '') {
    if (/^Bearer /.test(authorization)) {
        return authorization.substring(7, authorization.length);
    }
    return '';
}

export function getEnvFilePath() {
    return process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : `.env`;
}
