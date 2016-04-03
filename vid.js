var VideoStreamer = {};
var VideoStreamer["Youtube"] = {};
var VideoStreamer.Youtube["x"] = 640;
var VideoStreamer.Youtube["y"] = 360;
var VideoStreamer.Youtube["showSuggested"] = false;
var VideoStreamer.Youtube["showControls"] = false;
var VideoStreamer.Youtube["showTitle"] = false;
var VideoStreamer.Youtube["privacyMode"] = false;
var VideoStreamer["Vimeo"] = {};


function getVideoFromURL(url, info, direct)
{
	//youtube
	if (url.toLowerCase.indexOf('youtube.com') && url.toLowerCase.indexOf('watch'))
	{
		info = info.Youtube
		if (direct) return getYoutubeDirect(getYoutubevid(url)).getSource("video/webm", "medium"); //não funcional, chrome bloqueia conexão com o youtube
		if (!direct) return createYoutubeHTML(getYoutubevid(url), info.x, info.y, info.showSuggested, info.showControls, info.showTitle, info.privacyMode);
	}
	//vimeo

}

function getYoutubevid(url)
{
	var splited = url.split("/");
	for (i=0;i < splited.lenght(); i++)
	{
		if (splited[i].substring(0, 5).toLowerCase() == "watch")
		{
			return splited[i].substring(8, splited[i].lenght);
		}
	}
}

function createYoutubeHTML(ytcode, sizex, sizey, showSuggested, showControls, showTitle, privacyMode)
{
	var ytHTML = '<iframe width="' + sizex + '" height="' + sizey;
	if (!privacyMode) ytHTML = ytHTML + '" src="https://www.youtube.com/embed/' + ytcode;
	if (privacyMode) ytHTML = ytHTML + '" src="https://www.youtube-nocookie.com/embed/' + ytcode;
    if (!(showSuggested && showControl && showTitle)) ytHTML = ytHTML + '?';
	if (!showSuggested) ytHTML = ytHTML + 'rel=0';
	if (!showControl) ytHTML = ytHTML + (showSuggested) ? '&amp;' : '' + 'controls=0';
	if (!showTitle) ytHTML = ytHTML + (showSuggested && showControl) ? '&amp;' : '' + 'showinfo=0';
	return ytHTML + '" frameborder="0" allowfullscreen></iframe>';
}

function GETr(url)
{
    var Http = new XMLHttpRequest();
    var ready;
    var status;
    Http.onreadystatechange = function() { 
        if (Http.readyState == 4)
        {
        	ready = true;
        	if (Http.status == 200)
        	{
        		status = true;
        	}
        }
    }
    Http.open("GET", url, true);
    Http.send(null);
    while (true)
    {
    	if (ready)
    	{
    		if (status) return Http.responseText;
    		return -1
    	}
    }
}

function decodeQueryString(queryString)
{
    var key, keyValPair, keyValPairs, r, val, _i, _len;
    r = {};
    keyValPairs = queryString.split("&");
    for (_i = 0, _len = keyValPairs.length; _i < _len; _i++) {
      keyValPair = keyValPairs[_i];
      key = decodeURIComponent(keyValPair.split("=")[0]);
      val = decodeURIComponent(keyValPair.split("=")[1] || "");
      r[key] = val;
    }
    return r;
}

function decodeStreamMap(url_encoded_fmt_stream_map)
{
	var quality, sources, stream, type, urlEncodedStream, _i, _len, _ref;
    sources = {};
    _ref = url_encoded_fmt_stream_map.split(",");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      urlEncodedStream = _ref[_i];
      stream = decodeQueryString(urlEncodedStream);
      type = stream.type.split(";")[0];
      quality = stream.quality.split(",")[0];
      stream.original_url = stream.url;
      stream.url = "" + stream.url + "&signature=" + stream.sig;
      sources["" + type + " " + quality] = stream;
    }
    return sources;
}

function getYoutubeDirect(id)
{
	var video_info = GETr("http://www.youtube.com/get_video_info?video_id=" + id)
	var video;
      video = decodeQueryString(video_info);
      video.sources = decodeStreamMap(video.url_encoded_fmt_stream_map);
      video.getSource = function(type, quality) {
        var exact, key, lowest, source, _ref;
        lowest = null;
        exact = null;
        _ref = this.sources;
        for (key in _ref) {
          source = _ref[key];
          if (source.type.match(type)) {
            if (source.quality.match(quality)) {
              exact = source;
            } else {
              lowest = source;
            }
          }
        }
        return exact || lowest;
      };
      return video;
}
