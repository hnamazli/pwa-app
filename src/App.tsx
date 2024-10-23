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
  const [userAgent, setUserAgent] = useState('')

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
      applicationServerKey: 'BEunnvyxyllfelEPAUPtQVNbZYOril6iaahlZprSYZI5Fz9vV43HeqPmCQxn94g0fSENUBkB6YnyHH0wsRLgR-w'
    })

    setSubscribeResult(JSON.stringify(subscription))
    setUserAgent(navigator.userAgent)

    await fetch("https://pwa-server-two.vercel.app/subscribe", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription)
    }).then((response) => response.json()).then((data) => {
      setResult(JSON.stringify(data))
      setIsError('Not error subscribing to notifications')
    }).catch((error) => {
      setResult(JSON.stringify(error))
      setIsError('Error subscribing to notifications')
    })

    // await fetch('https://api-dev.priem.one/api/web-push/subscription', {
    //   method: 'POST',
    //   credentials: 'include',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Cookie: '_ym_uid=1729330625486190489; _ym_d=1729330625; _ym_isad=2; _ym_visorc=w; access_token=eyJhbGciOiJSUzI1NiIsImtpZCI6IkNEQ0IxNjk5OEJCQUZGMTkwRjRCQkQxOEM5Q0YyOUYxQjMxOTVCRUVSUzI1NiIsIng1dCI6Inpjc1dtWXU2X3hrUFM3MFl5YzhwOGJNWlctNCIsInR5cCI6ImF0K2p3dCJ9.eyJpc3MiOiJwcmllbS5jb20iLCJuYmYiOjE3Mjk1ODI2NDYsImlhdCI6MTcyOTU4MjY0NiwiZXhwIjoxNzMyMTc0NjQ2LCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiNGYyYzMxM2JmYzM5NDQzYWIxNjNhN2E0Y2Q0YjZiNGEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjIyMDQ2IiwiaXNTdHVkZW50IjoiRmFsc2UiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJTcGVjaWFsaXN0IiwiY2xpZW50X2lkIjoiUHJpZW0uUHN5LlJFU1QuQVBJIn0.AkzHJ-B_WGJZah7k9cYh9bCZK2sqkAgZYT0oS4LKx0lBtviCsn3c3-lWcU9GTFQBKCH6FRcrgd5nxyVZEpgEQe_48Iv_drc5ScelNFNGB0Tyzy2veZArfCck8iECX_BMhNrh0cnoEgs17_bLqGwOL4M8xaejaSeWkZ63I5NRALvr_ICA_FH74Mbbjmj2HXqYf2v1H4KM-4G6NdU_MOHKhIksO9V4sFntVhBskKd94HbLDdzspBQj2-Q1Nsct_j8G0UW3YInS9AgyesiGFsWztPc6bF-9c4VoC69o66y3kOYf_hTXBcHBduZ8nnkwSl23Ym-oOrNyOhkJT2Xq77fe8g; refresh_token=bRh15yrWgNhTGNJi%2BDfFWDYxUdW2kY1dgyuifeN090w%3D'
    //   },
    //   body: JSON.stringify({
    //     deviceId: 'fed42cd1-0112-4482-935a-5c9cbc9cccd2',
    //     userAgent: navigator.userAgent,
    //     ...subscription.toJSON(),
    //   })
    // }).then((response) => response.json()).then((data) => {
    //   setResult(JSON.stringify(data))
    //   setIsError('Not error subscribing to notifications')
    // }).catch((error) => {
    //   setResult(JSON.stringify(error))
    //   setIsError('Error subscribing to notifications')
    // })
  }

  const requestNotificationPermission = async () => {
    try {
      if (!("Notification" in window)) {
        // Check if the browser supports notifications
        alert("This browser does not support desktop notification");

        return;
      } 

      if (Notification.permission === 'granted') {
        setNotificationPermission('granted')
        subscribeToNotifications()
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission()
        
        setNotificationPermission(permission)
        if (permission === 'granted') {
          subscribeToNotifications()
        }
      }

      // const permission = await Notification.requestPermission()
      // setNotificationPermission(permission)
      // if (permission === 'granted') {
      //   subscribeToNotifications()
      // }
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
      <span>User agent</span>
      <span>
        {userAgent}
      </span>
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
