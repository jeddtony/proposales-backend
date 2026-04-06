import { Router } from 'express';
import multer from 'multer';
import { ContentController } from '@controllers/content.controller';
import { Routes } from '@interfaces/routes.interface';

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel',                                           // .xls
      'text/csv',                                                            // .csv
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only .xlsx, .xls, and .csv files are accepted'));
    }
  },
});

export class ContentRoute implements Routes {
  public router = Router();
  public content = new ContentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/content', this.content.createContent);
    this.router.put('/content', this.content.updateContent);
    this.router.delete('/content', this.content.deleteContent);
    this.router.post('/content/bulk-upload', upload.single('file'), this.content.bulkCreateContent);
  }
}
