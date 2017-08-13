import _ from 'lodash';
import {
  RECEIVE_HOME_GALLERY,
  RECEIVE_EXPERIENCE_CATEGORY,
  RECEIVE_POST,
  RESET_DATA,
  GET_POST,
  STOP_LOADING_POST,
  GET_COMMENTS,
  RECEIVE_COMMENTS,
  RECEIVE_COMMENT,
  RECEIVE_MAP_POSTS,
} from '../actions/fetchData';
import { PER_PAGE } from '../config';

const initialState = {
  home: { loaded: false, data: [] },
  experience: { loaded: false, data: [] },
  maps: { loaded: false },
  postsData: {
    gallery: {},
    category: {},
    savedContent: {},
    maps: [],
  },
  comments: {
    data: [],
    currentPage: 0,
    hasMore: true,
    loading: false,
  },
};

function stripIframeUrl(value) {
  if (!value) return '';
  const source = value.split(' ').find(o => o.indexOf('https://my.matterport.com/show/?m=') !== -1);
  return source.slice(5, source.length - 1);
}
function getImages(images) {
  if (!Array.isArray(images)) return [];
  return images.map((image) => {
    let v = String(10000000000 + image.id);
    v = v.slice(1);
    image.url = `http://maapvn.com/admin/images/post/IMG${v}.jpeg?1494409196`;
    return image;
  });
}
function formatPosts(posts, isExperience) {
  return posts.map((post) => {
    post.formatedAddress = [
      post.address.detail,
      post.address.district.name,
      post.address.city.name,
    ].filter(o => _.trim(o)).join(', ');
    post.images = getImages(post.images);
    if (!isExperience) post.formatedUrl = stripIframeUrl(post.matterport_url);
    post.trending = _.random(0, 10) < 3;
    if (post.latlon) {
      post.coordinate = {
        longitude: parseFloat(post.latlon.split(',')[1]),
        latitude: parseFloat(post.latlon.split(',')[0]),
      };
    }
    return post;
  });
}
function formatPostData(galleries, isExperience) {
  const field = isExperience ? 'experiences' : 'posts';
  let postsData = {};
  let rs = galleries.filter(gallery => gallery[field].length);
  rs = rs.map((gallery) => {
    gallery.name = gallery.name.toUpperCase();
    gallery[field] = formatPosts(gallery[field], isExperience);
    postsData[gallery.id] = {
      currentPage: 1,
      loading: false,
      data: gallery[field],
      hasMore: gallery[field].length >= PER_PAGE,
    };
    return gallery;
  });
  return { rs, postsData };
}
function formatMapPost(posts) {
  return posts.map((post) => {
    const isExperience = typeof post.post_id === 'undefined';
    post.tags = [];
    return formatPosts([post], isExperience)[0];
  });
}
const data = (state = initialState, action) => {
  const postsData = _.clone(state.postsData);
  switch (action.type) {
    case RECEIVE_HOME_GALLERY: {
      const homeData = formatPostData(action.galleries);
      postsData.gallery = homeData.postsData;
      return _.assign({}, state,
        {
          home: { loaded: true, data: homeData.rs },
          postsData,
        },
      );
    }
    case RESET_DATA:
      return initialState;
    case RECEIVE_EXPERIENCE_CATEGORY: {
      const experienceData = formatPostData(action.categories, true);
      postsData.category = experienceData.postsData;
      return _.assign({}, state,
        {
          experience: { loaded: true, data: experienceData.rs },
          postsData,
        },
      );
    }
    case GET_POST: {
      postsData[action.postType][action.id].loading = true;
      return _.assign({}, state, { postsData });
    }
    case RECEIVE_POST: {
      const target = postsData[action.postType][action.id];
      target.loading = false;
      target.data = [...target.data, ...formatPosts(action.data)];
      target.currentPage = action.page;
      if (!action.data.length) target.hasMore = false;
      return _.assign({}, state, { postsData });
    }
    case STOP_LOADING_POST:
      postsData[action.postType][action.id].loading = false;
      return _.assign({}, state, { postsData });
    case RECEIVE_COMMENTS: {
      const comments = _.clone(state.comments);
      comments.currentPage = action.page;
      comments.data = [...comments.data, ...action.data];
      comments.hasMore = !!action.data.length;
      comments.loading = false;
      return _.assign({}, state, { comments });
    }
    case RECEIVE_COMMENT: {
      const comments = _.clone(state.comments);
      comments.data = [action.comment, ...comments.data];
      return _.assign({}, state, { comments });
    }
    case GET_COMMENTS: {
      const comments = _.clone(state.comments);
      if (action.page === 1) {
        return _.assign({}, state,
          {
            comments: {
              data: [],
              currentPage: 0,
              hasMore: true,
              loading: true,
            },
          },
        );
      }
      comments.loading = true;
      return _.assign({}, state, { comments });
    }
    case RECEIVE_MAP_POSTS:
      postsData.maps = formatMapPost(action.data);
      console.log(postsData.maps);
      return _.assign({}, state, { postsData, maps: { loaded: true } });
    default:
      return state;

  }
};
export default data;
