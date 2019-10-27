import ResetPassword from '../components/Reset';

const Reset = ({query})=>(
    <ResetPassword token={query.resetToken}/>
)

export default Reset;