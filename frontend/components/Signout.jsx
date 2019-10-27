import {CURRENT_USER_QUERY} from './User';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const SIGN_OUT_MUTATION = gql`
    mutation SIGN_OUT_MUTATION{
        signout{
            message
        }
    }
`;

const Signout = ()=>(
    <Mutation mutation={SIGN_OUT_MUTATION} refetchQueries={[{query: CURRENT_USER_QUERY}]}>
        {(signout,{error})=>{
            if(error) return <p>Something went wrong. YOU ARE HERE FOREVER</p>
            return(
                <button onClick={signout}>Sign Out</button> 
            )
        }}

    </Mutation>
)

export default Signout