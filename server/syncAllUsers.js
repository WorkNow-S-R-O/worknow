import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useClerkSupabaseClient } from "./useClerkSupabaseClient";

export default function Tasks() {
  const supabase = useClerkSupabaseClient();
  const { user } = useUser();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!user) return;

    async function fetchTasks() {
      const { data } = await supabase.from("tasks").select();
      setTasks(data);
    }

    fetchTasks();
  }, [user]);

  return (
    <div>
      <h1>Your Tasks</h1>
      {tasks.map((task) => (
        <div key={task.id}>{task.name}</div>
      ))}
    </div>
  );
}
