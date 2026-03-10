"use client"
import Image from "next/image";
import logoimg from "@/assets/logo.png"
import Link from "next/link";
import FooterSAU from "../components/FooterSAU";
import { supabase } from "@/services/supabaseClient";

import {useEffect, useState} from "react";
import Swal from "sweetalert2";
// สร้าง interface สำหรับการจัดการข้อมูลงานที่ได้จากฐานข้อมูล
interface Task{
    id: number;
    created_at: string;
    title: string;
    detail: string;
    image_url: string;
    is_completed: boolean;
    updated_at: string;
}
export default function Page() {
    // สร้าง state สำหรับเก็บข้อมูลงานทั้งหมดที่ได้จากฐานข้อมูล
    const [tasks, setTasks] = useState<Task[]>([]);
    // ดึงข้อมูลตอนที่ Component render
    useEffect(() => {
        // ฟังก์ชันสำหรับดึงข้อมูลงานทั้งหมดจากฐานข้อมูล
        const fetchTasks = async () => {
            // ดึงข้อมูล
            const {data, error} = await supabase.from("task_tb").select("*").order("created_at", {ascending: false});
            // ตรวจสอบ Error
            if ( error ) {
                Swal.fire({
                    icon: "Warning",
                    title: "เกิดผิดพลาด",
                    text: "ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
                })
                return;
            } 
                // ไม่มี Error นำข้อมูลที่ได้มาเก็บใน State
               if(data) {
                setTasks(data);
            }
        }
        // เรียกใช้ฟังก์ชันดึงข้อมูล
        fetchTasks();
    }, []);
    return (
        <>
        <div
        className="w-3/5 mt-20 p-10 shadow-xl mx-auto
                      border border-gray-400 rounded-xl
                      flex flex-col justify-center items-center">
                        {/* รูปจาก assets */}
        <Image src={logoimg} alt="logo" width={100} height={100} />
        {/* แสดงชื่อแอปฯ การทำงาน */}
        <h1 className="mt-5 text-2xl font-bold text-gray-700">
          Manage Task App
        </h1>
        <h1 className="mt-3 text-lg text-gray-700">
          ข้อมูลงานทั้งหมด
        </h1>
        {/* แสดงปุ่มเพิ่มงาน */}
        <div className="w-full mt-5 flex justify-end">
            <Link href="/addtask">
              <button 
              className=" bg-blue-600 py-2 px-5 text-white rounded hover:bg-blue-700 cursor-pointer">
                เพิ่มงาน
              </button>
            </Link>
        </div>
        {/* แสดงตารางที่นำข้อมูลทั้งหมดจาก task_tb มาแสดง */}
        <table className="w-full mt-5 border border-gray-400">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 p-2">รูปงาน</th>
              <th className="border border-gray-400 p-2">ชื่องานที่ทำ</th>
              <th className="border border-gray-400 p-2">รายละเอียดงาน</th>
              <th className="border border-gray-400 p-2">สถานะ</th>
            <th className="border border-gray-400 p-2">วันที่เพิ่ม</th>
            <th className="border border-gray-400 p-2">วันที่แก้ไข</th>
            <th className="border border-gray-400 p-2">Action</th>
                
            </tr>
          </thead>
            <tbody>
                {
                    tasks.map((item) => (
                        <tr key={item.id} className="bg-gray-200">
              <td className="border border-gray-400 p-2 "><Image src={item.image_url} alt={item.title} width={50} height={50} className="mx-auto" /></td>
              <td className="border border-gray-400 p-2">{item.title}</td>
              <td className="border border-gray-400 p-2">{item.detail}</td>
              <td className="border border-gray-400 p-2">{item.is_completed ? "เสร็จสิ้น" : "ยังไม่เสร็จ"}</td>
            <td className="border border-gray-400 p-2 text-center">{new Date(item.created_at).toLocaleDateString('th-TH')}</td>
            <td className="border border-gray-400 p-2 text-center">{new Date(item.updated_at).toLocaleDateString()}</td>
            <td className="border border-gray-400 p-2 flex justify-center ">แก้ไขหรือลบ</td>
                
            </tr>
                    ))
                }
                </tbody>
        </table>
      </div>
      <FooterSAU/>
        </>
    );
}