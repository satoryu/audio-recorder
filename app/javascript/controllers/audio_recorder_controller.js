import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["audio", "transcription"]

  connect() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        this.audioRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })

        let chunks = []
        this.audioRecorder.ondataavailable = (event) => {
          chunks.push(event.data)
        }

        this.audioRecorder.onstop = (_event) => {
          const blob = new Blob(chunks, { type: 'audio/webm' })
          const audioUrl = window.URL.createObjectURL(blob)
          this.audioTarget.src = audioUrl
          chunks = []
          this.transcript(blob)
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

  transcript(blob) {
    const csrfParam = document.head.querySelector('meta[name="csrf-param"]').content
    const csrfToken = document.head.querySelector('meta[name="csrf-token"]').content
    const formData = new FormData()
    formData.set(csrfParam, csrfToken)
    formData.set('audio_file', blob, 'audio.webm')

    fetch('/audios/transcribe', {
      method: 'POST',
      body: formData
    }).then((response) => response.json() )
    .then((json) => {
      this.transcriptionTarget.textContent += json.text
    })
  }
}
