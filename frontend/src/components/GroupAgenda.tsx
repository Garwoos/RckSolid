import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface Availability {
  day_of_week: number;
  hour_of_day: number;
  id_User: string;
  name_User: string;
}

export default function GroupAgenda({ groupId }: { groupId: string }) {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/db/group/${groupId}/availability`
        );
        const data = await response.json();
        setAvailability(data);
      } catch (error) {
        console.error("Error fetching availability:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [groupId]);

  const getUserId = async () => {
    let userId = localStorage.getItem("userId");
    if (!userId) {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing. Please log in again.");
      }

      const userResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user information.");
      }

      const userData = await userResponse.json();
      userId = userData.id_User;
      localStorage.setItem("userId", userId); // Cache the userId for future use
    }
    return userId;
  };

  const handleCellClick = async (day: number, hour: number) => {
    try {
      const token = localStorage.getItem("token");
      const userId = await getUserId(); // Fetch or retrieve the userId

      const isAlreadyAvailable = availability.some(
        (a) => a.day_of_week === day && a.hour_of_day === hour && a.id_User === userId
      );

      if (isAlreadyAvailable) {
        // Supprimer la disponibilité
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/db/group/${groupId}/availability`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            groupId,
            userId,
            dayOfWeek: day,
            hourOfDay: hour,
          }),
        });
        setAvailability((prev) =>
          prev.filter(
            (a) => !(a.day_of_week === day && a.hour_of_day === hour && a.id_User === userId)
          )
        );
      } else {
        // Ajouter la disponibilité
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/db/group/${groupId}/availability`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            groupId,
            userId,
            dayOfWeek: day,
            hourOfDay: hour,
          }),
        });
        setAvailability((prev) => [
          ...prev,
          { day_of_week: day, hour_of_day: hour, id_User: userId, name_User: "You" },
        ]);
      }
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  return (
    <div className="grid grid-cols-8 gap-1">
      <div></div>
      {["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"].map((day) => (
        <div key={day} className="text-center font-bold">
          {day}
        </div>
      ))}
      {Array.from({ length: 24 }).map((_, hour) => (
        <React.Fragment key={hour}>
          <div className="text-center font-bold">{hour}:00</div>
          {Array.from({ length: 7 }).map((_, day) => {
            const isAvailable = availability.some(
              (a) => a.day_of_week === day && a.hour_of_day === hour
            );
            const users = availability.filter(
              (a) => a.day_of_week === day && a.hour_of_day === hour
            );
            return (
              <div
                key={`${day}-${hour}`}
                className={`border p-2 cursor-pointer ${
                  isAvailable ? "bg-green-200" : "bg-gray-100"
                }`}
                onClick={() => handleCellClick(day, hour)}
              >
                {users.map((user) => (
                  <div key={user.id_User} className="text-xs">
                    {user.name_User}
                  </div>
                ))}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}
