import React, { useState } from "react";
import useFirebaseAuth from "../hooks/useAuth";

const Signup = () => {
  const { signUpWithEmail, signUpWithGoogle, authError } = useFirebaseAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signUpWithEmail(email, password, () => {
        alert("회원가입 성공!");
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>회원가입</h1>
      <form onSubmit={handleSignup}>
        <div>
          <label htmlFor="email">이메일:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">비밀번호:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">회원가입</button>
      </form>
      <button onClick={signUpWithGoogle}>Google 계정으로 회원가입</button>
      {authError && <p style={{ color: "red" }}>{authError}</p>}
    </div>
  );
};

export default Signup;
