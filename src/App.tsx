import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [result, setResult] = useState('')
  const [subscribeResult, setSubscribeResult] = useState('')
  const [isError, setIsError] = useState('')

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {      
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    })
  }, [])

  const subscribeToNotifications = async () => {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: 'BD7gTHaCVCcPpMA_LcOk_S8OB8TXtnxiwEeD8xiRdcL-A1RsT5gj16rE_IUaSbUaVnZWkEpPQu5IfYEEx_TRAAM'
    })

    setSubscribeResult(JSON.stringify(subscription))

    await fetch('https://api-dev.priem.one/api/web-push/subscription', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: '_ym_uid=1729330541121820067; _ym_d=1729330541; access_token=eyJhbGciOiJSUzI1NiIsImtpZCI6IkNEQ0IxNjk5OEJCQUZGMTkwRjRCQkQxOEM5Q0YyOUYxQjMxOTVCRUVSUzI1NiIsIng1dCI6Inpjc1dtWXU2X3hrUFM3MFl5YzhwOGJNWlctNCIsInR5cCI6ImF0K2p3dCJ9.eyJpc3MiOiJwcmllbS5jb20iLCJuYmYiOjE3MjkzNDM1NjIsImlhdCI6MTcyOTM0MzU2MiwiZXhwIjoxNzMxOTM1NTYyLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiNGYyYzMxM2JmYzM5NDQzYWIxNjNhN2E0Y2Q0YjZiNGEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjIyMDQ2IiwiaXNTdHVkZW50IjoiRmFsc2UiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJTcGVjaWFsaXN0IiwiY2xpZW50X2lkIjoiUHJpZW0uUHN5LlJFU1QuQVBJIn0.S3x_BCAy_mn6WGpNhBW1ZT0QMVw04vejGa75SF0QBO2gaA6Ffu1qOVSktm8TAVLR3rrqojODp334vcIFOE0gpNj8ZXZiiinPHb39FToXllU1KvrnBw33S1u429k-HWJKPWNMnNahO3-NdbP3TCfXkkpBblkdrnhwjG8W8IX_Etx9Q2oBOnLxV4O0TapVMxF6yLwKzzfBUxpCVGDGEGX916tH3A2RbouPSKq-IxoOkjPjcT4imbcjIibje9jRGIsMFVU4J9gXMvqVYDgekIZ2iUYhn_lu4OwhtYjCQ9_nJ3SUAPk_u3LPAf4EqVfn7bkhp8MI_ZFE0fcviNcSzYU4NQ; refresh_token=wrNXQHldWoEWlujY%2F0l0gDWxEVvD0Sbk4thzwXTqBxY%3D; _ym_isad=2'
      },
      body: JSON.stringify({
        deviceId: 'f1a195bf-c72e-4dee-8705-eb96e1456f27',
        userAgent: navigator.userAgent,
        ...subscription.toJSON(),
      })
    }).then((response) => response.json()).then((data) => {
      setResult(JSON.stringify(data))
      setIsError('Not error subscribing to notifications')
    }).catch((error) => {
      console.error('Error subscribing to notifications:', error)
      setResult(JSON.stringify(error))
      setIsError('Error subscribing to notifications')
    })
  }

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
      if (permission === 'granted') {
        subscribeToNotifications()
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error)
    }
  }

  // const showNotification = async () => {
  //   const registration = await navigator.serviceWorker.getRegistration();


  //   if (Notification.permission === 'granted') {
  //     if('showNotification' in registration!) {
  //       registration.showNotification('Test PWA notifications', {
  //         body: 'Hello, World!',
  //         icon: 'https://placekitten.com/200/300',
  //       });
  //     } else {
  //       new Notification('Test PWA notifications', {
  //         body: 'Hello, World!',
  //         icon: 'https://placekitten.com/200/300',
  //       });
  //     }
  //   } else {
  //     if(Notification.permission !== 'denied') {
  //       const permission = await Notification.requestPermission();
    
  //       if(permission === 'granted') {
  //         if('showNotification' in registration!) {
  //           registration.showNotification('Test PWA notifications', {
  //             body: 'Hello, World!',
  //             icon: 'https://placekitten.com/200/300',
  //           });
  //         } else {
  //           new Notification('Test PWA notifications', {
  //             body: 'Hello, World!',
  //             icon: 'https://placekitten.com/200/300',
  //           });
  //         }
  //       }
  //   }
  // }
  // }

  const installPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }
      setDeferredPrompt(null)
      setIsInstallable(false)
    }
  }

  return (
    <div className="card">
      {notificationPermission !== 'granted' && (
        <button
          onClick={requestNotificationPermission}
        >
          Request Notification Permission
        </button>
      )}
      {/* notificationPermission === 'granted' && (
        <button
          onClick={showNotification}
        >
          Send Notification
        </button>
      ) */}
      {isInstallable && (
        <button
          onClick={installPWA}
        >
          Install PWA
        </button>
      )}
      <span>Line subscribe</span>
      <pre>
        {subscribeResult}
      </pre>
      <span>Line result</span>
      <pre>
        {result}
      </pre>
      <span>Line error</span>
      <span>
        {isError}
      </span>
    </div>
  )
}

export default App
