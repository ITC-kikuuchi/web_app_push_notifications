// プッシュ通知を受け取ったときのイベント
self.addEventListener("push", function (event) {
  const title = "プッシュ通知"
  const options = {
    body: event.data.text(),
    tag: title,
    icon: "icon-512x512.png",
    badge: "icon-512x512.png",
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// プッシュ通知をクリックしたときのイベント
self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    // プッシュ通知をクリックしたときにブラウザを起動して表示するURL
    clients.openWindow("https://localhost/index.html")
  );
});
