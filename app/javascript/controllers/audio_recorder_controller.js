import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["audio"]

  connect() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        this.audioRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })

        this.audioRecorder.ondataavailable = (event) => {
          const blob = new Blob([event.data])
          console.log(blob)
          const audioUrl = window.URL.createObjectURL(blob)
          this.audioTarget.src = audioUrl
          this.audioTarget.controls = true
        }
      }).catch((error) => console.log(error))
  }

  start() {
    if (this.audioRecorder) {
      this.audioRecorder.start()
    }
  }

  stop() {
    if (this.audioRecorder.state == "recording") {
      this.audioRecorder.stop()
      console.log('Stopped recording')
    }
  }
}
