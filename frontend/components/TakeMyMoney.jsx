import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import calcTotalPrice from '../lib/calcTotalPrice';
import Error from './ErrorMessage';
import User, {CURRENT_USER_QUERY} from './User';

const CREATE_ORDER_MUTATION = gql`
    mutation CREATE_ORDER_MUTATION($token:String!){
        createOrder(token:$token){
            id  
            charge
            total
            items{
                id
                title
            }
        }
    }
`;

class TakeMyMoney extends Component {
    totalItems(cart){
        return cart.reduce((tally,cartItem)=> tally + cartItem.quantity,0)
    }

    onToken = async (res,createOrder)=>{
        NProgress.start();
        // console.log(res)
        const order = await createOrder({
            variables:{
                token: res.id
            }
        }).catch(err => alert(err.message));
        // console.log(order)
        Router.push({
            pathname:'/order',
            query:{ id: order.data.createOrder.id }
        })
    }

    render() {
        return (
            <User>
               {({ data:{ me } })=>(
                   <Mutation mutation={CREATE_ORDER_MUTATION} refetchQueries={[{query:CURRENT_USER_QUERY}]}>
                       {(createOrder)=>(
                           <StripeCheckout
                                amount={calcTotalPrice(me.cart)}
                                name="Game Store"
                                description={`Order of ${this.totalItems(me.cart)} games`}
                                image={ me.cart.length && me.cart[0].item && me.cart[0].item.image}
                                stripeKey="pk_test_p5Adg8OVVtG97z2QLN8xyTE000XWUwKI3Y"
                                currency="USD"
                                email={me.email}
                                token={res => this.onToken(res, createOrder)}
                                billingAddress={true}
                        >
                            {this.props.children}
                        </StripeCheckout>   
                       )}
                   </Mutation>
               )} 
            </User>
        );
    }
}

export default TakeMyMoney;