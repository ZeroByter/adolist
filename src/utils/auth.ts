import { getAuth } from "firebase/auth";
import firebaseApp from "./firebase";

const firebaseAuth = getAuth(firebaseApp);

export default firebaseAuth;
