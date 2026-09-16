// Wraps the browser's callback-based Geolocation API in a Promise so it
// can be used with async/await like the rest of the app's data fetching.
export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported in this browser.'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          reject(new Error('Location access was denied. Enable it in your browser settings, or search instead.'))
        } else {
          reject(new Error("Couldn't get your location. Try searching instead."))
        }
      },
      { timeout: 10000, maximumAge: 5 * 60 * 1000 }
    )
  })
}
