import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { getFirestore, doc, getDoc, getDocs, collection, addDoc, deleteDoc, updateDoc, query, where, setDoc } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js";

//import { addCustomer } from '/scripts/sambaDB.js';
import { auth } from '/scripts/firebase-config.js';
import { getCookie, setCookie, eraseCookie } from '/scripts/sambaCookies.js';


// Initialize Firebase
const app = initializeApp(firebaseConfig);
// get realtyme databse reference
// self. to let firebase be global from other modules
self.firestore = getFirestore(app);



const email = getCookie('user_email');

if (email == null) {

    //REGISTRAZIONE
    const signupForm = document.querySelector('#signup_form');
    function checkSignUpInvalidSyntax(email, password) {
        //Resetting the innerHTML errors
        document.getElementById('email_invalid_feed').innerHTML = "";
        document.getElementById('pass_invalid_feed').innerHTML = "";
        document.getElementById('tos_invalid_feed').innerHTML = "";
        //Resettingb the innerHTML errors


        //Checking the syntax
        let isCorrectFormat = true;

        if (email == '') {
            document.getElementById('email_invalid_feed').innerHTML = "Insert a valid email address.";
            isCorrectFormat = false;
        }
        if (password == '') {
            document.getElementById('pass_invalid_feed').innerHTML = "Insert a password";
            isCorrectFormat = false;
        }
        if (!signupForm['tos_agreement'].checked) {
            document.getElementById('tos_invalid_feed').innerHTML = "You need to accept TOS in order to continue";
            isCorrectFormat = false;
        }
        return isCorrectFormat;
    }

    function checkSignInInvalidSyntax(email, password) {
        //reset previous innerHTML messages
        document.getElementById('signin_email_invalid_feed').innerHTML = "";
        document.getElementById('signin_pass_invalid_feed').innerHTML = "";
        //reset previous innerHTML messages

        let isCorrectFormat = true;

        if (email == '') {
            document.getElementById('signin_email_invalid_feed').innerHTML = "Insert a valid email address.";
            isCorrectFormat = false;
        }

        if (password == '') {
            document.getElementById('signin_pass_invalid_feed').innerHTML = "Insert a password";
            isCorrectFormat = false;
        }
        return isCorrectFormat;
    }

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        //get user info
        const email = signupForm['signup_email'].value;
        const password = signupForm['signup_password'].value;

        // Da uncommentare quando è stata aggiunta sta roba alla casella di registrazione
        // const firstName = signupForm['signup_firstName'].value;
        // const surname = signupForm['signup_surname'].value;
        // const phone_number = signupForm['signup_phoneNumber'].value;
        // const city = signupForm['signup_city'].value;



        const isCorrectFormat = checkSignUpInvalidSyntax(email, password);

        if (isCorrectFormat) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    addDoc(collection(firestore, "customers/"), {
                        email: email,
                        owned_tracks: { initialize: "" },
                        cart: { initialize: "" },
                        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/OOjs_UI_icon_userAvatar.svg/2048px-OOjs_UI_icon_userAvatar.svg.png"
                    });
                    //Se funziona la registrazione nascondo il modale del signup e mostro quello del signin
                    $('#signUpModal').modal('hide');
                    $('#signInModal').modal('show');
                })
                .catch((error) => {
                    const errorCode = error.code;

                    if (errorCode == 'auth/email-already-in-use') {
                        document.getElementById('email_invalid_feed').innerHTML = "Email already in use. Use another one";
                    }
                    if (errorCode == 'auth/weak-password') {
                        document.getElementById('pass_invalid_feed').innerHTML = "The password is too weak. It has to be at least 6 characters long";
                    }
                });
        }

    });

    const signinForm = document.querySelector('#signin_form');

    signinForm.addEventListener('submit', (e) => {
        e.preventDefault();

        //get user info
        const email = signinForm['signin_email'].value;
        const password = signinForm['signin_password'].value;
        //const rememberLogin = signinForm['remember_login'].value;


        const isCorrectFormat = checkSignInInvalidSyntax(email, password);


        if (isCorrectFormat) {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 

                    ///NON FUNZIONA
                    ///NON FUNZIONA
                    ///NON FUNZIONA

                    let user_id = "";


                    // const customers_ref = collection(firestore, 'customers/');
                    // const customers = getDocs(query(customers));

                    // customers.forEach(async customer => {
                    //     const email = customer.data()['email'];
                    //     console.log(email);
                    // });

                    // // let customers = doc(firestore, "customers");
                    // let current_artist_id = async(getDoc(customers));

                    // console.log(current_artist_id);


                    // user_id = customers;

                    // console.log(user_id);

                    // if (document.getElementById('remember_login').checked) {
                    //     //(nomeCookie, valore che vuoi dare al cookie, durata cookie: 1 equivale ad 1 giorno)
                    //     setCookie("user_id", user_id, 365);
                    //     setCookie("user_email", email, 365);
                    //     setCookie("user_password", password, 365);
                    // } else {
                    //     setCookie("user_id", user_id, 0.24);
                    //     setCookie("user_email", email, 0.24);
                    //     setCookie("user_password", password, 0.24);
                    // }

                    // location.reload(); //Aggiorna la pagina


                })
                .catch((error) => {
                    const errorCode = error.code;

                    if (errorCode == 'auth/wrong-password' || errorCode == 'auth/user-not-found') {
                        document.getElementById('signin_check_invalid_feed').innerHTML = "Incorrect email or password";
                    }
                });
        }
    });
}


