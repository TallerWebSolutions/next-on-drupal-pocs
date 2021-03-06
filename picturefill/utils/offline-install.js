if (
  process.env.NODE_ENV === 'production' &&
  typeof window !== 'undefined' &&
  'serviceWorker' in navigator
) {
  navigator.serviceWorker
    .getRegistration('./').then(function(registrations) {
      console.log('agora', registrations)
        registrations.unregister().then(function(boolean) {
            console.log(boolean)
        })
  })
  navigator.serviceWorker
    .register('/service-worker.js', {
      scope: './',
      insecure: true
    })
    .then(reg => {
      reg.onupdatefound = () => {
        const installingWorker = reg.installing

        installingWorker.onstatechange = () => {
          switch (installingWorker.state) {
            case 'installed':
              if (navigator.serviceWorker.controller) {
                console.log('New or updated content is available.')
              } else {
                console.log('Content is now available offline!')
              }
              break
            case 'redundant':
              console.log('The installing serviceWorker became redundant.')
              break
          }
        }
      }
    })
    .catch(e => {
      console.error('Error during service worker registration:', e)
    })
}
