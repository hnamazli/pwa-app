import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {      
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    })
  }, [])

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
    } catch (error) {
      console.error('Error requesting notification permission:', error)
    }
  }

  const showNotification = async () => {
    const registration = await navigator.serviceWorker.getRegistration();


    if (Notification.permission === 'granted') {
      if('showNotification' in registration!) {
        registration.showNotification('Test PWA notifications', {
          body: 'Hello, World!',
          icon: 'https://placekitten.com/200/300',
        });
      } else {
        new Notification('Test PWA notifications', {
          body: 'Hello, World!',
          icon: 'https://placekitten.com/200/300',
        });
      }
    } else {
      if(Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
    
        if(permission === 'granted') {
          if('showNotification' in registration!) {
            registration.showNotification('Test PWA notifications', {
              body: 'Hello, World!',
              icon: 'https://placekitten.com/200/300',
            });
          } else {
            new Notification('Test PWA notifications', {
              body: 'Hello, World!',
              icon: 'https://placekitten.com/200/300',
            });
          }
        }
    }
  }
}

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
      {notificationPermission === 'granted' && (
        <button
          onClick={showNotification}
        >
          Send Notification
        </button>
      )}
      {isInstallable && (
        <button
          onClick={installPWA}
        >
          Install PWA
        </button>
      )}
    </div>
  )
}

export default App
