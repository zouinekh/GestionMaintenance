import Image from "next/image";
import Link from "next/link";
import Logo1 from "./Sagemcom_1.jpg"
const Logo = () => {
  return (
    <div>
      <Link href={`/`}>
        <Image src={Logo1} width={"50"} height={"50"} alt="logo" />
      </Link>
    </div>
  );
};

export default Logo;
