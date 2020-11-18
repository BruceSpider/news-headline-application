import React from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './components/globalStyles';
import { lightTheme, darkTheme } from './components/themes';
import Toggle from './components/toggler';
import { getDefaultArticles, getArticlesByDate } from './api';
import { Container, Header } from 'semantic-ui-react';
import ArticleList from './components/articleList';
import SearchBar from './components/searchBar';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

class App extends React.Component {
  state = {
    articles: [],
    searchTopic: '',
    totalResults: '',
    loading: false,
    apiError: '',
    isDefaultArticles: true,
    startdate: new Date().toISOString().split('T')[0],
    theme: 'light',
  };

  async componentDidMount() {
    try {
      const response = await getDefaultArticles();
      this.setState({
        articles: response.articles,
        startdate: new Date(),
      });
    } catch (error) {
      this.setState({ apiError: 'Could not find any articles' });
    }
  }

  searchForTopic = async (topic) => {
    try {
      const startDate = this.state.startDate
        ? this.state.startDate
        : new Date();
      this.setState({ loading: true });
      const response = await getArticlesByDate(
        topic,
        startDate.toISOString().split('T')[0]
      );
      this.setState({
        articles: response.articles,
        searchTopic: topic,
        totalResults: response.totalResults,
        isDefaultArticles: false,
        startDate: startDate,
      });
    } catch (error) {
      this.setState({ apiError: 'Could not find any articles' });
    }
    this.setState({ loading: false });
  };

  handleDateSelect = async (date) => {
    const fromDate = new Date(date).toISOString().split('T')[0];
    const topic = this.state.searchTopic ? this.state.searchTopic : 'bitcoin';

    if (topic && fromDate) {
      try {
        this.setState({ loading: true });
        const response = await getArticlesByDate(topic, fromDate);

        const sortedArticles = response.articles.sort(
          (a, b) => new Date(a.publishedAt) - new Date(b.publishedAt)
        );

        this.setState({
          articles: sortedArticles,
          searchTopic: topic,
          totalResults: response.totalResults,
          startDate: new Date(date),
        });
      } catch (error) {
        this.setState({ apiError: 'Could not find any articles' });
      }
      this.setState({ loading: false });
    }
  };

  themeToggler = () => {
    this.state.theme === 'light' ? this.setMode('dark') : this.setMode('light');
  };

  setMode = (mode) => {
    this.setTheme(mode);
  };

  setTheme = (theme) => {
    this.setState({ theme: theme });
  };

  render() {
    const {
      articles,
      apiError,
      loading,
      searchTopic,
      totalResults,
      isDefaultArticles = this.state.isDefaultArticles,
      startDate = new Date(),
      theme,
    } = this.state;
    return (
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        <GlobalStyles />

        <Container>
          <Toggle
            style={{ textAlign: 'center', margin: 20 }}
            theme={theme}
            toggleTheme={this.themeToggler}
          />

          <Header as="h1" style={{ textAlign: 'center', margin: 20 }}>
            <strong>News Headline App</strong>
          </Header>
          <Header as="h2" style={{ textAlign: 'center', margin: 20 }}>
            <strong>Search for an article</strong>
          </Header>
          <SearchBar searchForTopic={this.searchForTopic} />
          <Header as="h2" style={{ textAlign: 'center', margin: 20 }}>
            <p>Filter articles by date published</p>
          </Header>
          <div style={{ textAlign: 'center' }}>
            <DatePicker
              dateFormat="yyyy-MM-dd"
              selected={startDate}
              onChange={(date) => this.handleDateSelect(date)}
              maxDate={new Date()}
              showDisabledMonthNavigation
            />
          </div>
          {loading && (
            <p style={{ textAlign: 'center' }}>Searching for articles...</p>
          )}
          {!isDefaultArticles && articles.length > 0 && (
            <Header as="h4" style={{ textAlign: 'center', margin: 20 }}>
              Found {totalResults} articles on "{searchTopic}"
            </Header>
          )}
          {articles.length > 0 && <ArticleList articles={articles} />}
          {apiError && <p>Could not fetch any articles. Please try again.</p>}
        </Container>
      </ThemeProvider>
    );
  }
}

export default App;
