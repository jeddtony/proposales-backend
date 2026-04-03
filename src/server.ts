import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { BooksRoute } from '@routes/books.route';
import { ValidateEnv } from '@utils/validateEnv';
import { ShoppingCartRoute } from '@routes/shoppingCart.route';
import { OrderRoute } from '@routes/order.route';

ValidateEnv();

const app = new App([new AuthRoute(), new UserRoute(), new BooksRoute(), new ShoppingCartRoute(), new OrderRoute()]);

app.listen();
