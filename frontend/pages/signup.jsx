import Signup from '../components/Signup';
import Signin from '../components/Signin';
import RequestReset from '../components/RequestReset';
import styled from 'styled-components';

const Column = styled.div`
    display:grid;
    grid-template-columns: repeat(auto-fit, minmax(300px,1fr));
    grid-gap: 20px;

`

const SignupPage = () =>{
    return(
        <Column>
            <Signup/>
            <Signin/>
            <RequestReset/>
        </Column>
    )}
export default SignupPage
