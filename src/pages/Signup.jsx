import React, { useState } from "react";
import useFirebaseAuth from "../hooks/useAuth";
import { Button, Form, Input, Typography, Alert, message } from "antd";
import { useNavigate } from "react-router-dom";
import Password from "antd/es/input/Password";

const { Title } = Typography;

const Signup = () => {
  const { signUpWithEmail, signUpWithGoogle, authError } = useFirebaseAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");
  const [pwdVerifyMessage, setPwdVerifyMessage] =
    useState("비밀번호를 다시 입력해주세요.");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    if (password !== "" && passwordVerify !== "") {
      if (password !== passwordVerify) {
        setPwdVerifyMessage("비밀번호가 일치하지 않습니다.");
        return;
      }
    }

    if (
      password !== "" &&
      passwordVerify !== "" &&
      password === passwordVerify
    ) {
      try {
        await signUpWithEmail(email, password, () => {
          message.success("회원가입이 완료되었습니다. 감사합니다.", 3, () => {
            navigate("/");
          });
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="flex w-full h-screen justify-center items-center">
      <div
        className="p-14"
        style={{
          width: "500px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
      >
        <Title level={2} style={{ textAlign: "center" }}>
          회원가입
        </Title>
        <Form name="login" layout="vertical" onFinish={handleSignup}>
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
          <Form.Item
            label="비밀번호확인"
            name="passwordVerify"
            dependencies={["password"]} // password 필드와 연결
            rules={[
              { required: true, message: "비밀번호 확인을 입력해주세요." },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("비밀번호가 일치하지 않습니다.")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              value={passwordVerify}
              onChange={(e) => setPasswordVerify(e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              회원가입
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="default"
              onClick={() => signUpWithGoogle((user) => navigate("/"))}
              block
            >
              Google 계정으로 회원가입
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="link"
              block
              onClick={() => {
                navigate("/login");
              }}
            >
              이미 회원이시면 로그인
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Signup;
