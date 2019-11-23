import homeNA from './homeNA';
import homeA from './homeA';
import Navbar from './Navbar';
import loginForm from './loginForm';
import firstlogin from './firstlogin';
import recovery from './recovery';
import reset from './reset';
import login from './login';
import user from './user';
import mngContract from './mngContract';
import mngUser from './mngUser';

export default {
    pages: {
      homeNA,
      homeA,
      firstlogin,
      recovery,
      reset,
      login,
      user,
      mngContract,
      mngUser
    },
    components: {
        Navbar,
        loginForm
    }
}