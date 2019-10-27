import React, { Component } from 'react';
import styled, { ThemeProvider, injectGlobal } from 'styled-components'
//components
import Header from './Header';
import Meta from './Meta';

//Global Variables
const theme = {
    blue: '#1B2E40',
    black: '#0F1B26',
    grey: '#3A3A3A',
    red: '#BF3F4A',
    lightgrey: '#E1E1E1',
    offWhite: '#EDEDED',
    maxWidth: '1000px',
    bs: '0 12px 24px 0 rgba(0, 0, 0, 0.09)',
  };

//Styles from the Pages in general
const StyledPage = styled.div`
    color: ${props => props.theme.black};
    background-color:white;
`;

//Styles for the items
const Inner = styled.div`
    max-width:${props => props.theme.maxWidth};
    margin:0 auto;
    padding: 2rem;
`;

//Global css
injectGlobal`
    @font-face {
        font-family:'radnika_next' ;
        src: url('/static/radnikanext-medium-webfont.woff2')
        format('woff2');
        font-weight: normal;
        font-style:normal;
    }

    html{
        box-sizing: border-box;
        font-size: 10px;
    }

    *, *:before, *:after {
        box-sizing: inherit;
    }

    body{
        margin: 0;
        padding:0;
        font-size: 1.5rem;
        line-height: 1.5;
        font-family:'radnika_next';
    }

    a{
        text-decoration:none;
        color: ${theme.black}
    }

    button{
        cursor:pointer;
    }
`;

class Page extends Component {
    render() {
        return (
            <ThemeProvider theme={theme}>
                <StyledPage>  
                    <Meta/>
                    <Header/>
                    <Inner>
                        {this.props.children}
                    </Inner>
                </StyledPage>
            </ThemeProvider>
        )
    }
}
export default Page