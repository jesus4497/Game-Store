import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';


const RESET_PASSWORD_MUTATION = gql`
    mutation RESET_PASSWORD_MUTATION(
        $resetToken: String!,
        $password: String!,
        $confirmPassword:String!
    ){
        resetPassword(resetToken: $resetToken, password: $password, confirmPassword: $confirmPassword){
            id
            email
            name
        }
    }
`

class Reset extends Component {
    state={
        password:'',
        confirmPassword:'',
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
                mutation={RESET_PASSWORD_MUTATION} 
                variables={{
                    ...this.state,
                    resetToken:this.props.token
                }}
                refetchQueries={[{query:CURRENT_USER_QUERY}]}
            >
                {(reset,{loading,error,called})=>{
                    return(

                        <Form method="post" onSubmit={event=> {
                            event.preventDefault()
                            reset()
                        }}>
                            <fieldset disabled={loading} aria-busy={loading}>
                                <h2>New Password!</h2>
                                <Error error={error}/>
                                {!loading && !error && called && <p>All done! You are already log in.</p>}
                                <label htmlFor="password">
                                    Password
                                    <input type="password" name="password" placeholder="password super strong" onChange={this.handleInput}/>
                                </label>

                                <label htmlFor="confirmPassword">
                                    Confirm Password
                                    <input type="password" name="confirmPassword" placeholder="password super strong" onChange={this.handleInput}/>
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

export default Reset;