/* eslint-disable @next/next/no-img-element */
"use client";
import Image from "next/image";
import logo from "./../../assets/logo.png";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [preview_file, setPreview_file] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview_file(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("กรุณากรอกชื่องาน");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.from("task_tb").insert({
        title: title,
        detail: detail,
        is_complete: isComplete,
        image_url: preview_file,
      });

      if (error) {
        console.error("Error:", error);
        alert("เกิดข้อผิดพลาดในการบันทึกงาน");
      } else {
        console.log("Success:", data);
        alert("บันทึกงานเรียบร้อยแล้ว");

        setTitle("");
        setDetail("");
        setImageFile(null);
        setPreview_file("");
        setIsComplete(false);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("เกิดข้อผิดพลาดที่ไม่คาดคิด");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-10/12 mx-auto min-h-screen pb-10">
      <div className="flex flex-col items-center mt-20 ">
        <Image src={logo} alt="Logo" width={150} height={150} />
        <h1 className="text-2xl font-bold mt-5">Manage Task App</h1>
        <h1 className="text-2xl font-bold">บันทึกงานที่ต้องทำ</h1>
      </div>

      <div className="flex flex-col justify-center mt-10 border border-gray-400 rounded-xl p-10">
        <h1 className="text-xl font-bold text-center">+ เพิ่มงานใหม่</h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mt-5">
            <label className="text-lg font-bold">งานที่ทำ</label>
            <input
              className="border border-gray-300 rounded-lg p-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ระบุชื่องาน"
              required
            />
          </div>

          <div className="flex flex-col mt-5">
            <label className="text-lg font-bold">รายละเอียดงานที่ทำ</label>
            <textarea
              className="border border-gray-300 rounded-lg p-2"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="ระบุรายละเอียด"
              rows={4}
            />
          </div>

          <div className="flex flex-col mt-5">
            <label className="text-lg font-bold">อัพโหลดรูปภาพ</label>

            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <label
              htmlFor="fileInput"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-32 text-center mt-2 cursor-pointer"
            >
              เลือกรูป
            </label>

            {preview_file && (
              <div className="mt-3 flex flex-col">
                <img
                  src={preview_file}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setPreview_file("");
                  }}
                  className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 w-32 rounded"
                >
                  ลบรูป
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center mt-5">
            <label className="text-lg font-bold">สถานะงาน</label>
            <select
              className="border border-gray-300 rounded-lg p-2 ml-3"
              value={isComplete ? "complete" : "incomplete"}
              onChange={(e) => setIsComplete(e.target.value === "complete")}
            >
              <option value="incomplete">Incomplete</option>
              <option value="complete">Complete</option>
            </select>
          </div>

          <div className="flex justify-center mt-10">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-700"
              } text-white font-bold py-3 px-4 rounded`}
            >
              {isSubmitting ? "กำลังบันทึก..." : "บันทึกงาน"}
            </button>
          </div>
        </form>
      </div>

      <div className="flex justify-center mt-10">
        <Link href="/alltask" className="text-blue-500 font-bold">
          ดูงานทั้งหมด
        </Link>
      </div>
    </div>
  );
}
