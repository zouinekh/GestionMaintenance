import { IoGridOutline, IoHomeOutline } from "react-icons/io5";
import { BsSpeedometer2 } from "react-icons/bs";
import { BiUserCircle } from "react-icons/bi";
import { AiOutlineBarChart } from "react-icons/ai";

// eslint-disable-next-line import/no-anonymous-default-export
export default [
    {
        to: '/',
        name: 'Home',
        Icon: IoHomeOutline
    },
    {
        to: '/ligne',
        name: 'ligne',
        Icon: BsSpeedometer2
    },
    {
        to: '/profile',
        name: 'Users',
        Icon: BiUserCircle
    },

    {
        to: '/test-components',
        name: 'Test Components',
        Icon: IoGridOutline
    },
    {
        to: '/statistics',
        name: 'Statistics',
        Icon: AiOutlineBarChart
    }
];