import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const useFetchJob = (id, setValue) => {
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      console.error("❌ Ошибка: ID объявления отсутствует");
      return;
    }

    const loadJob = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/jobs/${id}`);
        const job = response.data;

        console.log('🔍 useFetchJob - Received job data:', job);

        if (!job || typeof job !== "object") {
          console.error("❌ API вернул некорректные данные:", job);
          toast.error("Ошибка загрузки объявления");
          navigate("/");
          return;
        }

        // ✅ Вместо `batch()` просто вызываем `setValue` последовательно
        setValue("title", job.title);
        setValue("salary", job.salary);
        setValue("cityId", job.city ? job.city.id : null);
        setValue("categoryId", job.category ? job.category.id : null);
        setValue("phone", job.phone);
        setValue("description", job.description);
        setValue("shuttle", job.shuttle ?? false);
        setValue("meals", job.meals ?? false);
        setValue("imageUrl", job.imageUrl || null); // Add imageUrl to form values
        
        setJob(job);

      } catch (error) {
        console.error("❌ Ошибка загрузки объявления:", error);
        toast.error("Ошибка загрузки объявления");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id, navigate, setValue]);

  return { loading, job };
};

export default useFetchJob;
