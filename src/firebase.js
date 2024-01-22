import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBqPaRNxLM35cVv62FIopjt0YdoWx8ssXo",
    authDomain: "task-manager-81c3b.firebaseapp.com",
    projectId: "task-manager-81c3b",
    storageBucket: "task-manager-81c3b.appspot.com",
    messagingSenderId: "788005390697",
    appId: "1:788005390697:web:7da95739a5ce27531bd5f8",
    measurementId: "G-ZXPPPE2DHN"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getDatabase(app);

export { auth };