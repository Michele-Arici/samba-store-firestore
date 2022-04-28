import { getCookie } from "./sambaCookies.js";
import { getFirestore, doc, getDoc, getDocs, collection, addDoc, deleteDoc, updateDoc, query, where, setDoc } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// get realtyme databse reference
// self. to let firebase be global from other modules
self.firestore = getFirestore(app);


let subtotal = 0;
let cart_total = 0;
// let albumRef = doc(firestore, "artists", "1BNyvucKgxledBmyCVRc");
// let album = (await getDoc(albumRef)).data();
// console.log(album);

let cartRef = doc(firestore, "customers/", getCookie('user_id'));
let cart = (await getDoc(cartRef)).data()['cart'];

function DisplayCart() {

    //Object.keys(myObj).length gives the length of an object
    if (Object.keys(cart).length > 1) {
        $("#show_total").append(`<tbody>
                <tr style="border-style: hidden; font-size: 20px; font-weight: 500;">
                    <td colspan="4" class="strong text-end">Subtotal</td>
                    <td class="text-end w-1" id="subtotal"></td>
                </tr>
                <tr style="font-size: 15px; font-weight: 500;">
                    <td colspan="4" class="strong text-end">Site fees</td>
                    <td class="text-end w-1">$2.00</td>
                </tr>
                <tr style="font-size: 30px; font-weight: 700;">
                    <td colspan="4" class="strong text-end">Total</td>
                    <td class="text-end w-1" id="total"></td>
                </tr>
            </tbody>`);//printing out the "checkout thing"

        cart.forEach((item) => {
            if (item.key != "initialize") {

                let current_track_ref = doc(firestore, "tracks/", item.val());
                let current_artist_id = (getDoc(current_track_ref)).data()['ID_AR'];
                let current_track_artist_ref = doc(firestore, "tracks/", current_artist_id);

                let current_track_name = (getDoc(current_track_ref)).data()['name'];

                let current_track_cost = (getDoc(current_track_ref)).data()['price'];

                let current_track_album_id = (getDoc(current_track_ref)).data()['ID_A'];


                let current_track_artist = (getDoc(current_track_artist_ref)).data()['name'];

                let current_track_artist_surname = (getDoc(current_track_artist_ref)).data()['surname'];



                subtotal += current_track_cost;

                let new_currently_in_cart = `<div class="col-12">
                            <div class="row align-items-center">
                                <a class="col-auto">
                                    <span class="avatar" style="background-image: url(${current_track_image})"></span>
                                </a>
                                <div class="col text-truncate">
                                    <a href="./show.html?ID_A=${current_track_album_id}&ID_T=${current_track_id}" class="text-reset d-block text-truncate" style="font-weight: 500; line-height: 1;">${current_track_name}</a>
                                    <a href="./artist.html?ID_AR=${current_artist_id}" class="text-muted text-truncate mt-n1" style="font-weight: 400;">${current_track_artist} ${current_track_artist_surname}</a>
                                </div>
                                <div class="text-muted col-auto">
                                    ${current_track_cost}$
                                </div>
                                <div class="col-auto">
                                    <a href="#" id="remove_${item.key}" class="btn btn-outline-danger btn-icon"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg></a>
                                </div>
                                <hr style="width:96%; margin-left:2% !important; margin-right:2% !important; margin-top:10px !important; margin-bottom:10px !important;">
                            </div>
                        </div>`;

                $("#show_tracks").append(new_currently_in_cart);

                //Math.round(subtotal * 10) / 10
                //arrotonda la variabile subtotal ad intera. viene moltiplicata *100 e divisa *100 per tenere 2 cifre decimali che andrebbero perse nel round
                cart_total = `\$${Math.round(subtotal * 100) / 100 + 2}`;
                document.getElementById("subtotal").innerHTML = `\$${Math.round(subtotal * 100) / 100}`;
                document.getElementById("total").innerHTML = cart_total;
                let queryID = `#remove_${item.key}`;
                let remove = document.querySelector(queryID);

                remove.addEventListener('click', (e) => {
                    deleteDoc(doc(firestore, "customers/" + getCookie('user_id'), "/cart/" + item.key));

                    window.location.reload();
                });


            }
        });
    } else {
        document.getElementById('buy_tracks_div').innerHTML = "";
        $("#show_tracks").append(`<div class="container-tight py-4">
                <div class="empty">
                    <div class="empty-img"><img src="https://preview.tabler.io/static/illustrations/undraw_quitting_time_dm8t.svg"
                            alt="" height="128">
                    </div>
                    <p class="empty-title">The cart is empty</p>
                    <p class="empty-subtitle text-muted">
                        Explore the tracks in our store and add them to the cart
                    </p>
                    <div class="empty-action">
                        <a href="./browse.html" class="btn btn-primary">
                            <!-- Download SVG icon from http://tabler-icons.io/i/arrow-left -->
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24"
                                viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <line x1="5" y1="12" x2="11" y2="18"></line>
                                <line x1="5" y1="12" x2="11" y2="6"></line>
                            </svg>
                            Explore some tracks
                        </a>
                    </div>
                </div>
            </div>`)
    }
}

DisplayCart();

// ///buy things////
const buyTracks = document.getElementById('buy_tracks');

buyTracks.addEventListener('click', (e) => {


    let cartRef = (getDoc(doc(firestore, "customers/", getCookie('user_id')))).data()['cart'];


    if (Object.keys(items.val()).length > 1) {
        items.forEach(element => {
            if (element.key != "initialize") {
                let json = { track: element.val()['track'] };

                firebase.database().ref("customers/" + getCookie('user_id') + "/owned_tracks/").push(json).key;//add
                addDoc(getDoc(doc(firestore, "customers/" + getCookie('user_id'), "/owned_tracks/")), {
                    Date: today.toLocaleDateString(),
                    ID_C: getCookie('user_id'),
                    ID_T: element.val()['track']
                });
                let today = new Date();

                addDoc(collection(firestore, "order/"), {
                    Date: today.toLocaleDateString(),
                    ID_C: getCookie('user_id'),
                    ID_T: element.val()['track']
                });

                deleteDoc(doc(firestore, "customers/" + getCookie('user_id'), "/cart/" + element.key));
            }
        });
    } else {
        $('#modal-error').modal('show');
    }


    //Lascio tempo al client di inviare la richiesta prima del redirect. 
    setTimeout(function () {
        document.getElementById('show_tracks').innerHTML = '';
        document.getElementById('show_total').innerHTML = '';
        document.getElementById('modal_success_text').innerHTML = `Your payment of ${cart_total}$ has been successfully submitted. If you have any problem contact us.`;

        DisplayCart();
        $('#modal-success').modal('show');

    }, 500);
});

///buy things////