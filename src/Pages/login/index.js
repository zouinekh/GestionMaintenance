/* eslint-disable jsx-a11y/alt-text */
import Link from "next/link";
import FullButton from "@aio/components/FullButton";
import Input from "@aio/components/Input";
import styles from "./login.module.css";
import Image from "next/image";

import logo from './logo.png'
import { useState } from "react";
import axios from "axios";
import { baseUrl } from "utils/baseUrl";
const Login = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  function handleLogin() {
    axios.post(`${baseUrl}/auth/login/`, {
      email: email,
      password: password
    })
      .then(response => {
        console.log("Login successful", response.data);
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data));
        if (response.data.role == 1) {
          window.location.href = "/dashboard"
        } else {
          alert("other roles side still working on ")
        }
      })
      .catch(error => {
        console.error("Login failed", error);
      });

  }
  return (
    <div className={styles.container}>
      <section className={styles["login-container"]}>
        <div className={styles["brand-container"]}>
          <Image src={logo} width={410} height={430} />
        </div>

        {/* login form */}
        <div className={styles["form-container"]}>
          <div className="t-center" style={{ margin: "15px 0" }}>
            <div className={styles["sm-brand-container"]}>
              {/* <Logo /> */}
            </div>
            <h1>Login</h1>
            <p>Please enter email and password to login</p>
          </div>
          <div>
            <Input
              inputContainerStyle={{ padding: "15px 30px" }}
              type="text"
              placeholder="Email"
              onChange={(e) => console.log(e)}
              name="email"
              label={"Email"}
            />
            <Input
              inputContainerStyle={{ padding: "15px 30px" }}
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              name="email"
              label={"Email"}
            />
            <div className='btn-container' onClick={(e) => handleLogin()}>
              <button className='btn-style'>Login</button>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
