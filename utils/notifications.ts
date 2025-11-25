import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { ServiceStatus, STATUS_LABELS } from "@/types";

if (Platform.OS !== "web") {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function registerForPushNotifications(): Promise<string | null> {
  if (Platform.OS === "web") {
    console.log("Push notifications not supported on web");
    return null;
  }

  let token: string | null = null;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "FST Servis",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#2563EB",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== "granted") {
      console.log("Push notification permission not granted");
      return null;
    }

    try {
      const tokenResponse = await Notifications.getExpoPushTokenAsync({
        projectId: "fst-servis",
      });
      token = tokenResponse.data;
    } catch (error) {
      console.log("Error getting push token:", error);
    }
  } else {
    console.log("Push notifications require a physical device");
  }

  return token;
}

export async function sendLocalNotification(
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<string> {
  if (Platform.OS === "web") {
    console.log("Local notification (web):", title, body);
    return "web-notification-" + Date.now();
  }

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null,
  });
  return id;
}

export async function sendServiceStatusNotification(
  serviceId: string,
  customerName: string,
  newStatus: ServiceStatus
): Promise<void> {
  const statusText = STATUS_LABELS[newStatus];
  
  let title = "";
  let body = "";

  switch (newStatus) {
    case "in_progress":
      title = "Servis započet";
      body = `Servis za ${customerName} je započet`;
      break;
    case "completed":
      title = "Servis završen";
      body = `Servis za ${customerName} je uspešno završen`;
      break;
    case "cancelled":
      title = "Servis otkazan";
      body = `Servis za ${customerName} je otkazan`;
      break;
    default:
      title = "Status servisa";
      body = `Status servisa za ${customerName}: ${statusText}`;
  }

  await sendLocalNotification(title, body, { serviceId, status: newStatus });
}

export async function sendNewServiceNotification(
  serviceId: string,
  customerName: string,
  deviceInfo: string
): Promise<void> {
  await sendLocalNotification(
    "Novi servis",
    `Novi zahtev za servis od ${customerName} - ${deviceInfo}`,
    { serviceId, type: "new_service" }
  );
}

export async function sendScheduledMaintenanceNotification(
  deviceInfo: string,
  customerName: string,
  scheduledDate: string
): Promise<void> {
  await sendLocalNotification(
    "Podsetnik za održavanje",
    `Zakazano održavanje: ${deviceInfo} - ${customerName} (${scheduledDate})`,
    { type: "maintenance_reminder" }
  );
}

export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
): Notifications.EventSubscription {
  return Notifications.addNotificationReceivedListener(callback);
}

export function addNotificationResponseReceivedListener(
  callback: (response: Notifications.NotificationResponse) => void
): Notifications.EventSubscription {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function getBadgeCount(): Promise<number> {
  return await Notifications.getBadgeCountAsync();
}

export async function setBadgeCount(count: number): Promise<void> {
  await Notifications.setBadgeCountAsync(count);
}
