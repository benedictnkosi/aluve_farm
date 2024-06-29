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
import { useRouter } from "next/navigation";

const Menu = () => {

    const router = useRouter();

    const handleSignOut = () => {
        auth.signOut().then(() => {
            sessionStorage.clear();
            window.location.href = "/";
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
                Agri Community
                </span>
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse>
                <Navbar.Link href="/farm" active>
                    Farm
                </Navbar.Link>
                <Navbar.Link as={Link} href="/" onClick={handleSignOut}>
                    Sign Out
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>

        <Sidebar
            aria-label="Default sidebar example"
            className="hidden md:block h-screen"
        >
            <Sidebar.Logo
                href="#"
                img="/logo-clear.png"
                imgAlt="Agri Community"
                className="text-gray-900"
            >
                Agri Community
            </Sidebar.Logo>
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                {/* <Sidebar.Item as={Link} href="/" prefetch={false} icon={HiChartPie}>Dashboard</Sidebar.Item> */}
                <Sidebar.Item as={Link} href="/farm" prefetch={false} icon={HiUser}>My Farm</Sidebar.Item>
                <Sidebar.Item as={Link} href="/batches" prefetch={false} icon={HiUser}>Batches</Sidebar.Item>
                <Sidebar.Item as={Link} href="/" prefetch={false} icon={HiUser} onClick={handleSignOut}>Sign Out</Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    </div>
);
};

export default Menu;
