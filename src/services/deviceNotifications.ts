import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

import type { NotificationRecord } from "@/services/eduverseApi";

export type DeviceNotificationStatus = "idle" | "granted" | "denied" | "unavailable";

const EDUVERSE_CHANNEL_ID = "eduverse-updates";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

export async function configureDeviceNotifications() {
  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync(EDUVERSE_CHANNEL_ID, {
        description: "Class announcements, assignments, materials, and grade updates.",
        importance: Notifications.AndroidImportance.DEFAULT,
        lightColor: "#38bdf8",
        name: "Eduverse updates",
        vibrationPattern: [0, 250, 250, 250]
      });
    }

    return normalizeStatus(await Notifications.getPermissionsAsync());
  } catch {
    return "unavailable";
  }
}

export async function requestDeviceNotificationPermission() {
  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync(EDUVERSE_CHANNEL_ID, {
        description: "Class announcements, assignments, materials, and grade updates.",
        importance: Notifications.AndroidImportance.DEFAULT,
        lightColor: "#38bdf8",
        name: "Eduverse updates",
        vibrationPattern: [0, 250, 250, 250]
      });
    }

    const current = await Notifications.getPermissionsAsync();
    const next = current.granted ? current : await Notifications.requestPermissionsAsync();

    return normalizeStatus(next);
  } catch {
    return "unavailable";
  }
}

export async function showEduverseNotification(notification: NotificationRecord) {
  await Notifications.scheduleNotificationAsync({
    content: {
      body: notification.body,
      data: {
        classId: notification.classId,
        notificationId: notification.id,
        organizationId: notification.organizationId,
        type: notification.type
      },
      sound: false,
      title: notification.title
    },
    trigger: null
  });
}

export function addNotificationResponseListener(callback: (notificationId: string | null) => void) {
  return Notifications.addNotificationResponseReceivedListener((response) => {
    const notificationId = response.notification.request.content.data?.notificationId;
    callback(typeof notificationId === "string" ? notificationId : null);
  });
}

function normalizeStatus(settings: Notifications.NotificationPermissionsStatus): DeviceNotificationStatus {
  const isGranted = settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
  return isGranted ? "granted" : "denied";
}
