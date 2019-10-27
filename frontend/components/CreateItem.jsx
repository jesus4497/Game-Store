import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

export const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
        $title: String!
        $description: String!
        $price: Int!
        $image: String
        $largeImage: String
    ){
        createItem(
            title: $title
            description: $description
            price: $price
            image: $image
            largeImage: $largeImage
        ){
            id
        }
    }
`;

class CreateItem extends Component {
    state={
        title:'',
        description:'',
        price:0,
        image:'',
        largeImage:'',
    }
    
    handleInput = event => {
        const {name, type, value} = event.target;
        const val = type === 'number' ? parseFloat(value) : value;

        this.setState({
            ...this.state,
            [name]: val
        })
    }

     uploadImage = async event =>{
        const images = event.target.files;
        const data = new FormData();
        data.append('file',images[0]);
        data.append('upload_preset','gamestore');
        if(this.state.image===''){

                document.getElementById('form').disabled = true;
               
                const res = await fetch('https://api.cloudinary.com/v1_1/dwbeg8tie/image/upload',{
                method:'POST',
                body:data
            });

            
            const image = await res.json();
            console.log(image)
            console.log('hereIam')
            this.setState({
                ...this.state,
                image: image.secure_url,
                largeImage: image.eager[0].secure_url
            })
            document.getElementById('form').disabled = false;
        }
        

    }


    render() {
        return (
            <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
                {(createItem,{loading,error})=>(
                    <Form  onSubmit={ async event=> {
                        event.preventDefault()
                        //execute the mutattion
                        const res = await createItem()
                        
                        //redirect
                        Router.push({
                            pathname: '/item',
                            query:{id: res.data.createItem.id}
                        })
                        }}
                    >
                        <Error error={error}/>
                        {/* when loading is true its going to disabled. */}
                        <fieldset id="form" disabled={loading} aria-busy={loading}> 
                            <label htmlFor="title">
                                    <h2>Title</h2>
                                    
                                    <input 
                                        type="text" 
                                        id="title" 
                                        name="title" 
                                        placeholder="Title" 
                                        required
                                        onChange={this.handleInput} 
                                    />

                            </label>
                            <label htmlFor="price">
                                    <h2>Price</h2>

                                    <input 
                                        type="number" 
                                        id="price" 
                                        name="price" 
                                        placeholder="price" 
                                        required 
                                        onChange={this.handleInput} 
                                    />
                            </label>
                            <label htmlFor="description">
                                    <h2>Description</h2>

                                    <textarea
                                        type="text" 
                                        id="description" 
                                        name="description" 
                                        placeholder="Enter a description" 
                                        required 
                                        onChange={this.handleInput} 
                                    />
                            </label>

                            <label htmlFor="Image">
                                    <h2>Image</h2>

                                    <input
                                        type="file" 
                                        id="Image" 
                                        name="Image" 
                                        placeholder="Enter a Image" 
                                        required 
                                        onChange={this.uploadImage} 
                                    />
                            </label>
                            <button type="submit">Submit</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>
        );
    }
}

export default CreateItem;