"use client";
 
import Image from "next/image";
import logoimg from "@/assets/logo.png";
import Link from "next/link";
import FooterSAU from "../components/FooterSAU";
import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import Swal from "sweetalert2";
 
// สร้าง interface ที่ล้อกับ colummn ของตารางที่จะทำงานด้วย
interface Task {
  id: string;
  created_at: string;
  title: string;
  detail: string;
  image_url: string;
  is_completed: boolean;
  update_at: string;
}
 
export default function Page() {
  //สร้าง state แบบ Task เพื่อเก็บข้อมูลที่ดึงมาจาก supabase
  const [tasks, setTasks] = useState<Task[]>([]);
 
  //ดึงข้อมูลตอนที่ Component นี้ Render
  useEffect(() => {
    //ฟังก์ชันดึงข้อมูล
    const fetchTasks = async () => {
      //ดึงข้อมูล
      const { data, error } = await supabase
        .from("task_tb")
        .select("*")
        .order("created_at", { ascending: false });
 
      //ตรวจสอบ Error
      if (error) {
        Swal.fire({
          icon: "warning",
          title: "เกิดข้อผิดพลาด",
          text: "กรุณาลองใหม่อีกครั้ง",
        });
        return;
      }
 
      //ไม่มี Error เอาข้อมูลที่ดึงกำหนดให้กับ state ที่สร้างไว้
      if (data) {
        setTasks(data as Task[]);
      }
    };
 
    //เรียกใช้ฟัง์ชันดึงข้อมูล
    fetchTasks();
  }, []);
 
  //ฟังก์ชันลบ
  const handleDeleteClick = async (id: string, image_url: string) => {
    //ยืนยันการลบ
    Swal.fire({
      title: "ยืนยันการลบ",    
      text: "คุณต้องการลบข้อมูลนี้หรือไม่",
      icon: "question",
      confirmButtonText: "ยืนยัน",
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if(result.isConfirmed){
        //ลบข้อมูลใน database
        const { error: error1 } = await supabase
          .from("task_tb")
          .delete()
          .eq("id", id);
       
        if(error1){
            Swal.fire({
                title:'เกิดข้อผิดพลาด', text:'ไม่สามารถลบข้อมูลในฐานข้อมูลได้ กรุณาลองใหม่อีกครั้ง', icon:'error', confirmButtonText:'ตกลง',            
            })
            return;
        }
 
        //ลบรูปจาก storage
        const { error: error2 } = await supabase
          .storage
          .from("task_bk")
          .remove([image_url.substring(image_url.lastIndexOf("/") + 1)]);
 
        if(error2){
                Swal.fire({
                    title:'เกิดข้อผิดพลาด', text:'ไม่สามารถลบรูปใน storage ได้ กรุณาลองใหม่อีกครั้ง', icon:'error', confirmButtonText:'ตกลง',            
                })
                return;
        }
 
        //อัปเดจข้อมูลในตาราง
        setTasks(tasks.filter((task) => task.id !== id));
      }
    })
  }
 
  return (
    <>
      <div
        className="w-3/5 mt-20 p-10 shadow-xl mx-auto
                      border border-gray-400 rounded-xl
                      flex flex-col justify-center items-center"
      >
        {/* แสดงรูปจาก assets ในโปรเจ็กต์ */}
        <Image src={logoimg} alt="logo" width={100} height={100} />
 
        {/* แสดงชื่อแอปฯ + การทำงาน */}
        <h1 className="mt-5 text-2xl font-bold text-gray-700">
          Manage Task App
        </h1>
        <h1 className="mt-3 text-lg text-gray-700">ข้อมูลงานทั้งหมด</h1>
 
        {/* แสดงปุ่มเพิ่มงาน  */}
        <div className="w-full mt-5 flex justify-end">
          <Link
            href="/addtask"
            className="bg-blue-600 py-2 px-5 rounded
                             hover:bg-blue-800 text-white"
          >
            เพิ่มงาน
          </Link>
        </div>
 
        {/* แสดงตารางที่นำข้อมูลทั้งหมดจาก task_tb มาแสดง */}
        <table className="w-full border border-gray-500 mt-5">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-500 p-2">รูปงาน</th>
              <th className="border border-gray-500 p-2">งานที่ทำ</th>
              <th className="border border-gray-500 p-2">รายละเอียดงาน</th>
              <th className="border border-gray-500 p-2">สถานะ</th>
              <th className="border border-gray-500 p-2">วันที่เพิ่ม</th>
              <th className="border border-gray-500 p-2">วันที่แก้ไข</th>
              <th className="border border-gray-500 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((item) => (
              <tr key={item.id}>
                <td className="border border-gray-500 p-2">
                    <Image src={item.image_url} alt="logo" width={50} height={50} className="mx-auto"/>
                </td>
                <td className="border border-gray-500 p-2">{item.title}</td>
                <td className="border border-gray-500 p-2">{item.detail}</td>
                <td className="border border-gray-500 p-2">
                  {item.is_completed ? "เสร็จสิ้น" : "ยังไม่เสร็จสิ้น"}
                </td>
                <td className="border border-gray-500 p-2 text-center">
                  {new Date(item.created_at).toLocaleString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                </td>
                <td className="border border-gray-500 p-2 text-center">
                  {new Date(item.update_at).toLocaleString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                </td>
                <td className="border border-gray-500 p-2 text-center">
                    <Link href={`/edittask/${item.id}`} className="text-green-500">
                        แก้ไข
                    </Link>                    
                    {' '}|{' '}
                    <button className="cursor-pointer text-red-500"
                            onClick={ ()=>handleDeleteClick(item.id, item.image_url) } >
                        ลบ  
                    </button>                    
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      {/* แสดง Footer */}
      <FooterSAU />
    </>
  );
}