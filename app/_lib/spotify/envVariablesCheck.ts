export function checkIfEnvVariablesExist() {
    const requiredEnvVariables = ['SPOTIFY_CLIENT_ID', 'SPOTIFY_CLIENT_SECRET', 'SPOTIFY_REDIRECT_URI'];
    console.log(process.env);
    requiredEnvVariables.forEach((envVariable) => {
        if (!process.env[envVariable]) {
            throw new Error(`Missing environment variable: ${envVariable}`);
        }
    });
}
