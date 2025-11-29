import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { ServiceStatus, STATUS_LABELS } from "./types";

const isExpoGo = Constants.appOwnership === "expo";

if (Platform.OS !== "web" && !isExpoGo) {
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } catch (error) {
    // Notifications not available
  }
}

export async function registerForPushNotifications(): Promise<string | null> {
  if (Platform.OS === "web" || isExpoGo) {
    return null;
  }

  let token: string | null = null;

  try {
    if (Platform.OS === "android") {
      try {
        await Notifications.setNotificationChannelAsync("default", {
          name: "FST Servis",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#2563EB",
        });
      } catch (channelError) {
        // Channel setup not available
      }
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== "granted") {
        return null;
      }

      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (projectId) {
        try {
          const tokenResponse = await Notifications.getExpoPushTokenAsync({ projectId });
          token = tokenResponse.data;
        } catch (error) {
          // Token fetch failed
        }
      }
    }
  } catch (error) {
    // Push notifications not available
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

  try {
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
  } catch (error) {
    console.log("Notification not sent (not available in this environment):", error);
    return "notification-unavailable-" + Date.now();
  }
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
): Notifications.EventSubscription | null {
  try {
    return Notifications.addNotificationReceivedListener(callback);
  } catch (error) {
    console.log("Notification listener not available:", error);
    return null;
  }
}

export function addNotificationResponseReceivedListener(
  callback: (response: Notifications.NotificationResponse) => void
): Notifications.EventSubscription | null {
  try {
    return Notifications.addNotificationResponseReceivedListener(callback);
  } catch (error) {
    console.log("Notification response listener not available:", error);
    return null;
  }
}

export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.log("Cancel notifications not available:", error);
  }
}

export async function getBadgeCount(): Promise<number> {
  try {
    return await Notifications.getBadgeCountAsync();
  } catch (error) {
    console.log("Badge count not available:", error);
    return 0;
  }
}

export async function setBadgeCount(count: number): Promise<void> {
  try {
    await Notifications.setBadgeCountAsync(count);
  } catch (error) {
    console.log("Set badge count not available:", error);
  }
}
