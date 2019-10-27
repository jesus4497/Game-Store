import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { format } from 'date-fns';
import Head from 'next/head';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';
import OrderStyles from './styles/OrderStyles';

const SINGLE_ORDER_QUERY = gql`
    query SINGLE_ORDER_QUERY( $id: ID! ){
        order(id:$id){
            id 
            total
            charge
            createdAt
            user{
                id
            }
            items{
                id
                description
                title
                image
                price
                quantity
            }

        }
    }
`;

const Order = ({ id }) =>(
    <Query query={SINGLE_ORDER_QUERY} variables={{id}}>
        {({data,loading,error})=>{
            if(error) return <Error error={error} />
            if(loading) return <p>Loading...</p>
            const { order } = data
            return(
                <OrderStyles>
                    <Head>
                        <title>GameStore - order {order.id}</title>
                    </Head>
                    <p>
                        <span>Order ID: </span>
                        <span>{ id }</span>
                    </p>
                    <p>
                        <span>Charge: </span>
                        <span>{ order.charge }</span>
                    </p>
                    <p>
                        <span>Date: </span>
                        <span>{ format(order.createdAt,'d MMMM, YYYY h:mm a') }</span>
                    </p>
                    <p>
                        <span>Total: </span>
                        <span>{ formatMoney(order.total) }</span>
                    </p>
                    <p>
                        <span>Item Count: </span>
                        <span>{ order.items.length }</span>
                    </p>
                    <div className="items">
                        {order.items.map((item,index)=>(
                            <div className="order-item" key={index}>
                                <img src={item.image} alt={item.title}/>
                                <div className="item-details">
                                    <h2> {item.title} </h2>
                                    <p>Quanity: { item.quantity } </p>
                                    <p>Each: { formatMoney(item.price) }</p>
                                    <p>Subtotal: { formatMoney(item.price * item.quantity) }</p>
                                    <p>{ item.description }</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </OrderStyles>
            )
        }}
    </Query>
)

Order.propTypes = {
    id: PropTypes.string.isRequired,
}

export default Order