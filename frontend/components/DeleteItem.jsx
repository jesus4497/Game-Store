import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ALL_ITEMS_QUERY } from './Items';

const DELETE_ITEM_MUTATION = gql`
    mutation DELETE_ITEM_MUTATION(
        $id: ID!
    ){
        deleteItem(id:$id){
           id
        }
    }
`

class DeleteItem extends Component {
    update = (cache,payload)=>{
        // manually update the cache on the client so it matches the server
        // read the cache
        const data = cache.readQuery({query: ALL_ITEMS_QUERY})
        // filter the deleted item out of the page 
        // console.log(data,payload)
        data.items = data.items.filter(item => item.id !== payload.data.deleteItem.id);
        //put the items back
        cache.writeQuery({query: ALL_ITEMS_QUERY, data})

    }
    render() {
        return (
            <Mutation 
            mutation={DELETE_ITEM_MUTATION} 
            variables={this.props.id}
            update={this.update}
            >
                {(deleteItem,{error}) =>(
                
                    <button onClick={()=>{
                        if(confirm('Are you sure do you want to delete this?')){
                            deleteItem().catch(error=>alert(error.message))
                        }
                    }}>
                        {this.props.children}
                    </button>

                )}
            </Mutation>
        
        );
    }
}

export default DeleteItem;