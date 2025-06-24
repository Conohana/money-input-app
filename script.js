const display = document.getElementById('displayAmount');
const keys = document.querySelectorAll('.key');
const sendButton = document.getElementById('sendButton');

let currentAmount = '0'; // 現在入力されている金額

// 金額表示を更新する関数
function updateDisplay() {
    // 0始まりの複数桁の数字にならないように処理
    if (currentAmount.length > 1 && currentAmount.startsWith('0')) {
        currentAmount = currentAmount.substring(1);
    }
    // 空になったら'0'に戻す
    if (currentAmount === '') {
        currentAmount = '0';
    }
    // カンマ区切りにする (オプション)
    display.textContent = Number(currentAmount).toLocaleString();
}

// テンキーボタンが押された時の処理
keys.forEach(key => {
    key.addEventListener('click', () => {
        const value = key.dataset.value;

        if (value === 'C') { // クリアボタン
            currentAmount = '0';
        } else if (value === 'Del') { // 削除ボタン
            if (currentAmount.length > 1) {
                currentAmount = currentAmount.slice(0, -1);
            } else {
                currentAmount = '0';
            }
        } else if (value === '00' || value === '000') { // 00, 000ボタン
            if (currentAmount === '0') {
                currentAmount = value; // '0'のときは直接置き換え
            } else {
                currentAmount += value;
            }
        }
        else { // 数字ボタン
            if (currentAmount === '0') {
                currentAmount = value;
            } else {
                currentAmount += value;
            }
        }
        updateDisplay();
    });
});

// 送信ボタンが押された時の処理
sendButton.addEventListener('click', () => {
    const amountToSend = Number(currentAmount); // 数値に変換して送信

    if (amountToSend === 0 && currentAmount.length === 1) {
        alert('金額を入力してください。');
        return;
    }

    // Google Apps ScriptのウェブアプリURLをここに貼り付けてください
    const gasWebAppUrl = 'https://script.google.com/macros/s/AKfycbzJECf66RLInpDdAWWZPvx4dEawu4hhhYwJPQCBsrDnWBETnA0y-S_QcO7K1fcFFcJIJg/exec'; // ★あなたのURLに置き換える！

    // ここからGASへの送信処理
    fetch(gasWebAppUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `amount=${encodeURIComponent(amountToSend)}`, // GASのdoPostで受け取るパラメータ名が'amount'であることを確認
    })
    .then(response => response.text())
    .then(result => {
        console.log('GASからの応答:', result);
        alert('金額がスプレッドシートに記録されました！');
        currentAmount = '0'; // 送信後に入力クリア
        updateDisplay();
    })
    .catch(error => {
        console.error('データの送信中にエラーが発生しました:', error);
        alert('金額の記録に失敗しました。ネットワーク接続を確認してください。');
    });
});

// 初期表示
updateDisplay();
