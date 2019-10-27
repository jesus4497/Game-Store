import React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql  from 'graphql-tag';
import Error from './ErrorMessage';
import Table from './styles/Table';
import SickButton from './styles/SickButton';
import PropTypes from 'prop-types';

const ALL_USERS_QUERY = gql`
    query{
        users{
            id
            name
            email
            permissions
        }
    }
`;

const UPDATE_PERMISSIONS_MUTATION = gql`
    mutation UPDATE_PERMISSIONS_MUTATION(
        $permissions: [Permission],
        $id: ID!
    ){
        updatePermissions(
            permissions: $permissions
            id: $id
        ){
            id
            name
            email
            permissions
        }
    }

`;

const possiblePermisions =[
    'ADMIN',
    'USER',
    'ITEMCREATE',
    'ITEMUPDATE',
    'ITEMDELETE',
    'PERMISSIONUPDATE',
]

const Permissions = props =>(
    <Query query={ALL_USERS_QUERY}>
        {({data,loading,error})=>{
            <Error error={error}/>
            return(
                <>
                    <p>Welcome admin</p>
                    <Table>
                        <thead>
                            <tr>
                                <th>name</th>
                                <th>email</th>
                                {possiblePermisions.map((permission, index) => <th key={index}>
                                    {permission}
                                </th>)}
                                <th>Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.users.map((user,index) => <UserPermission user={user} key={index} />)}
                        </tbody>
                    </Table>
                </>
            )
        }}
    </Query>
)

class UserPermission extends React.Component{
    static propTypes={
        user: PropTypes.shape({
            name: PropTypes.string,
            email: PropTypes.string,
            id: PropTypes.strind,
            permissions: PropTypes.array,
        }).isRequired
    }

    state ={
        permissions:this.props.user.permissions
    }
    
    handleCheckbox = event =>{
        const checkbox = event.target;
        let updatedPermissions = [...this.state.permissions];
        if(checkbox.checked){
            updatedPermissions.push(checkbox.value)
        }else{
            updatedPermissions = updatedPermissions.filter(permission => permission !== checkbox.value)
        }
        this.setState({
            permissions: updatedPermissions
        })
        
    }

    render(){
        const {user} = this.props
        return(
            <Mutation mutation={UPDATE_PERMISSIONS_MUTATION} variables={{
                id: user.id,
                permissions: [...this.state.permissions]
            }}>
                {(updatePermissions,{loading,error})=>{
                    if(error) return <Error error={error}/>
                    return(
                        <tr>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            {possiblePermisions.map((permission,index)=>(
                                <td key={index}>
                                    <label htmlFor={`${user.id}-permission-${permission}`}>
                                        <input 
                                            id={`${user.id}-permission-${permission}`}
                                            type="checkbox"
                                            checked={this.state.permissions.includes(permission)}
                                            value={permission}
                                            onChange={this.handleCheckbox}
                                        />
                                    </label>

                                </td>
                            ))}
                            <td>
                                <SickButton disabled={loading} onClick={updatePermissions}>Updat{loading ? 'ing' : 'e'}</SickButton>
                            </td>
                        
                        </tr>
                    )
                
                }}
            </Mutation>
        )
    }
}
export default Permissions