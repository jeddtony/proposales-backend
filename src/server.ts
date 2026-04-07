import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { BooksRoute } from '@routes/books.route';
import { ValidateEnv } from '@utils/validateEnv';
import { ShoppingCartRoute } from '@routes/shoppingCart.route';
import { OrderRoute } from '@routes/order.route';
import { ProposalRequestRoute } from '@routes/proposalRequest.route';
import { ContentRoute } from '@routes/content.route';
import { ProposalRoute } from '@routes/proposal.route';
import { SettingsRoute } from '@routes/settings.route';

ValidateEnv();

const app = new App([
  new AuthRoute(),
  new UserRoute(),
  new BooksRoute(),
  new ShoppingCartRoute(),
  new OrderRoute(),
  new ProposalRequestRoute(),
  new ContentRoute(),
  new ProposalRoute(),
  new SettingsRoute(),
]);

app.listen();
