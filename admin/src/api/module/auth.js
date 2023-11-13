export default function (api) {
  return {
    login (data) {
      return api.post('/login', data)
    },
    // get,loginuserinfo
    loginuserinfo () {
      return api.get('/loginuserinfo', {
        shouldAdminJWT: true
      })
    },
    // put,loginuserinfo
    updateLoginUserInfo (data) {
      return api.put('/loginuserinfo', data, {
        shouldAdminJWT: true
      })
    },
    // post sort/create
    createSort (data) {
      return api.post('/sort/create', data, {
        shouldAdminJWT: true
      })
    },
    // get sort/list
    getSortList () {
      return api.get('/sort/list', {
        shouldAdminJWT: true
      })
    },
    // get sort/detail
    getSortDetail (data) {
      return api.get('/sort/detail', {
        params: data,
        shouldAdminJWT: true
      })
    },
    // put sort/update
    updateSort (data) {
      return api.put('/sort/update', data, {
        shouldAdminJWT: true
      })
    },
    // delete sort/delete
    deleteSort (data) {
      return api.delete('/sort/delete', {
        params: data,
        shouldAdminJWT: true
      })
    },
    // get tag/list
    getTagList (data) {
      return api.get('/tag/list', {
        params: data,
        shouldAdminJWT: true
      })
    },
    // get tag/detail
    getTagDetail (data) {
      return api.get('/tag/detail', {
        params: data,
        shouldAdminJWT: true
      })
    },
    // post tag/create
    createTag (data) {
      return api.post('/tag/create', data, {
        shouldAdminJWT: true
      })
    },
    // put tag/update
    updateTag (data) {
      return api.put('/tag/update', data, {
        shouldAdminJWT: true
      })
    },
    // delete tag/delete
    deleteTag (data) {
      return api.delete('/tag/delete', {
        params: data,
        shouldAdminJWT: true
      })
    },
    // get album/list
    getAlbumList (data) {
      return api.get('/album/list', {
        params: data,
        shouldAdminJWT: true
      })
    },
    // get album/detail
    getAlbumDetail (data) {
      return api.get('/album/detail', {
        params: data,
        shouldAdminJWT: true
      })
    },
    // post album/create
    createAlbum (data) {
      return api.post('/album/create', data, {
        shouldAdminJWT: true
      })
    },
    // put album/update
    updateAlbum (data) {
      return api.put('/album/update', data, {
        shouldAdminJWT: true
      })
    },
    // delete album/delete
    deleteAlbum (data) {
      return api.delete('/album/delete', {
        params: data,
        shouldAdminJWT: true
      })
    },
    // get /config
    getConfig () {
      return api.get('/config', {
        shouldAdminJWT: true
      })
    },
    // put /config/media
    updateConfigMedia (data) {
      return api.put('/config/media', data, {
        shouldAdminJWT: true
      })
    },
  }
}
