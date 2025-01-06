import React, { useEffect, useState } from "react";
import useFirebaseAuth from "../hooks/useAuth";
import { Button, Form, Input, Typography, Alert, message } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const Login = () => {
  const { logInWithEmail, signInWithGoogle, authError } = useFirebaseAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      await logInWithEmail(values.email, values.password, (user) => {
        message.success("로그인 되었습니다.", 1, () => {
          navigate("/");
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // 강제 2초 딜레이 추가
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const user = await signInWithGoogle(); // 팝업 대기
      if (user) {
        message.success("Google 로그인 성공!", 1, () => {
          navigate("/");
        });
      }
    } catch (error) {
      console.error("Google 로그인 오류:", error);
      message.error("Google 로그인에 실패했습니다.");
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
          <Form.Item>
            <Button type="default" onClick={handleGoogleLogin} block>
              Google 계정으로 로그인
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="link"
              block
              onClick={() => {
                navigate("/signup");
              }}
            >
              무료 회원가입
            </Button>
          </Form.Item>
        </Form>

        {authError && (
          <Alert
            message={authError}
            type="error"
            showIcon
            style={{ marginTop: 20 }}
          />
        )}
      </div>
    </div>
  );
};

export default Login;
