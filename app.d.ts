declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_SECRET: string;
    }
  }
}

export {};
