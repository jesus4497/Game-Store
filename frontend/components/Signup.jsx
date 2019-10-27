import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNUP_MUTATION = gql`
    mutation SIGNUP_MUTATION(
        $email: String!
        $password: String!
        $name: String!
    ){
        signup(email:$email, password:$password, name: $name){
            id
            email
            password
            name
        }
    }
`

class Signup extends Component {
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
                mutation={SIGNUP_MUTATION} 
                variables={{
                    ...this.state
                }}
                refetchQueries={[{query: CURRENT_USER_QUERY}]}
            >
                {(signup,{loading,error})=>{
                    return(

                        <Form method="post" onSubmit={event=> {
                            event.preventDefault()
                            signup()
                        }}>
                            <fieldset disabled={loading} aria-busy={loading}>
                                <h2>Are you new? REGISTER</h2>
                                <Error error={error}/>
                                <label htmlFor="Username">
                                    Username
                                    <input type="text" name="name" placeholder="LucasFilm" onChange={this.handleInput}/>
                                </label>

                                <label htmlFor="email">
                                    Email
                                    <input type="email" name="email" placeholder="example@example.com" onChange={this.handleInput}/>
                                </label>

                                <label htmlFor="password">
                                    Password
                                    <input type="password" name="password" placeholder="Your Password" onChange={this.handleInput}/>
                                </label>

                                <button type="submit">Sign up!</button>
                            
                            </fieldset>
                        </Form>
                    )
                }}
            </Mutation>
        );
    }
}

export default Signup;