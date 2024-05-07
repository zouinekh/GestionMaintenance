import Logo from "../Logo";
import styles from "./SidebarNavigation.module.css";
import Link from "next/link";
import routes from "../../routes";
import { useRouter } from "next/router";
import { TbLogout } from "react-icons/tb";
import { BiChevronLeft } from "react-icons/bi";
import { useEffect, useState } from "react";
import { IoHomeOutline } from "react-icons/io5";
import { BsSpeedometer2 } from "react-icons/bs";

const SidebarNavigation = ({
  sidebarMenuActive,
  toggleSidebarMenu
}) => {

  const [role, setRole] = useState();
  const techniciensRoutes = [{
    to: '/technician',
    name: 'Home',
    Icon: IoHomeOutline
  },
  {
    to: '/lignesAssigned',
    name: 'ligne',
    Icon: BsSpeedometer2
  },
  {
    to: '/lignesCompleted',
    name: 'Completed lignes',
    Icon: BsSpeedometer2
  },]
  const validatorRoutes = [{
    to: '/validator',
    name: 'Home',
    Icon: IoHomeOutline
  },
  {
    to: '/ligneFinal',
    name: 'ligne',
    Icon: BsSpeedometer2
  },
  ]
  useEffect(() => {
    const user = localStorage.getItem("user")
    console.log()
    // setRole(JSON.parse(user).role)
    setRole(3)

  }, []);
  const router = useRouter();



  return (
    <section className={`${styles.container} ${sidebarMenuActive ? styles['active'] : ''}`}>
      <button className={styles["sidebar-close-btn"]} onClick={toggleSidebarMenu}>
        x
      </button>
      <div className={styles['logo-container']}>
        <Logo />
        <div className={styles['logo-explain']}>Admin Dashboard</div>
      </div>
      <ul className={styles["sidebar-container"]}>
        {role === 1 && (
          routes.map((page, index) => (
            <li key={index} className={`${styles["sidebar-menu-item"]} ${router.route === page.to ? styles['active'] : ''}`}>
              <Link href={page.to}>
                <page.Icon />
                <span>{page.name}</span>
              </Link>
            </li>
          ))
        )}
        {role === 2 && (
          techniciensRoutes.map((page, index) => (
            <li key={index} className={`${styles["sidebar-menu-item"]} ${router.route === page.to ? styles['active'] : ''}`}>
              <Link href={page.to}>
                <page.Icon />
                <span>{page.name}</span>
              </Link>
            </li>
          ))
        )}
        {role !== 1 && role !== 2 && (
          validatorRoutes.map((page, index) => (
            <li key={index} className={`${styles["sidebar-menu-item"]} ${router.route === page.to ? styles['active'] : ''}`}>
              <Link href={page.to}>
                <page.Icon />
                <span>{page.name}</span>
              </Link>
            </li>
          ))
        )}

      </ul>

      <ul className={styles["sidebar-footer"]}>
        {/* <button onClick={toggleSidebarMenu}>close</button> */}
        <li className={styles["footer-item"]}>
          <TbLogout />
          <span>Logouts</span>
        </li>

      </ul>
    </section>
  );
};

export default SidebarNavigation;
