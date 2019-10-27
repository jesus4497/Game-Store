import React from 'react';
import gql from 'graphql-tag';
import Link from 'next/link';
import { Query } from 'react-apollo';
import PaginationStyles from './styles/PaginationStyles';
import {perPage} from '../config';

const PAGINATION_QUERY = gql`
    query PAGINATION_QUERY{
        itemsConnection{
            aggregate{
                count
            }
        }
    }
`

const Pagination = props=>(
    <Query query={PAGINATION_QUERY}>

        {({data,loading,error})=>{

            if(loading) return <p>Loading...</p>
            if(error) return <p>{error.message}</p>
            const count = data.itemsConnection.aggregate.count;
            const pages = Math.ceil(count / perPage)
            const page = props.page;
            // parseFloat(pages)
            return(
                <PaginationStyles>
                    <Link 
                    prefetch
                    href={{
                        pathname:'games',
                        query:{page: page - 1}
                    }}>
                        <a aria-disabled={page <= 1}> Prev</a>

                    </Link>
                    
                    <p>{`page ${page} of ${pages}`}</p>
                    <p>{`${count} Games total`}</p> 

                    <Link 
                    prefetch
                    href={{
                        pathname:'games',
                        query:{page: page + 1}
                    }}>
                        <a aria-disabled={page >= pages}> Next</a>

                    </Link>
                </PaginationStyles> 
            )
        }}

    </Query>
)

export default Pagination