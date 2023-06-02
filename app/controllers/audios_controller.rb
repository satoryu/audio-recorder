class AudiosController < ApplicationController
  def new; end

  def transcript
    p params[:audio_file]

    render json: { text: 'success' }
  end
end
