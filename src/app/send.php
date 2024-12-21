<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;

// VAPIDに必要な情報の作成
$auth = [
    'VAPID' => [
        'subject' => 'https://localhost/', // localhost でうまくいかない場合はIPアドレスを指定
        'publicKey' => '生成した鍵の公開鍵を入力',
        'privateKey' => '生成した鍵の秘密鍵を入力',
    ]
];

// VAPIDを行い、 WebPushクラスのインスタンスを作成
$webPush = new WebPush($auth);

// サブスクリプション情報の作成
$subscription = Subscription::create([
    'endpoint' => 'サブスクリプションの endpoint の値を入力',
    'publicKey' => 'サブスクリプションの push_public_key の値を入力',
    'authToken' => 'サブスクリプションの push_auth_token の値を入力',
]);

// WebPush通知の送信
$report = $webPush->sendOneNotification(
    $subscription,
    'push通知でっせ〜'
);

// WebPush通知の結果
if ($report->isSuccess()) {
    echo '送信成功でっせ〜';
} else {
    echo '送信失敗でっせ〜';
}
