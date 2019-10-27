import React from 'react';
import Downshift, {resetIdCounter} from 'downshift';
import Router from 'next/router';
import { ApolloConsumer } from 'react-apollo'; // with this we can run queries on demand and not on page load !
import gql from 'graphql-tag';
import debounce from 'lodash.debounce'; //debounce its gonna make sure to fire an event after some time has passed.
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const SEARCH_ITEM_QUERY = gql`
    query SEARCH_ITEM_QUERY($searchTerm: String!){
        items(where:{
            OR:[
                {title_contains: $searchTerm},
                {description_contains: $searchTerm},
            ]      
        }){
            id
            image
            title
        }
    }
`;

class Search extends React.Component {
    state={
        items:[],
        loading: false,

    }
    
    onChange = debounce(async (event, client)=>{
         // turn loading on
        this.setState({...this.state, loading:true})
        // manually query apollo client
        const res = await client.query({
            query:SEARCH_ITEM_QUERY,
            variables: {searchTerm: event.target.value}
        })

        this.setState({
            ...this.state,
            items: res.data.items,
            loading: false
        })
    },350)

    routeToItem(item){
        Router.push({
            pathname: '/item',
            query:{
                id:item.id
            }

        })
    }

    render(){
        resetIdCounter(); 
        return(
            <SearchStyles>
                <Downshift onChange={this.routeToItem} itemToString={item=> item === null ? '' : item.title}>
                    {({getInputProps, getItemProps, isOpen,inputValue, highlightedIndex})=>(
                        <div>
                            <ApolloConsumer>
                                {(client)=>(
                                    <input 
                                    
                                    {...getInputProps({
                                        type:"search",
                                        placeholder:"Search for an Item",
                                        id: 'search',
                                        className: this.state.loading ? 'loading' : '',
                                        onChange: e=>{
                                            e.persist();
                                            this.onChange(e,client)
                                        }}
                                    )} 
                                    />  
                                )}
                            </ApolloConsumer>
                            {isOpen && (
                                <DropDown>
                                    {this.state.items.map((item,index)=>
                                        <DropDownItem 
                                            {...getItemProps({ item })}
                                            key={item.id}
                                            highlighted={index === highlightedIndex}
                                        >
                                            <img width="100" src={item.image} alt={item.title}/>
                                            <p>{item.title}</p>
                                        </DropDownItem>
                                    )}
                                    {!this.state.items.length && !this.state.loading &&(
                                        <DropDownItem>
                                            <p>Nothing found for {inputValue}</p>
                                        </DropDownItem>
                                    )}
                                </DropDown>
                            )}
                        </div>
                    )}
                </Downshift>
            </SearchStyles>
        )
    }
}
export default Search;