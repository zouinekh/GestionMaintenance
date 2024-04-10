import Image from "next/image";
import styles from "./UserIcon.module.css";


const UserIcon = ({
    onClick = () => {}
}) => {
    return (
        <div onClick={onClick} className={styles.container}>
            <Image 
                src={`/profile-user.png`}
                width={'40'}
                height={'40'}
            />
        </div>
    );
}

export default UserIcon;