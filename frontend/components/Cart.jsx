import React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import User from './User';
import CartItem from './CartItem';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import { adopt } from 'react-adopt';
import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';
import TakeMyMoney from './TakeMyMoney';

export const LOCAL_STORE_QUERY = gql`
    query{
        cartOpen @client
    }
`;

export const TOGGLE_CART_MUTATION = gql`
    mutation{
        toggleCart @client
    }
`;

const Compose =adopt({
    user: ({render}) => <User>{render}</User>,
    toggleCart:({render}) =>  <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>,
    localState: ({render}) => <Query query={LOCAL_STORE_QUERY}>{render}</Query>
})

const Cart = () =>{
    return(
        <Compose>
            {({user, toggleCart, localState})=>{
                const { me } = user.data
                if(!me) return null;
                return(
                    <CartStyles open={localState.data.cartOpen}>
                        <header>
                            <CloseButton onClick={toggleCart} title="close">&times;</CloseButton>
                            <Supreme>{me.name} Cart</Supreme>
                            <p>You Have {me.cart.reduce((tally, cartItem)=>tally + cartItem.quantity,0)} item{me.cart.length === 1 ? '' : 's' } in your cart</p>
                        </header>
                        <ul>
                            {me.cart.map((cartItem, index)=> <CartItem cartItem={cartItem} key={index}/>)}
                        </ul>
                        <footer>
                            <p>Total: {formatMoney(calcTotalPrice(me.cart))}</p>
                            {me.cart.length &&(
                                <TakeMyMoney>
                                    <SickButton>Checkout</SickButton>
                                </TakeMyMoney>
                            )}
                            
                        </footer>
                </CartStyles>                 
            )}}
        </Compose>
        
    )
}

export default Cart;