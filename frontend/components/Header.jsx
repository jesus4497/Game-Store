import Nav from './Nav';
import styled from 'styled-components';
import Link from 'next/link';
import Router from 'next/router';
import NProgress from 'nprogress';
import Cart from './Cart';
import Search from './Search';


// routeChangeStart(url) - Fires when a route starts to change
// routeChangeComplete(url) - Fires when a route changed completely
// routeChangeError(err, url) - Fires when there's an error when changing routes, or a route load is cancelled

Router.onRouteChangeStart = () =>{
    NProgress.start()
}

Router.onRouteChangeComplete = () =>{
    NProgress.done()
}

Router.onRouteChangeError = () =>{
    NProgress.done()
}

const Logo = styled.h1`
    font-size: 4rem;
    margin-left: 2rem;
    position:relative;
    transform: skew(-7deg);
    
    a{
        text-decoration:none;
        color:white;
        background-color: ${props =>props.theme.blue};
        padding:0.5rem 1rem;
        text-transform: uppercase
    }

    @media (max-width: 1300px){
        margin:0;
        text-align:center
    }
    
`;

const StyleHeader = styled.header`
    .bar{
        border-bottom: 10px solid ${props => props.theme.red};
        display:grid;
        grid-template-columns: 1fr auto;
        justify-content: space-between;
        align-items: stretch;
        @media (max-width:1300px){
            grid-template-columns: 1fr;
            justify-content:center;
        }
    }

    .sub-bar{
        border-bottom: 1px solid ${props => props.theme.lightgrey};
        display:grid;
        grid-template-columns: 1fr auto;
    }
`;

const Header = ()=>(
    <StyleHeader>

        <div className="bar">
            <Logo>
                <Link href="/">
                    <a>GameStore</a>
                </Link>
            </Logo>
            <Nav/>
        </div>

        <div className="sub-bar">
            <Search/>
        </div>

        <Cart></Cart>
        
    </StyleHeader>
)

export default Header

