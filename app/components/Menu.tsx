import React from "react";
import Link from "next/link";
import { Navbar } from "flowbite-react";
import { Sidebar } from "flowbite-react";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiViewBoards,
  HiSun,
} from "react-icons/hi";
import { auth } from "../firebase/config";

const Menu = () => {

    const handleSignOut = () => {
        auth.signOut().then(() => {
            sessionStorage.clear();
            const router = require('next/router').default;
            router.push("/");
          }).catch((error) => {
            console.error(error);
          });
    };

    
return (
    <div>
        <Navbar fluid rounded className="block md:hidden">
            <Navbar.Brand as={Link} href="https://flowbite-react.com">
                <img
                    src="/logo-clear.png"
                    className="mr-3 h-6 sm:h-9"
                    alt="Flowbite React Logo"
                />
                <span className="self-center whitespace-nowrap text-xl font-semibold text-gray-900 dark:text-white">
                    Aluve Farm
                </span>
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse>
                <Navbar.Link href="#" active>
                    Home
                </Navbar.Link>
                <Navbar.Link as={Link} href="#">
                    About
                </Navbar.Link>
                <Navbar.Link href="#">Services</Navbar.Link>
                <Navbar.Link href="#">Pricing</Navbar.Link>
                <Navbar.Link href="#">Contact</Navbar.Link>
            </Navbar.Collapse>
        </Navbar>

        <Sidebar
            aria-label="Default sidebar example"
            className="hidden md:block h-screen"
        >
            <Sidebar.Logo
                href="#"
                img="/logo-clear.png"
                imgAlt="Aluve Farm App"
                className="text-gray-900"
            >
                Aluve Farm
            </Sidebar.Logo>
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                {/* <Sidebar.Item as={Link} href="/" prefetch={false} icon={HiChartPie}>Dashboard</Sidebar.Item> */}
                <Sidebar.Item as={Link} href="/farm" prefetch={false} icon={HiUser}>My Farm</Sidebar.Item>
                {/* <Sidebar.Item as={Link} href="/employees" prefetch={false} icon={HiUser}>Employees</Sidebar.Item> */}
                <Sidebar.Item as={Link} href="/sign-in" prefetch={false} icon={HiUser} onClick={handleSignOut}>Sign Out</Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    </div>
);
};

export default Menu;
