/**
 * @file index.js
 * @author clark-t (clarktanglei@163.com)
 */

function main() {
  var $state = document.getElementById('notification-state');
  if (typeof Notification === 'undefined') {
    $state.innerText = '浏览器不支持 Notification API';
    return;
  }

  if (Notification.permission === 'denied') {
    $state.innerText = 'Notification 权限已被禁用';
    return;
  }

  if (Notification.permission === 'granted') {
    $state.innerText = 'Notification 可用';
    register();
  } else {
    Notification.requestPermission().then(function (permission) {
      switch (permission) {
        case 'granted':
          $state.innerText = 'Notification 可用';
          register();
          break;
        case 'denied':
          $state.innerText = 'Notification 权限已被禁用';
          break;
        default:
        $state.innerText = 'Notification 权限尚未授权';
      }
    });
  }
}

function register () {
  document.getElementById('btn-title').addEventListener('click', notifyTitle);
  document.getElementById('btn-long-title').addEventListener('click', notifyLongTitle);
  document.getElementById('btn-dir-ltr').addEventListener('click', notifyDirLtr);
  document.getElementById('btn-dir-rtl').addEventListener('click', notifyDirRtl);
  document.getElementById('btn-body').addEventListener('click', notifyBody);
  document.getElementById('btn-long-body').addEventListener('click', notifyLongBody);
  document.getElementById('btn-icon').addEventListener('click', notifyIcon);
  document.getElementById('btn-badge').addEventListener('click', notifyBadge);
  document.getElementById('btn-image').addEventListener('click', notifyImage);
  document.getElementById('btn-vibrate').addEventListener('click', notifyVibrate);
  document.getElementById('btn-tag-warning').addEventListener('click', notifyTagWarning);
  document.getElementById('btn-tag-error').addEventListener('click', notifyTagError);
  document.getElementById('btn-renotify-true').addEventListener('click', notifyRenotifyTrue);
  document.getElementById('btn-renotify-false').addEventListener('click', notifyRenotifyFalse);
  document.getElementById('btn-data').addEventListener('click', notifyData);
  document.getElementById('btn-actions').addEventListener('click', notifyActions);
  document.getElementById('btn-require-interaction').addEventListener('click', notifyRequireInteraction);
}

function notifyTitle () {
  var notification = new Notification('测试标题');
  notification.onclick = function () {
    notification.close();
  };
}

function notifyLongTitle () {
  var notification = new Notification('测试标题长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长');
  notification.onclick = function () {
    notification.close();
  };
}

function notifyBody () {
  var notification = new Notification('测试标题', {
    body: '测试通知内容'
  });
  notification.onclick = function () {
    notification.close();
  };
}

function notifyLongBody () {
  var notification = new Notification('测试长标题长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长', {
    body: '测试通知内容长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长'
  });
  notification.onclick = function () {
    notification.close();
  };
}

function notifyDirLtr () {
  var notification = new Notification('عنوان الاختبار...', {
    body: 'اختبار محتوى الإخطار...',
    dir: 'ltr'
  });
  notification.onclick = function () {
    notification.close();
  };
}

function notifyDirRtl () {
  var notification = new Notification('عنوان الاختبار...', {
    body: 'اختبار محتوى الإخطار...',
    dir: 'rtl'
  });
  notification.onclick = function () {
    notification.close();
  };
}

function notifyIcon () {
  var notification = new Notification('测试通知图标', {
    body: '测试通知内容',
    icon: 'https://gss0.baidu.com/9rkZbzqaKgQUohGko9WTAnF6hhy/assets/pwa/demo/pwa-icon.png'
  });
  notification.onclick = function () {
    notification.close();
  };
}

function notifyBadge () {
  var notification = new Notification('测试通知小图标', {
    body: '测试通知内容',
    badge: 'https://gss0.baidu.com/9rkZbzqaKgQUohGko9WTAnF6hhy/assets/pwa/demo/pwa-badge.png'
  })
  notification.onclick = function () {
    notification.close();
  };
}

function notifyImage () {
  var notification = new Notification('测试图片预览通知', {
    body: '测试图片通知内容',
    image: 'https://gss0.baidu.com/9rkZbzqaKgQUohGko9WTAnF6hhy/assets/pwa/demo/pwa-image.png'
  })
  notification.onclick = function () {
    notification.close();
  };
}

function notifyVibrate () {
  var notification = new Notification('测试振动通知', {
    body: '测试振动通知内容',
    vibrate: [200, 100]
  })
  notification.onclick = function () {
    notification.close();
  };
}

function notifyTagWarning () {
  var notification = new Notification('测试 tag：warning', {
    body: '测试通知内容',
    tag: 'warning'
  });
  notification.onclick = function () {
    notification.close();
  };
}

function notifyTagError () {
  var notification = new Notification('测试 tag：error', {
    body: '测试通知内容',
    tag: 'error'
  });
  notification.onclick = function () {
    notification.close();
  };
}

function notifyRenotifyFalse () {
  for (var i = 0; i < 3; i++) {
    var notification = new Notification('测试 renotify：false', {
      body: '第' + (i + 1) + '条测试通知内容',
      tag: 'renotify-false',
      renotify: false
    });
    notification.onclick = function () {
      notification.close();
    };
  }
}

function notifyRenotifyTrue () {
  for (var i = 0; i < 3; i++) {
    var notification = new Notification('测试 renotify：true', {
      body: '第' + (i + 1) + '条测试通知内容',
      tag: 'renotify-true',
      renotify: true
    });
    notification.onclick = function () {
      notification.close();
    };
  }
}

function notifyData () {
  var notification = new Notification('测试 data 传值', {
    body: '测试通知内容',
    data: new Date() + ''
  });
  notification.onclick = function () {
    notification.close();
    document.getElementById('notification-data-result').innerText = notification.data;
  };
}

function notifyActions () {
  var notification = new Notification('测试 actions', {
    body: '测试通知内容',
    actions: [
      {
        'action': 'btn',
        'icon': 'https://gss0.baidu.com/9rkZbzqaKgQUohGko9WTAnF6hhy/assets/pwa/demo/pwa-badge.png',
        'title': '测试按钮'
      }
    ]
  });
  notification.onclick = function (e) {
    notification.close();
    var text;
    if (e.action === 'btn') {
      text = '测试按钮';
    } else {
      text = '通知';
    }
    document.getElementById('notification-data-result').innerText = text;
  };
}

function notifyRequireInteraction () {
  var notification = new Notification('测试 requireInteraction：true', {
    body: '测试通知内容',
    requireInteraction: true
  });
  notification.onclick = function () {
    notification.close();
  };
}

main();
