import store from '../../store/index'
import { toLocalePublicationString } from '../utils'
import { isNullOrEmpty } from '../strings'

function getCurrentInstance() {
  return store.getters.getCurrentPipedInstance
}

export async function pipedRequest({ resource, id = '', params = {}, doLogError = true, subResource = '' }) {
  const requestUrl = getCurrentInstance() + '/' + resource + '/' + id + (!isNullOrEmpty(subResource) ? `/${subResource}` : '') + '?' + new URLSearchParams(params).toString()
  return await fetch(requestUrl)
    .then((response) => response.json())
    .then((json) => {
      if (json.error !== undefined) {
        throw new Error(json.error)
      }
      return json
    })
    .catch((error) => {
      if (doLogError) {
        console.error('Piped API error', requestUrl, error)
      }
      return { isError: true, error }
    })
}

export async function getPipedComments(videoId) {
  const commentInfo = await pipedRequest({ resource: 'comments', id: videoId })
  if (commentInfo.isError) {
    throw commentInfo.error
  } else {
    commentInfo.comments = parsePipedComments(commentInfo.comments)
    return {
      comments: commentInfo.comments,
      continuation: commentInfo.nextpage
    }
  }
}

export async function getPipedCommentsMore({ videoId, continuation }) {
  const commentInfo = await pipedRequest({
    resource: 'nextpage/comments',
    id: videoId,
    params: {
      nextpage: continuation
    }
  })

  if (commentInfo.isError) {
    throw commentInfo.error
  } else {
    commentInfo.comments = parsePipedComments(commentInfo.comments)
    return {
      comments: commentInfo.comments,
      continuation: commentInfo.nextpage
    }
  }
}
function parsePipedComments(comments) {
  return comments.map(comment => {
    return {
      dataType: 'piped',
      author: comment.author,
      authorLink: comment.commentorUrl.replace('/channel/'),
      authorThumb: comment.thumbnail,
      comemntId: comment.commentId,
      text: comment.commentText,
      isPinned: comment.pinned,
      isVerified: comment.verified,
      numReplies: comment.replyCount,
      likes: comment.likeCount,
      isHearted: comment.isHearted,
      replyToken: comment.repliesPage,
      isMember: false,
      isOwner: false,
      showReplies: false,
      replies: [],
      time: toLocalePublicationString({
        publishText: comment.commentedTime
      })
    }
  })
}

export async function getPipedPlaylist(playlistId) {
  const playlistInfo = await pipedRequest({ resource: 'playlists', id: playlistId })
  if (playlistInfo.isError) {
    throw playlistInfo.error
  } else {
    const parsedVideos = parsePipedVideos(playlistInfo.relatedStreams)
    return {
      nextpage: playlistInfo.nextpage,
      playlist: parsePipedPlaylist(playlistId, playlistInfo, parsedVideos),
      videos: parsedVideos
    }
  }
}

export async function getPipedPlaylistMore({ playlistId, continuation }) {
  const playlistInfo = await pipedRequest({
    resource: 'nextpage/playlists',
    id: playlistId,
    params: {
      nextpage: continuation
    }
  })

  if (playlistInfo.isError) {
    throw playlistInfo.error
  } else {
    return {
      nextpage: playlistInfo.nextpage,
      videos: parsePipedVideos(playlistInfo.relatedStreams)
    }
  }
}

export function getPipedUrlInfo(url) {
  const regex = /^(?<baseUrl>(https?:\/\/)[^/]*)\/((?<imageProtocol>vi|ytc)\/)?(?<resource>[^?]*).*host=(?<host>[^&]*)/
  return url.match(regex)?.groups
}

export function pipedImageToYouTube(url) {
  const urlInfo = getPipedUrlInfo(url)
  let newUrl = `https://${urlInfo.host}/`
  if (!isNullOrEmpty(urlInfo.imageProtocol)) {
    newUrl += `${urlInfo.imageProtocol}/`
  }
  newUrl += urlInfo.resource
  return newUrl
}

function parsePipedPlaylist(playlistId, result, parsedVideos) {
  return {
    id: playlistId,
    title: result.name,
    description: result.description,
    firstVideoId: parsedVideos[0].videoId,
    viewCount: null,
    videoCount: result.videos,
    channelName: result.uploader,
    channelThumbnail: result.uploaderAvatar,
    channelId: result.uploaderUrl.replace('/channel/', ''),
    firstVideoThumbnail: parsedVideos[0].thumbnail,
    infoSource: 'piped'
  }
}

function parsePipedVideos(videoList) {
  return videoList.map(video => {
    return {
      videoId: video.url.replace('/watch?v=', ''),
      title: video.title,
      author: video.uploaderName,
      authorId: video.uploaderUrl.replace('/channel/', ''),
      lengthSeconds: video.duration,
      description: video.shortDescription,
      uploaded: video.uploaded, // uploaded time stamp
      viewCount: video.views,
      thumbnail: video.thumbnail
    }
  })
}
