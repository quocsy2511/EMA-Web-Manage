import React, { useState } from "react";
import { Avatar, Badge, Button, Dropdown, Space } from "antd";
import { Header as HeaderLayout } from "antd/es/layout/layout";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

const items = [
  {
    key: "1",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        1st menu item
      </a>
    ),
  },
  {
    key: "2",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.aliyun.com"
      >
        2nd menu item (disabled)
      </a>
    ),
    disabled: true,
  },
  {
    key: "3",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.luohanacademy.com"
      >
        3rd menu item (disabled)
      </a>
    ),
    disabled: true,
  },
  {
    key: "4",
    danger: true,
    label: "a danger item",
  },
];

const userItems = [
  {
    key: "1",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        1st menu item
      </a>
    ),
  },
  {
    key: "2",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.aliyun.com"
      >
        2nd menu item (disabled)
      </a>
    ),
    disabled: true,
  },
  {
    key: "3",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.luohanacademy.com"
      >
        3rd menu item (disabled)
      </a>
    ),
    disabled: true,
  },
  {
    key: "4",
    danger: true,
    label: "a danger item",
  },
];

const Header = ({ collapsed, setCollapsed }) => {
  return (
    <HeaderLayout className="p-0 bg-white border-b-2 h-16">
      <div className="flex justify-between items-center pr-8">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
          }}
        />

        <Dropdown
          menu={{
            items,
          }}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              Hover me
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>

        {/* <div className="flex items-center">
          <motion.div
            whileTap={{ scale: 0.5 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="cursor-pointer"
          >
            <Dropdown
              menu={{
                notiItems,
              }}
              trigger={["click"]}
              placement="bottomLeft"
              arrow
            >
              <Badge
                size={"small"}
                count={5}
                offset={[-4, 4]}
                title="5 thông báo"
              >
                <BellOutlined size={30} />
              </Badge>
            </Dropdown>
          </motion.div>

          <div className="w-5" />

          <motion.div
            className="flex items-center cursor-pointer"
            whileTap={{ scale: 0.75 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Dropdown
              menu={{
                userItems,
              }}
              trigger={["click"]}
              placement="bottomLeft"
              arrow
            >
              <>
                <Avatar
                  size={35}
                  icon={<p>icon</p>}
                  alt="user_image"
                  src={
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZCldKgmO2Hs0UGk6nRClAjATKoF9x2liYYA&usqp=CAU"
                  }
                />
                <div className="w-2" />
                <p className="text-sm font-normal">User Name</p>
              </>
            </Dropdown>
          </motion.div>
        </div> */}
      </div>
    </HeaderLayout>
  );
};

export default Header;
