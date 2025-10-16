import 'dotenv/config'; // <-- ✅ Aquí primero
import express, { Application } from 'express';
import morgan from 'morgan';
import { Routes } from '../routes/index';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// 🔁 Importar todos los modelos primero
import '../models/teacher.model';
import '../models/article.model';
import '../models/reviewer.model';
import '../models/evaluation.model';
import '../models/evaluation_detail.model';
import '../models/article_publication.model';
import '../models/requirement_verification.model';

// 🔁 Luego importar las asociaciones
import '../models/associations';

export class App {
    public routePrv: Routes = new Routes();
    app: Application;

    constructor(private port?: number | string) {
        this.app = express();       
        this.settings();            
        this.middlewares();        
        this.routes();              
    }

    private settings() {
        this.app.set('port', this.port || process.env.PORT || 4000);
    }

    private middlewares() {
        this.app.use(morgan('dev'));                      
        this.app.use(cors());                             
        this.app.use(express.json());                     
        this.app.use(express.urlencoded({ extended: false }));
    }

    private routes() {
        this.routePrv.authRoutes.routes(this.app);
        this.routePrv.resourceRoutes.routes(this.app);
        this.routePrv.refreshTokenRoutes.routes(this.app);
        this.routePrv.roleUserRoutes.routes(this.app);
        this.routePrv.roleRoutes.routes(this.app);
        this.routePrv.resourceRole.routes(this.app);
        //----------------------------------------------------------------------
       this.routePrv.article_publicationRoutes.routes(this.app);
       this.routePrv.articleRoutes.routes(this.app);
       this.routePrv.evaluationDetailRoutes.routes(this.app);
       this.routePrv.evaluationRoutes.routes(this.app);
       this.routePrv.requirementVerificationRoutes.routes(this.app);
       this.routePrv.reviewerRoutes.routes(this.app);
       this.routePrv.teacherRoutes.routes(this.app);

    }

    async listen() {
        await this.app.listen(this.app.get('port'));
        console.log('✅ Servidor corriendo en el puerto', this.app.get('port'));
    }
}
