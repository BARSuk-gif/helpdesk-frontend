import HelpDesk from './HelpDesk';
import TicketService from './TicketService';

const root = document.getElementById('root');

const ticketService = new TicketService('https://helpdesk-backend-vz8w.onrender.com');
const app = new HelpDesk(root, ticketService);

app.init();
