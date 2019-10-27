import { Mutation } from 'react-apollo';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

const BigButton = styled.button`
    font-size: 3rem;
    background: none;
    border: 0;
    &:hover{
        color: ${props => props.theme.red}
    }

`;

const REMOVE_FROM_CART_MUTATION = gql`
    mutation REMOVE_FROM_CART_MUTATION($id:ID!){
        removeFromCart(id:$id){
            id    
        }
    }
`;

const RemoveFromCart = props => {
    
    // This gets called as soon as we get a response back from the server after a mutation has been performed
    const update = (cache,payload) =>{
        // first read the cache
        const data = cache.readQuery({ query: CURRENT_USER_QUERY });
        // remove the item from the cart
        const cartItemId = payload.data.removeFromCart.id;
        data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId);
        // write it back to the cache
        cache.writeQuery({query: CURRENT_USER_QUERY, data})

    }   
    
    return(
    
        <Mutation 
            mutation={REMOVE_FROM_CART_MUTATION} 
            variables={{ id: props.id }}
            update={update}
            optimisticResponse={{
                __typename: 'Mutation',
                removeFromCart:{
                    __typename: 'CartItem',
                    id: props.id
                }
            }}
        >
            {(removeFromCart,{loading})=>(
                <BigButton disabled={loading} onClick={()=>removeFromCart().catch(err=>alert(err.message))}>
                    &times; 
                </BigButton>
            )}

        </Mutation>
    )
}

RemoveFromCart.propTypes = {
    id: PropTypes.string.isRequired,
}

export default RemoveFromCart;