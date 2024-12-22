/** DOM の読み込みが完了したら実行される処理 */
window.addEventListener("DOMContentLoaded", () => {
  const $notify_btn = document.getElementById("notify");
  /** 通知を送るボタンがクリックされたら発火 */
  $notify_btn.addEventListener("click", async function () {
    if (Notification.permission === "default") {
      // 通知許可されていない場合
      Notification.requestPermission().then((permission) => {
        // 通知許可ダイアログを表示
        if (permission !== "granted") {
          // 通知が許可されなかった場合
          console.error("通知の許可が得られませんでした。");
          return;
        }
      });
    }
  });
});

/** Service Worker の登録 */
if ("serviceWorker" in navigator) {
  // Service Workerをファイルを読み込んでブラウザに登録する
  navigator.serviceWorker
    .register("service-worker.js", {
      scope: "/",
    })
    .then(() => console.log("serviceWorker を登録しました。"));
} else {
  console.log("serviceWorker に対応していません。");
}

/** Service Worker の準備が出来たら発火 */
navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
  // 公開鍵を pushサーバー が要求する認証用キーにフォーマットする
  applicationServerKey = urlBase64ToUint8Array("生成した鍵の公開鍵を入力");

  // 既存のサブスクリプションを取得
  serviceWorkerRegistration.pushManager
    .getSubscription()
    .then((oldSubscription) => {
      if (oldSubscription) {
        // サブスクリプションが存在する場合
        console.log("古いのありまっせー");
        // ログ出力
        logSubscriptionDetail(oldSubscription);
      } else {
        // サブスクリプションが存在しない場合
        console.log("新しいの作りまっせー");
        // リクエストのオプションを作成
        const options = {
          userVisibleOnly: true,
          applicationServerKey,
        };

        // pushManager へサブスクリプションリクエストを送信
        serviceWorkerRegistration.pushManager
          .subscribe(options)
          .then((newSubscription) => {
            // ログ出力
            logSubscriptionDetail(newSubscription);
          })
          .catch((e) => console.log("pushサーバーへの登録に失敗しました。"));
      }
    });
});

/**
 * サブスクリプションの詳細をログ出力
 * @param {PushSubscription} subscription
 */
function logSubscriptionDetail(subscription) {
  // サブスクリプションから PushサーバーのURLを取得
  const endpoint = subscription.endpoint;
  console.log("endpoint:", endpoint);

  // サブスクリプションから公開鍵を取得
  const rawKey = subscription.getKey("p256dh");
  const publicKey = rawKey
    ? btoa(String.fromCharCode(...new Uint8Array(rawKey)))
    : "";
  console.log("push_public_key:", publicKey);

  // サブスクリプションからトークンを取得
  const rawAuthSecret = subscription.getKey("auth");
  const authToken = rawAuthSecret
    ? btoa(String.fromCharCode(...new Uint8Array(rawAuthSecret)))
    : "";
  console.log("push_auth_token:", authToken);
}

/** サーバー公開鍵をpushサーバーが求める方式にフォーマットする */
function urlBase64ToUint8Array(server_public_key) {
  const padding = "=".repeat((4 - (server_public_key.length % 4)) % 4);
  const base64 = (server_public_key + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
