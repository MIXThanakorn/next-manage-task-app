/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import logo from "./../../assets/logo.png";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

type Task = {
  id: string;
  title: string;
  detail: string;
  is_complete: boolean;
  image_url: string;
  create_at: string;
  update_at: string;
};

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => {
    async function fetchTasks() {
      const { data, error } = await supabase
        .from("task_tb")
        .select("*")
        .order("create_at", { ascending: false });

      if (error) {
        alert("Error fetching tasks, please try again later");
        console.error(error);
      } else {
        setTasks(data);
      }
    }

    fetchTasks(); // ต้องเรียกใช้งานฟังก์ชัน
  }, []);
  return (
    <div className="flex flex-col w-10/12 mx-auto min-h-screen">
      <div className="flex flex-col items-center mt-20">
        <Image src={logo} alt="Logo" width={150} height={150} />
        <h1 className="text-2xl font-bold mt-5">Manage Task App</h1>
        <h1 className="text-2xl font-bold">บันทึกงานที่ต้องทำ</h1>
      </div>

      <div className="flex justify-end">
        <Link
          href="/addtask"
          className="mt-7 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded"
        >
          เพิ่มงาน
        </Link>
      </div>

      <div className="flex flex-col mt-10">
        <table className="min-w-full border border-black text-sm">
          <thead>
            <tr>
              <th className="border border-black p-2">รูป</th>
              <th className="border border-black p-2">งานที่ต้องทำ</th>
              <th className="border border-black p-2">รายละเอียด</th>
              <th className="border border-black p-2">สถานะ</th>
              <th className="border border-black p-2">วันที่เพิ่ม</th>
              <th className="border border-black p-2">วันที่แก้ไข</th>
              <th className="border border-black p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border border-black text-center">
                <td className="border border-black p-2">
                  {task.image_url ? (
                    <img
                      src={task.image_url}
                      alt={task.title}
                      width={50}
                      height={50}
                    />
                  ) : (
                    "ไม่มีรูป"
                  )}
                </td>
                <td className="border border-black p-2">{task.title}</td>
                <td className="border border-black p-2">{task.detail}</td>
                <td
                  className={`border border-black p-2 ${
                    task.is_complete ? "bg-green-300" : "bg-red-300"
                  }`}
                >
                  {task.is_complete ? "Complete" : "Incomplete"}
                </td>
                <td className="border border-black p-2">
                  {new Date(task.create_at).toLocaleString()}
                </td>
                <td className="border border-black p-2">
                  {new Date(task.update_at).toLocaleString()}
                </td>
                <td className="border border-black p-2">
                  <Link
                    href={`/edittask/${task.id}`}
                    className="mr-2 bg-amber-400 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded"
                  >
                    แก้ไข
                  </Link>
                  <button className="bg-red-400 hover:bg-red-700 text-white font-bold py-3 px-4 rounded">
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt 15">
        <Link
          href="/"
          className="mt-7 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded"
        >
          Go Home Page
        </Link>
      </div>
    </div>
  );
}
