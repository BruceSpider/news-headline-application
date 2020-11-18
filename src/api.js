import { NEWS_API_KEY } from './config';

export const getDefaultArticles = async () => {
  const response = await fetch(
    `http://newsapi.org/v2/top-headlines?country=za&category=business&sortBy=publishedAt&pageSize=20&apiKey=${NEWS_API_KEY}`
  );
  const json = await response.json();
  return json;
};

export const getArticlesByDate = async (topic, fromDate) => {
  const response = await fetch(
    `https://newsapi.org/v2/everything?q=${topic}&from=${fromDate}&sortBy=relevancy&pageSize=20&apiKey=${NEWS_API_KEY}`
  );
  const json = await response.json();
  return json;
};
