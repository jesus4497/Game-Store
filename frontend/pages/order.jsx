import PleaseSignin from '../components/PleaseSignin';
import Order from '../components/Order';

const OrderPage = ({query}) => (
      <PleaseSignin>
        <Order id={ query.id }/>
      </PleaseSignin>
)
export default OrderPage
