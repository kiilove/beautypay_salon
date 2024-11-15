import React, { useEffect, useState } from "react";
import useFirebaseAuth from "../hooks/useAuth";
import { Button, Form, Input, Typography, Alert } from "antd";

const { Title } = Typography;

const Login = () => {
  const { logInWithEmail, signInWithGoogle, authError } = useFirebaseAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (values) => {
    try {
      await logInWithEmail(values.email, values.password, (user) => {
        console.log("로그인 성공: ", user);
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "50px auto",
        padding: 20,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        backgroundColor: "#fff",
      }}
    >
      <Title level={2} style={{ textAlign: "center" }}>
        로그인
      </Title>
      <Form name="login" layout="vertical" onFinish={handleLogin}>
        <Form.Item
          label="이메일"
          name="email"
          rules={[{ required: true, message: "이메일을 입력해주세요." }]}
        >
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
          />
        </Form.Item>

        <Form.Item
          label="비밀번호"
          name="password"
          rules={[{ required: true, message: "비밀번호를 입력해주세요." }]}
        >
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            로그인
          </Button>
        </Form.Item>
      </Form>
      <Button
        type="default"
        onClick={() =>
          signInWithGoogle((user) => console.log("Google 로그인 성공: ", user))
        }
        block
      >
        Google 계정으로 로그인
      </Button>
      {authError && (
        <Alert
          message={authError}
          type="error"
          showIcon
          style={{ marginTop: 20 }}
        />
      )}
    </div>
  );
};

export default Login;
