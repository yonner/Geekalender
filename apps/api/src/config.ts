try {
  process.loadEnvFile();
} catch {
  // No .env file; rely on the real environment.
}

export const config = {
  port: Number(process.env.PORT ?? 4000),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
};
