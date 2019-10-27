import PleaseSignin from '../components/PleaseSignin';
import OrderList from '../components/OrderList';

const OrdersPage = ({query}) => (
      <PleaseSignin>
        <OrderList id={ query.id }/>
      </PleaseSignin>
)
export default OrdersPage
