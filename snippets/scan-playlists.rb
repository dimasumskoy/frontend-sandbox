def scan
  @channel   = Channel.find_by(token: params[:token])
  @playlists = @channel.channels_playlists.for_current_datetime.map(&:playlist)
  @songs     = @playlists.collect(&:songs).flatten

  render json: @songs, each_serializer: Cabinet::SongSerializer
end
