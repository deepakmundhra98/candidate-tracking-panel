import { useEffect } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import Swal from "sweetalert2";

export default function useNotifications(userId, token, onNotification) {
  useEffect(() => {
    if (!userId || !token) return;

    if (typeof window !== "undefined") {
      window.Pusher = Pusher;

      const echo = new Echo({
        broadcaster: "pusher",
        key: "local",
        cluster: "mt1",
        wsHost: "192.168.1.10", // Laravel backend's IP
        wsPort: 6001,
        forceTLS: false,
        disableStats: true,
      });

      const channel = echo.private(`staff.${userId}`); // or user.${id}, depending on backend
console.log("channel",channel)
      channel.notification((notification) => {
        console.log("🔔 Notification received:", notification);

        Swal.fire({
          title: notification.title || "New Notification",
          text: notification.message || "You have a new update!",
          icon: "info",
          confirmButtonText: "Okay",
        });

        if (onNotification) onNotification(notification);
      });

      return () => {
        echo.leave(`staff.${userId}`);
      };
    }
  }, [userId, token, onNotification]);
}
