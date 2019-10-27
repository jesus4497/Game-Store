import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
    mutation REQUEST_RESET_MUTATION(
        $email: String!
    ){
        requestReset(email:$email){
            message
        }
    }
`

class RequestReset extends Component {
    state={
        email:'',
    }

    handleInput = event =>{
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value
        })
    }
    render() {
        return (
            <Mutation 
                mutation={REQUEST_RESET_MUTATION} 
                variables={{
                    ...this.state
                }}
            >
                {(reset,{loading,error,called})=>{
                    return(

                        <Form method="post" onSubmit={event=> {
                            event.preventDefault()
                            reset()
                        }}>
                            <fieldset disabled={loading} aria-busy={loading}>
                                <h2>Request a password reset</h2>
                                <Error error={error}/>
                                {!loading && !error && called && <p>All done! Please check your email.</p>}
                                <label htmlFor="email">
                                    Email
                                    <input type="email" name="email" placeholder="example@example.com" onChange={this.handleInput}/>
                                </label>

                                <button type="submit">Request</button>
                            
                            </fieldset>
                        </Form>
                    )
                }}
            </Mutation>
        );
    }
}

export default RequestReset;