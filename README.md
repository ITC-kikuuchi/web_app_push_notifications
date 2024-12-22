# web_app_push_notifications
ウェブアプリプッシュ通知機能

# 環境構築手順
1. リポジトリをクローンする
2. ブランチを `PushManager` に変更する
3. `docker` 配下に `certs` フォルダを作成する。
4. 自己署名証明書を発行する （`/docker` にて以下コマンド実行）

```
// IP: の値は接続している Wi-fi のIPアドレスに変更
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout certs/localhost.key \
  -out certs/localhost.crt \
  -subj "/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,DNS:example.com,DNS:dev.local,IP:127.0.0.1"
```
5. 生成した自己署名証明書をキーチェーンアクセスに登録し、信頼する証明書に変更する
6. dockerコンテナを起動する
7. https://localhost/index.html にアクセスして画面が表示されれば構築完了



# プッシュ通知送信手順
1. [Push Companion](https://web-push-codelab.glitch.me/) にて鍵ペアを生成し、`Send.php` 及び、`index.js` の下記に貼り付け
```php
Send.php

// VAPIDに必要な情報の作成
$auth = [
    'VAPID' => [
        'subject' => 'https://localhost/', // localhost でうまくいかない場合はIPアドレスを指定
        'publicKey' => '生成した鍵の公開鍵を入力',
        'privateKey' => '生成した鍵の秘密鍵を入力',
    ]
];
```
```javascript
index.js

  // 公開鍵を pushサーバー が要求する認証用キーにフォーマットする
  applicationServerKey = urlBase64ToUint8Array("生成した鍵の公開鍵を入力");
```

2. iPhone を Mac に接続し、iPhone で safari を起動し、https://Wi-fiのIPアドレス/index.html を表示し、ホーム画面に追加する
3. ホーム画面に追加した アプリを起動
4. Mac の safari を起動し、iPhone の Webインスペクタを起動し、コンソールを表示する
5. 画面の「通知を許可」をタップし、通知を許可する
6. コンソールに表示された `endpoint, push_public_key, push_auth_token` をコピーして、`Send.php` の下記の貼り付け
```php
// サブスクリプション情報の作成
$subscription = Subscription::create([
    'endpoint' => 'サブスクリプションの endpoint の値を入力',
    'publicKey' => 'サブスクリプションの push_public_key の値を入力',
    'authToken' => 'サブスクリプションの push_auth_token の値を入力',
]);
```
7. `src/app` にて `$ php Send.php` を実行
8. 通知を取得することができたら動作成功
