import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import PostCard from './components/PostCard';
import ComposePost from './components/ComposePost';
import TrendingSidebar from './components/TrendingSidebar';
import FilterBar from './components/FilterBar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const SocialTradingFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [filters, setFilters] = useState({
    postType: 'all',
    sortBy: 'latest',
    timeRange: 'all',
    assetClass: 'all',
    followingOnly: false,
    verifiedOnly: false
  });

  // Mock posts data
  const mockPosts = [
    {
      id: 1,
      author: {
        id: 1,
        name: 'Алексей Волков',
        username: 'alextrader',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        followers: 15420,
        verified: true,
        isFollowing: false
      },
      type: 'chart',
      content: `Биткоин формирует классический паттерн "флаг" на 4-часовом графике. Жду пробой уровня $45,000 с целью $48,500.\n\nОбъем торгов снижается, что подтверждает консолидацию. Стоп-лосс установлю на $42,800.`,
      symbol: 'BTCUSD',
      timeframe: '4h',
      priceChange: 2.3,
      chartImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=300&fit=crop',
      hashtags: ['bitcoin', 'техническийанализ', 'криптовалюты'],
      timestamp: new Date(Date.now() - 1800000)?.toISOString(),
      likes: 234,
      isLiked: false,
      shares: 45,
      comments: [
        {
          id: 1,
          author: {
            name: 'Мария Петрова',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
          },
          content: 'Согласна с анализом! Тоже вижу потенциал для роста.',
          timestamp: new Date(Date.now() - 900000)?.toISOString(),
          likes: 12
        },
        {
          id: 2,
          author: {
            name: 'Дмитрий Козлов',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
          },
          content: 'А что если будет ложный пробой? Объемы не очень убедительные.',
          timestamp: new Date(Date.now() - 600000)?.toISOString(),
          likes: 8
        }
      ]
    },
    {
      id: 2,
      author: {
        id: 2,
        name: 'Мария Петрова',
        username: 'cryptoqueen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
        followers: 12890,
        verified: true,
        isFollowing: true
      },
      type: 'prediction',
      content: `Ethereum готовится к мощному движению! Анализирую накопление китов и институциональные потоки.\n\nОжидаю рост к $3,200 в течение 2-3 недель. Фундаментальные факторы поддерживают бычий сценарий.`,
      symbol: 'ETHUSD',
      timeframe: '1D',
      targetPrice: 3200,
      stopLoss: 2650,
      priceChange: 1.8,
      hashtags: ['ethereum', 'прогноз', 'альткоины'],
      timestamp: new Date(Date.now() - 3600000)?.toISOString(),
      likes: 189,
      isLiked: true,
      shares: 67,
      comments: [
        {
          id: 3,
          author: {
            name: 'Игорь Новиков',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face'
          },
          content: 'Интересный прогноз! На каких индикаторах основываешься?',
          timestamp: new Date(Date.now() - 1800000)?.toISOString(),
          likes: 5
        }
      ]
    },
    {
      id: 3,
      author: {
        id: 3,
        name: 'Дмитрий Козлов',
        username: 'forexmaster',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        followers: 9876,
        verified: false,
        isFollowing: false
      },
      type: 'educational',
      content: `Разбираем стратегию "Пробой с подтверждением":\n\n1. Ждем формирование уровня поддержки/сопротивления\n2. Дожидаемся пробоя с объемом\n3. Ищем ретест уровня\n4. Входим после подтверждения\n\nЭта стратегия дает высокий процент прибыльных сделок при правильном применении.`,
      image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&h=300&fit=crop',
      hashtags: ['обучение', 'стратегии', 'форекс'],
      timestamp: new Date(Date.now() - 7200000)?.toISOString(),
      likes: 156,
      isLiked: false,
      shares: 89,
      comments: [
        {
          id: 4,
          author: {
            name: 'Анна Кузнецова',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face'
          },
          content: 'Отличное объяснение! Можешь показать примеры на реальных графиках?',
          timestamp: new Date(Date.now() - 3600000)?.toISOString(),
          likes: 15
        },
        {
          id: 5,
          author: {
            name: 'Сергей Морозов',
            avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=40&h=40&fit=crop&crop=face'
          },
          content: 'Использую эту стратегию уже полгода. Работает!',
          timestamp: new Date(Date.now() - 1800000)?.toISOString(),
          likes: 22
        }
      ]
    },
    {
      id: 4,
      author: {
        id: 4,
        name: 'Елена Смирнова',
        username: 'stockanalyst',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
        followers: 8543,
        verified: true,
        isFollowing: false
      },
      type: 'text',
      content: `Сегодняшние данные по инфляции в США превзошли ожидания. Это может повлиять на решение ФРС по процентным ставкам.\n\nРекомендую внимательно следить за реакцией рынка облигаций и доллара. Возможна повышенная волатильность в ближайшие дни.\n\nОсобенно это касается технологических акций, которые чувствительны к изменениям процентных ставок.`,
      hashtags: ['федрезерв', 'инфляция', 'акции', 'макроэкономика'],
      timestamp: new Date(Date.now() - 10800000)?.toISOString(),
      likes: 98,
      isLiked: false,
      shares: 34,
      comments: [
        {
          id: 6,
          author: {
            name: 'Владимир Попов',
            avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=40&h=40&fit=crop&crop=face'
          },
          content: 'Какие конкретно акции посоветуешь для шорта?',
          timestamp: new Date(Date.now() - 5400000)?.toISOString(),
          likes: 7
        }
      ]
    },
    {
      id: 5,
      author: {
        id: 5,
        name: 'Игорь Новиков',
        username: 'daytrader',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
        followers: 7234,
        verified: false,
        isFollowing: true
      },
      type: 'chart',
      content: `Tesla формирует восходящий треугольник на дневном графике. Цель при пробое - $280.\n\nФундаментально компания выглядит сильно после последних новостей о расширении производства. Жду пробой в ближайшие дни.`,
      symbol: 'TSLA',
      timeframe: '1D',
      priceChange: -0.8,
      chartImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop',
      hashtags: ['tesla', 'акции', 'техническийанализ'],
      timestamp: new Date(Date.now() - 14400000)?.toISOString(),
      likes: 167,
      isLiked: true,
      shares: 52,
      comments: [
        {
          id: 7,
          author: {
            name: 'Ольга Федорова',
            avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&crop=face'
          },
          content: 'А как насчет общего тренда рынка? Не помешает ли коррекция?',
          timestamp: new Date(Date.now() - 7200000)?.toISOString(),
          likes: 11
        }
      ]
    }
  ];

  useEffect(() => {
    loadInitialPosts();
  }, [filters]);

  const loadInitialPosts = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 1000);
  };

  const loadMorePosts = useCallback(() => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    // Simulate loading more posts
    setTimeout(() => {
      const morePosts = mockPosts?.map(post => ({
        ...post,
        id: post?.id + posts?.length,
        timestamp: new Date(Date.now() - Math.random() * 86400000)?.toISOString()
      }));
      setPosts(prev => [...prev, ...morePosts]);
      setLoading(false);
      
      // Simulate end of posts after 3 loads
      if (posts?.length > 15) {
        setHasMore(false);
      }
    }, 1000);
  }, [loading, hasMore, posts?.length]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement?.scrollTop !== document.documentElement?.offsetHeight) {
        return;
      }
      loadMorePosts();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMorePosts]);

  const handleLike = (postId, isLiked) => {
    setPosts(prev => prev?.map(post => 
      post?.id === postId 
        ? { ...post, isLiked, likes: isLiked ? post?.likes + 1 : post?.likes - 1 }
        : post
    ));
  };

  const handleComment = (postId, comment) => {
    const newComment = {
      id: Date.now(),
      author: {
        name: 'Вы',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
      },
      content: comment,
      timestamp: new Date()?.toISOString(),
      likes: 0
    };

    setPosts(prev => prev?.map(post => 
      post?.id === postId 
        ? { ...post, comments: [...post?.comments, newComment] }
        : post
    ));
  };

  const handleShare = (postId) => {
    setPosts(prev => prev?.map(post => 
      post?.id === postId 
        ? { ...post, shares: post?.shares + 1 }
        : post
    ));
    
    // Show share dialog or copy link
    navigator.clipboard?.writeText(`${window.location?.origin}/post/${postId}`);
  };

  const handleFollow = (userId, isFollowing) => {
    setPosts(prev => prev?.map(post => 
      post?.author?.id === userId 
        ? { 
            ...post, 
            author: { 
              ...post?.author, 
              isFollowing,
              followers: isFollowing ? post?.author?.followers + 1 : post?.author?.followers - 1
            }
          }
        : post
    ));
  };

  const handleNewPost = (postData) => {
    const newPost = {
      id: Date.now(),
      author: {
        id: 999,
        name: 'Вы',
        username: 'youruser',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        followers: 156,
        verified: false,
        isFollowing: false
      },
      ...postData,
      likes: 0,
      isLiked: false,
      shares: 0,
      comments: []
    };

    setPosts(prev => [newPost, ...prev]);
    setShowCompose(false);
  };

  const handleTopicClick = (topic) => {
    // Filter posts by hashtag
    console.log('Filter by topic:', topic);
  };

  const handleUserFollow = (userId, isFollowing) => {
    console.log('Follow user:', userId, isFollowing);
  };

  const filteredPosts = posts?.filter(post => {
    if (filters?.postType !== 'all' && post?.type !== filters?.postType) return false;
    if (filters?.followingOnly && !post?.author?.isFollowing) return false;
    if (filters?.verifiedOnly && !post?.author?.verified) return false;
    return true;
  });

  return (
    <>
      <Helmet>
        <title>Социальная торговля - TradingView</title>
        <meta name="description" content="Делитесь торговыми идеями, анализируйте рынки и следите за успешными трейдерами в социальной торговой сети TradingView." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="pt-16 pb-20 md:pb-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-3">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">Социальная торговля</h1>
                    <p className="text-muted-foreground mt-1">
                      Делитесь идеями, анализируйте рынки и учитесь у лучших трейдеров
                    </p>
                  </div>
                  <Button
                    variant="default"
                    onClick={() => setShowCompose(!showCompose)}
                    className="flex items-center space-x-2"
                  >
                    <Icon name="Plus" size={16} />
                    <span className="hidden sm:inline">Создать пост</span>
                  </Button>
                </div>

                {/* Compose Post */}
                {showCompose && (
                  <div className="mb-6">
                    <ComposePost 
                      onPost={handleNewPost}
                      onClose={() => setShowCompose(false)}
                    />
                  </div>
                )}

                {/* Filter Bar */}
                <FilterBar 
                  onFilterChange={setFilters}
                  activeFilters={filters}
                />

                {/* Posts Feed */}
                <div className="space-y-0">
                  {filteredPosts?.map((post) => (
                    <PostCard
                      key={post?.id}
                      post={post}
                      onLike={handleLike}
                      onComment={handleComment}
                      onShare={handleShare}
                      onFollow={handleFollow}
                    />
                  ))}

                  {/* Loading Indicator */}
                  {loading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span>Загрузка постов...</span>
                      </div>
                    </div>
                  )}

                  {/* End of Posts */}
                  {!hasMore && filteredPosts?.length > 0 && (
                    <div className="text-center py-8">
                      <div className="text-muted-foreground">
                        <Icon name="CheckCircle" size={24} className="mx-auto mb-2" />
                        <p>Вы просмотрели все посты</p>
                      </div>
                    </div>
                  )}

                  {/* No Posts */}
                  {filteredPosts?.length === 0 && !loading && (
                    <div className="text-center py-12">
                      <Icon name="MessageSquare" size={48} className="mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium text-foreground mb-2">Нет постов</h3>
                      <p className="text-muted-foreground mb-4">
                        Попробуйте изменить фильтры или создайте первый пост
                      </p>
                      <Button
                        variant="default"
                        onClick={() => setShowCompose(true)}
                        className="flex items-center space-x-2"
                      >
                        <Icon name="Plus" size={16} />
                        <span>Создать пост</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <TrendingSidebar 
                    onTopicClick={handleTopicClick}
                    onUserFollow={handleUserFollow}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Compose Button */}
        <div className="fixed bottom-20 right-4 md:hidden z-50">
          <Button
            variant="default"
            size="lg"
            onClick={() => setShowCompose(!showCompose)}
            className="w-14 h-14 rounded-full shadow-elevated"
          >
            <Icon name="Plus" size={24} />
          </Button>
        </div>
      </div>
    </>
  );
};

export default SocialTradingFeed;