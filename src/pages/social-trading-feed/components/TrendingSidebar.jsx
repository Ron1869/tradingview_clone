import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const TrendingSidebar = ({ onTopicClick, onUserFollow }) => {
  const trendingTopics = [
    { tag: 'bitcoin', posts: 1247, change: '+15%' },
    { tag: 'федрезерв', posts: 892, change: '+8%' },
    { tag: 'tesla', posts: 634, change: '+23%' },
    { tag: 'нефть', posts: 567, change: '-5%' },
    { tag: 'золото', posts: 445, change: '+12%' },
    { tag: 'доллар', posts: 398, change: '+3%' },
    { tag: 'ethereum', posts: 356, change: '+18%' },
    { tag: 'акции', posts: 289, change: '+7%' }
  ];

  const topTraders = [
    {
      id: 1,
      name: 'Алексей Волков',
      username: 'alextrader',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      followers: 15420,
      winRate: 78.5,
      totalReturn: '+245%',
      verified: true,
      isFollowing: false
    },
    {
      id: 2,
      name: 'Мария Петрова',
      username: 'cryptoqueen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      followers: 12890,
      winRate: 82.1,
      totalReturn: '+189%',
      verified: true,
      isFollowing: true
    },
    {
      id: 3,
      name: 'Дмитрий Козлов',
      username: 'forexmaster',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      followers: 9876,
      winRate: 75.3,
      totalReturn: '+156%',
      verified: false,
      isFollowing: false
    },
    {
      id: 4,
      name: 'Елена Смирнова',
      username: 'stockanalyst',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      followers: 8543,
      winRate: 79.8,
      totalReturn: '+203%',
      verified: true,
      isFollowing: false
    },
    {
      id: 5,
      name: 'Игорь Новиков',
      username: 'daytrader',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
      followers: 7234,
      winRate: 73.2,
      totalReturn: '+134%',
      verified: false,
      isFollowing: true
    }
  ];

  const suggestedUsers = [
    {
      id: 6,
      name: 'Анна Кузнецова',
      username: 'optionstrader',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face',
      followers: 5432,
      mutualFollows: 12,
      isFollowing: false
    },
    {
      id: 7,
      name: 'Сергей Морозов',
      username: 'techanalyst',
      avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=40&h=40&fit=crop&crop=face',
      followers: 4321,
      mutualFollows: 8,
      isFollowing: false
    },
    {
      id: 8,
      name: 'Ольга Федорова',
      username: 'commodities',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&crop=face',
      followers: 3876,
      mutualFollows: 15,
      isFollowing: false
    }
  ];

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000)?.toFixed(1) + 'k';
    }
    return num?.toString();
  };

  return (
    <div className="space-y-6">
      {/* Trending Topics */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Тренды</h3>
        </div>
        <div className="space-y-3">
          {trendingTopics?.map((topic, index) => (
            <div
              key={topic?.tag}
              onClick={() => onTopicClick(topic?.tag)}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer transition-smooth"
            >
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-muted-foreground w-4">
                  {index + 1}
                </span>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    #{topic?.tag}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatNumber(topic?.posts)} постов
                  </div>
                </div>
              </div>
              <span className={`text-xs font-medium ${
                topic?.change?.startsWith('+') ? 'text-success' : 'text-error'
              }`}>
                {topic?.change}
              </span>
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-3 text-primary hover:text-primary"
        >
          Показать больше
        </Button>
      </div>
      {/* Top Traders */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Trophy" size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Топ трейдеры</h3>
        </div>
        <div className="space-y-4">
          {topTraders?.map((trader, index) => (
            <div key={trader?.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    index === 0 ? 'bg-accent text-accent-foreground' :
                    index === 1 ? 'bg-muted text-muted-foreground' :
                    index === 2 ? 'bg-warning/20 text-warning': 'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </span>
                  <Image 
                    src={trader?.avatar} 
                    alt={trader?.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium text-foreground">
                      {trader?.name}
                    </span>
                    {trader?.verified && (
                      <Icon name="BadgeCheck" size={12} className="text-primary" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{formatNumber(trader?.followers)} подписчиков</span>
                    <span>•</span>
                    <span className="text-success">{trader?.winRate}% побед</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-success text-data">
                  {trader?.totalReturn}
                </div>
                <Button
                  variant={trader?.isFollowing ? "outline" : "default"}
                  size="sm"
                  onClick={() => onUserFollow(trader?.id, !trader?.isFollowing)}
                  className="text-xs mt-1"
                >
                  {trader?.isFollowing ? 'Отписаться' : 'Подписаться'}
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-3 text-primary hover:text-primary"
        >
          Посмотреть рейтинг
        </Button>
      </div>
      {/* Suggested Users */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="UserPlus" size={20} className="text-secondary" />
          <h3 className="text-lg font-semibold text-foreground">Рекомендации</h3>
        </div>
        <div className="space-y-4">
          {suggestedUsers?.map((user) => (
            <div key={user?.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Image 
                  src={user?.avatar} 
                  alt={user?.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {user?.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user?.mutualFollows} общих подписок
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUserFollow(user?.id, true)}
                className="text-xs"
              >
                Подписаться
              </Button>
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-3 text-primary hover:text-primary"
        >
          Показать больше
        </Button>
      </div>
      {/* Market Status Widget */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Activity" size={20} className="text-success" />
          <h3 className="text-lg font-semibold text-foreground">Рынок</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Статус:</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm font-medium text-success">Открыт</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Активных трейдеров:</span>
            <span className="text-sm font-medium text-foreground text-data">24,567</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Постов сегодня:</span>
            <span className="text-sm font-medium text-foreground text-data">1,892</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Настроение:</span>
            <span className="text-sm font-medium text-success">Бычье 68%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingSidebar;