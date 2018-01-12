if(typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  alert('Aguarde a instalação do pwa')
  navigator.serviceWorker.register('/service-worker.js', {scope: './', insecure: true}).then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful');
  }).catch(function(err) {
    // registration failed :(
    alert(err)
  });
}
