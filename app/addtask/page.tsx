"use client"
 
import logoimg from "@/assets/logo.png";
import FooterSAU from "../components/FooterSAU";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Swal from "sweetalert2";
import { supabase } from "@/services/supabaseClient";
import { useRouter } from "next/navigation";
 
export default function Page() {
  const router = useRouter();
 
  //สร้าง state เพื่อจัดการกับข้อมูลใน component
  const [title, setTitle] = useState<string>('');
  const [detail, setDetail] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null); //เก็บตัวรูปที่เลือก
  const [imagePreview, setImagePreview] = useState<string | null>(null); //เก็บที่อยู่ของรูปที่จะแสดง
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
 
  //ฟังก์ชันเลือกรูป และแสดงรูป
  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>)=>{      
      const file = e.target.files?.[0]; //e.target.files?.[0] คือ รูปที่เลือก
 
      if(file){
        setImageFile(file); //เอารูปกำหนดให้กับ imaageFile
        setImagePreview(URL.createObjectURL(file)); //เอาตำแหน่งรูปกำหนดให้กับ imagePreview
      }
  }
 
  //ฟังก์ชันบันทึกข้อมูลเพื่อส่งรูปไป storage:bucket(task_tb) และบันทึกข้อมูลไปยัง database:table(task_tb)
  const handleSaveClick = async()=>{
   
    //Validate UI
    if(title === '' || detail === '' || imageFile === null){
        Swal.fire({
            title:'คำเตือน',
            text:'กรุณาตรวจสอบการป้อนข้อมูล และเลือกรูปภาพ',
            icon:'warning',
            confirmButtonText:'ตกลง',            
        })
        return;
    }
 
    //อัปโหลดรูปไปยัง storage:bucket(task_tb) และ Get image url ของรูปเพื่อไปใช้บันทึกลง database
    let  image_url = ''; //ตัวแปรเก็บที่อยู่รูป
   
    const new_file_name = `${Date.now()}_${imageFile.name}`; //เปลี่ยนชื่อรูป
 
    //อัปโหลด
    const {error} = await supabase  
                        .storage
                        .from('task_bk')
                        .upload(new_file_name, imageFile);
    //ไปเอา image url ของรูปที่อัปโหลด
    const { data } = await supabase
                        .storage
                        .from('task_bk')
                        .getPublicUrl(new_file_name);
 
    image_url = data.publicUrl;
 
    //บันทึกข้อมูลไปยัง database:table(task_tb)
    const {error: error1} = await supabase
                        .from('task_tb')
                        .insert({
                            title: title,
                            detail: detail,
                            image_url: image_url,
                            is_completed: isCompleted
                        })
   
    if(error1){
        Swal.fire({
            title:'เกิดข้อผิดพลาด', text:'กรุณาลองใหม่อีกครั้ง', icon:'error', confirmButtonText:'ตกลง',            
        })
        return;
    }
 
    Swal.fire({
            title:'ผลการทำงาน', text:'บันทึกข้อมูลเรียบร้อย', icon:'success', confirmButtonText:'ตกลง',          
        })
       
    //แล้วย้อนกลับไปหน้า /showalltask
    router.push('/showalltask');
  }
 
 
  return (
    <>
      <div className="w-3/5 mt-20 p-10 shadow-xl mx-auto mb-10
                      border border-gray-400 rounded-xl
                      flex flex-col justify-center items-center">
        {/* แสดงรูปจาก assets ในโปรเจ็กต์ */}
        <Image src={logoimg} alt="logo" width={100} height={100} />
 
        {/* แสดงชื่อแอปฯ + การทำงาน */}
        <h1 className="mt-5 text-2xl font-bold text-gray-700">
          Manage Task App
        </h1>
        <h1 className="mt-3 text-lg text-gray-700">
            เพิ่มงาน
        </h1>
 
        {/* ส่วนของการป้อนงาน และรายละเอียดงาน */}
        <div className="w-full flex flex-col mt-5">
            <h1>ชื่องาน</h1>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                   className="p-2 border border-gray-700 rounded mt-1 mb-2"/>
            <h1>รายละเอียดงาน</h1>
            <textarea
                value={detail} onChange={(e)=>setDetail(e.target.value)}
                className="p-2 border border-gray-700 rounded mt-1 mb-2"
                rows={4}>
            </textarea>
        </div>
 
        {/* ส่วนเลือกรูป และแสดงรูป */}
        <div  className="w-full flex flex-col mt-5">
            <h1>อัปโหลดรูป</h1>
            <input id="selectImage" type="file" accept="image/*"  
                   className="hidden" onChange={handleSelectImage}/>
            <label htmlFor="selectImage"
                   className="px-4 py-2 bg-blue-600 text-white
                              rounded mt-1 mb-2 w-30 text-center">
                เลือกรูป
            </label>
            {/* แสดงรูป */}
            {
                //ตรวจสอบว่ามีการเลือกรูปหรือไม่จาก imagePreview
                imagePreview &&
                <Image src={imagePreview} alt="preview" width={150} height={150}/>
            }
        </div>
 
        {/* ส่วนเลือกสถานะงาน */}
        <div className="w-full flex flex-col mt-5">
            <h1>สถานะงาน</h1>
            <select value={isCompleted==true?"1":"0"}
                    onChange={(e)=>setIsCompleted(e.target.value === "1")}
                    className="p-2 border border-gray-700 rounded mt-1 mb-2">
                <option value="1">✅ เสร็จแล้ว</option>
                <option value="0">❌ ยังไม่เสร็จ</option>
            </select>
        </div>
 
        {/* ส่วนปุ่มบันทึกงานใหม่ */}
        <button onClick={handleSaveClick}
                className="w-full px-4 py-2 bg-green-500 text-white
                        hover:bg-green-600 rounded mt-5 cursor-pointer">
            บันทึกงานใหม่
        </button>
 
        {/* ส่วนปุ่มกลับไปหน้า /showalltask */}
        <Link href={'/showalltask'} className="mt-3 text-blue-500" >
            กลับไปหน้าแสดงงานทั้งหมด
        </Link>
      </div>
 
      {/* ส่วนของ Footer */}
      <FooterSAU />
    </>
  );
}