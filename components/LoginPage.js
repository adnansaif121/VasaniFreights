"use client"; // This is a client component 👈🏽

import React, { useEffect, useState } from 'react'
import styles from '../styles/LoginPage.module.css'
import firebase, {auth, database} from '../config/firebase';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'next/router'

export default function LoginPage(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        // const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uid = user.uid;
                // props.allow();
                // ...
            } else {
                // User is signed out
                // ...
                console.log("Please log in");
            }
        });
    }, [])

    const handleLogin = () => {

        // const auth = getAuth();
        signInWithEmailAndPassword(auth, username, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // window.location.href = "/dashboard"
                router.push('../components/Dashboard');
                props.allow();
                // ...
                alert("Login Successful", user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert("Invalid Input "+username+" "+password);
            });
    }


    return (
        <>
            <div className={styles.LoginBox}>
                <div className={styles.box}>
                    <div className={styles.form}>
                        <h2>Login</h2>
                        <div className={styles.inputBox}>
                            <input
                                onChange={(e) => setUsername(e.target.value)}
                                type="text"
                                required
                            />
                            <span>Username</span>
                            <i></i>
                        </div>
                        <div className={styles.inputBox}>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                required
                            />
                            <span>Password</span>
                            <i></i>
                        </div>
                        <div className={styles.links}>
                            <a href="#">Forgot Password ?</a>
                            <a href="#">SignUp</a>
                        </div>
                        <button onClick={handleLogin} className={styles.button}><span>LOGIN</span></button>
                    </div>
                </div>
            </div>
        </>
    )

}
