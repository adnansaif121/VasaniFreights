import Image from "next/image";
import styles from "./page.module.css";
import Dashboard from "@/components/Dashboard";
import LoginPage from "@/components/LoginPage";

export default function Home() {
  return (
    <main style={{width: "100vw", height: "100%"}}>
      <Dashboard></Dashboard>
      {/* <LoginPage></LoginPage> */}
    </main>
  );
}
