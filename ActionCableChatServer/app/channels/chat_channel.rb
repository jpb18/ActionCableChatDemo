class ChatChannel < ApplicationCable::Channel
  # this is called when the consumer becomes a subscriber to this channel
  def subscribed
    stream_from "chat_#{params[:room]}"
    message = { from: "system", message: "#{params[:username]} joined!" }
    ActionCable.server.broadcast("chat_#{params[:room]}", message)
  end

  def unsubscribe
    message = { from: "system", message: "#{params[:username]} left!" }
    ActionCable.server.broadcast("chat_#{params[:room]}", message)
    stop_stream_from "chat_#{params[:room]}"
  end

  def receive(message)
    ActionCable.server.broadcast("chat_#{params[:room]}", message)
  end
end
