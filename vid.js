function getVideoFromURL(url, info, direct)
{
	//youtube
	if (url.toLowerCase.indexOf('youtube.com') && url.toLowerCase.indexOf('watch'))
	{
		if (direct) return -1;
		if (!direct) return createYoutubeHTML(getYoutubevid(url), info[0], info[1], info[2], info[3], info[4], info[5]);
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
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
