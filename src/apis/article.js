import axios from '../utils/myaxios.js'
export const getPostList = (params) => {
    return axios({
        url: '/post',
        params
    })
}
export const publishPost = (data) => {
    return axios({
        method: 'post',
        url: '/post',
        data
    })
}
export const getArticleById = (id) => {
    return axios({
        url: `/post/${id}`
    })
}