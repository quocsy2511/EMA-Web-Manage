import React, { Fragment } from "react";
import videoBg from "../../assets/videos/video-login.mp4";
import { Button, Form, Input } from "antd";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../apis/auths";
import { useNavigate } from "react-router-dom";
import jwt from "jwt-decode";
import { io } from "socket.io-client";
import { URL_SOCKET } from "../../constants/api";
import { useDispatch } from "react-redux";
import { socketActions } from "../../store/socket";
import TEXT from "../../constants/string";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { mutate, isLoading } = useMutation(login, {
    onSuccess: (data) => {
      console.log("🚀 ~ file: LoginPage.js:17 ~ LoginPage ~ data:", data);
      const accessToken = data.access_token;
      localStorage.setItem("token", accessToken);

      const role = jwt(accessToken).role;
      // const socket = io(URL_SOCKET, {
      //   auth: {
      //     access_token: localStorage.getItem("token"),
      //   },
      // });

      if (role === TEXT.MANAGER) navigate("/manager");
      else if (role === TEXT.STAFF) navigate("/staff");
      else if (role === TEXT.ADMINISTRATOR) navigate("/administrator");
    },
  });

  const onFinish = (values) => {
    mutate(values);
  };

  return (
    <Fragment>
      {/* <video className="w-full h-screen object-cover" src={videoBg} autoPlay loop muted/> */}
      <section className="bg-white  min-h-screen flex items-center justify-center ">
        <div className="bg-gradient-to-t from-blue-200 to-white flex rounded-2xl shadow-lg max-w-3xl p-5 items-center h-[500px]  ">
          <div className="md:w-1/2 px-8 md:px-16">
            <h2 className="font-bold text-2xl text-[#002D74]">Login</h2>
            <p className="text-xs mt-4 text-[#002D74]">
              If you are already a member, easily log in
            </p>
            <Form
              name="login"
              style={{
                maxWidth: 600,
                marginTop: 24,
              }}
              onFinish={onFinish}
            >
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập email!",
                  },
                ]}
              >
                <Input placeholder="Email" className="p-2 rounded-lg " />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập mật khẩu!",
                  },
                ]}
              >
                <Input.Password
                  placeholder="password"
                  className="p-2 rounded-lg"
                  autoComplete="curren-password"
                />
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  span: 24,
                }}
              >
                <Button
                  type="primary"
                  className="hover:scale-105 duration-300 w-full"
                  htmlType="submit"
                  loading={isLoading}
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
            <div className="mt-5 text-xs border-t border-[#002D74] py-4 text-[#002D74]">
              <a href="#">Forgot your password?</a>
            </div>
          </div>
          <div className=" w-1/2 h-full flex justify-center items-center">
            <video className="rounded-2xl" src={videoBg} autoPlay loop muted />
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default LoginPage;
