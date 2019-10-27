import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNIN_MUTATION = gql`
    mutation SIGNIN_MUTATION(
        $email: String!
        $password: String!
    ){
        signin(email:$email, password:$password){
            id
            email
            password
            name
        }
    }
`

class Signin extends Component {
    state={
        name:'',
        password:'',
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
                mutation={SIGNIN_MUTATION} 
                variables={{
                    ...this.state
                }}
                refetchQueries={[{query: CURRENT_USER_QUERY}]}
            >
                {(signin,{loading,error})=>{
                    return(

                        <Form method="post" onSubmit={event=> {
                            event.preventDefault()
                            signin()
                        }}>
                            <fieldset disabled={loading} aria-busy={loading}>
                                <h2>Sign In to your account!</h2>
                                <Error error={error}/>

                                <label htmlFor="email">
                                    Email
                                    <input type="email" name="email" placeholder="example@example.com" onChange={this.handleInput}/>
                                </label>

                                <label htmlFor="password">
                                    Password
                                    <input type="password" name="password" placeholder="Your Password" onChange={this.handleInput}/>
                                </label>

                                <button type="submit">Sign in!</button>
                            
                            </fieldset>
                        </Form>
                    )
                }}
            </Mutation>
        );
    }
}

export default Signin;