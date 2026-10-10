import HelpDesk from './HelpDesk';
import TicketService from './TicketService';

const root = document.getElementById('root');

const ticketService = new TicketService('https://helpdesk-backend-1-yq8u.onrender.com');
const app = new HelpDesk(root, ticketService);

app.init();
