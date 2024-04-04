import React, { Fragment, useEffect, useState } from "react";
import { App, Button, Form, Input } from "antd";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../apis/auths";
import { useNavigate } from "react-router-dom";
import jwt from "jwt-decode";
import TEXT from "../../constants/string";
import loginBg from "../../assets/images/login-Bg-svg.svg";
import { setSocketToken } from "../../utils/socket";
import logo from "../../assets/images/logo.png";
import ForgotPassWordModal from "../../components/Modal/ForgotPassWordModal";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isOpenForgotPasswordModal, setIsOpenForgotPasswordModal] =
    useState(false);
  const { notification } = App.useApp();

  const { mutate, isLoading } = useMutation(login, {
    onSuccess: (data) => {
      console.log("data > ", data);
      const accessToken = data.access_token;
      localStorage.setItem("token", accessToken);

      const role = jwt(accessToken).role;

      setSocketToken(accessToken);
      // const socket = io(URL_SOCKET, {
      //   auth: {
      //     access_token: localStorage.getItem("token"),
      //   },
      // });

      if (role === TEXT.MANAGER) navigate("/manager", { replace: true });
      else if (role === TEXT.STAFF) navigate("/staff", { replace: true });
      else if (role === TEXT.ADMINISTRATOR)
        navigate("/administrator", { replace: true });
    },
    onError: (error) => {
      notification.error({
        message: (
          <p>{error?.response?.data?.message ?? "Đăng nhập thất bại"}</p>
        ),
        placement: "topRight",
        duration: 2,
      });
    },
  });

  const onFinish = (values) => {
    mutate(values);
  };
  useEffect(() => {
    document.title = "Trang đăng nhập";
  }, []);
  return (
    <Fragment>
      <div className="flex flex-shrink flex-grow h-[100vh] order-3 scroll-smooth scrollbar-hide p-[3rem] py-2 bg-white justify-center overflow-y-auto">
        <div className="flex flex-col min-w-0 p-[3rem] ">
          <div className="w-[1560px] bg-white  h-full">
            <div className="flex h-full w-full">
              {/* left */}
              <div className="min-h-full flex justify-center items-center rounded-lg w-1/2 p-5 ">
                <div className="with-full flex flex-col items-center">
                  <div className="text-center mb-5">
                    {/* <CarryOutOutlined className="text-[#212121] text-[6rem]" /> */}
                    <img src={logo} className="w-36" />
                  </div>
                  <div className="mb-5 mt-2">
                    <h2 className="text-[#212121] text-center text-xl font-medium">
                      Hỗ trợ quản lý công việc của bạn dễ dàng hơn
                    </h2>
                  </div>
                  <div>
                    <img src={loginBg} alt="loginBg" className="" />
                  </div>
                </div>
              </div>
              {/* right */}
              <div className="min-h-full flex justify-center items-center  border-0 w-1/2">
                <div className="w-full h-[90%] border-0 max-w-[32rem] bg-[#484c7f] shadow-lg rounded-lg p-[3rem] text-[#f8f9fa]">
                  <div className="mb-3">
                    <h1 className="text-white text-center text-5xl font-bold">
                      Đăng nhập
                    </h1>
                  </div>
                  <div className="mb-16">
                    <h3 className="text-gray-300 text-center text-lg">
                      Truy cập vào ứng dụng quản lí của chúng tôi.
                    </h3>
                  </div>
                  <Form
                    name="login"
                    onFinish={onFinish}
                    className="p-0 m-0 text-white"
                    layout="vertical"
                    size="large"
                  >
                    <label className="font-bold text-white">Email</label>
                    <Form.Item
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "Hãy nhập email!",
                        },
                        {
                          type: "email",
                        },
                      ]}
                      className="mt-1"
                    >
                      <Input
                        placeholder="Email"
                        className=" rounded-lg py-5 px-3"
                      />
                    </Form.Item>

                    <label className="font-bold text-white">Mật khẩu</label>
                    <Form.Item
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Hãy nhập mật khẩu!",
                        },
                      ]}
                      className="mt-1"
                    >
                      <Input.Password
                        placeholder="Mật khẩu"
                        className="py-5 px-3 rounded-lg"
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
                        Đăng nhập
                      </Button>
                    </Form.Item>
                  </Form>
                  <div className="mt-5 text-xs border-t border-white py-4 text-white">
                    <p
                      onClick={() => setIsOpenForgotPasswordModal(true)}
                      className="text-base hover:text-blue-300 text-orange-300"
                    >
                      Quên mật khẩu ?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isOpenForgotPasswordModal && (
          <ForgotPassWordModal
            isOpenForgotPasswordModal={isOpenForgotPasswordModal}
            setIsOpenForgotPasswordModal={setIsOpenForgotPasswordModal}
          />
        )}
      </div>
    </Fragment>
  );
};

export default LoginPage;
