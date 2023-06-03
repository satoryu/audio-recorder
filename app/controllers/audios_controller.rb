class AudiosController < ApplicationController
  def new; end

  def transcribe
    client = OpenAI::Client.new

    response = client.transcribe(
      parameters: {
        model: 'whisper-1',
        language: 'ja',
        file: params[:audio_file].open
      }
    )

    render json: response
  end
end
