import { Query } from 'react-apollo';
import Link from 'next/link';
import { formatDistance } from 'date-fns';
import styled from 'styled-components';
import gql from 'graphql-tag';
import formatMoney from '../lib/formatMoney';
import OrderItemStyles from './styles/OrderItemStyles';
import Error from './ErrorMessage';

const USER_ORDERS_QUERY = gql`
    query USER_ORDERS_QUERY{
        orders(orderBy: createdAt_DESC){
            id
            total
            createdAt
            items{
                id
                title
                price
                description
                quantity
                image
            }
        }
    }
`;

const OrderUl = styled.ul`
    display:grid;
    grid-gap: 4rem;
    grid-template-columns:repeat(auto-fit, minmax(40%,1fr));

`;

const OrderList = props => (
    <Query query={USER_ORDERS_QUERY}>
        {({data:{orders},loading,error})=>{
            if(error) return <Error error={error} />
            if(loading) return <p>Loading...</p>
            return(
                <div>
                    <h2>You have: {orders.length} order{ orders.length === 1 ? '' : 's' }</h2>
                    <OrderUl>
                        { orders.map(order=>(
                            <OrderItemStyles key={orders.id}>
                                <Link href={{
                                    pathname: '/order',
                                    query: {id: order.id}
                                }}>
                                    <a>
                                        <div className="order-meta">
                                            <p>
                                                {order.items.reduce((tally,game)=>(
                                                    tally + game.quantity
                                                ),0)} Games
                                            </p>
                                            <p>
                                                {order.items.length} Products
                                            </p>
                                            <p>
                                                {formatDistance(order.createdAt, new Date())}
                                            </p>
                                            <p>
                                                {formatMoney(order.total)}
                                            </p>
                                        </div>
                                        <div className="images">
                                            {order.items.map( (game,index) => (
                                                <img key={index} src={game.image} alt={game.title}/>
                                            ))}
                                        </div>
                                    </a>
                                </Link>
                            </OrderItemStyles>
                        ))}
                    </OrderUl>
                </div>
            )
        }}
    </Query>
)

export default OrderList;