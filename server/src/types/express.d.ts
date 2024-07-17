// types/express.d.ts
import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    file?: Express.Multer.File;
    files?: Express.Multer.File[];
  }
}
