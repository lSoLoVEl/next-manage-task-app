"use client"
import Image from "next/image";
 import FooterSAU from "./components/FooterSAU";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function Page() {
  const router = useRouter();
  const [secureCode, setSecureCode] = useState<string>("");
  const handleAcessClick = () => {
    if (secureCode.toLocaleLowerCase() === "sauiot") {
      router.push("/showalltask");
    } else {
      Swal.fire({
        icon: "error",
        title: "ผิดพลาด",
        text: "รหัสไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง",
      });
    }
  };
  return (
    <>
      <div
        className="w-3/5 mt-20 p-10 shadow-xl mx-auto
                      border border-gray-400 rounded-xl
                      flex flex-col justify-center items-center">
 
        {/* แสดงรูปจาก Internet */}
        <Image src={'https://cdn-icons-png.flaticon.com/128/15757/15757011.png'}
               alt="logo" width={150} height={150} />
 
        {/* แสดงชื่อแอปฯ */}
        <h1 className="mt-5 text-2xl font-bold text-gray-700">
          Manage Task App
        </h1>
        <h1 className="mt-3 text-lg text-gray-700">
          บริหารจัดการงานที่ทำ
        </h1>
 
        {/* ป้อน Secure Code สำหรับเข้าใช้งาน */}
        <input  value={secureCode} onChange={(e) => setSecureCode(e.target.value)}
        type="text" className="p-3 border border-gray-400 rounded
                                      mt-5 w-1/2" />
 
        {/* ปุ่มเข้าใช้งาน  */}
        <button onClick={handleAcessClick}
        className="mt-5 w-1/2 bg-blue-600 py-3 text-white
                           rounded hover:bg-blue-700 cursor-pointer">
          เข้าใช้งาน 😁
        </button>
      </div>
      <FooterSAU />
    </>
  );
}