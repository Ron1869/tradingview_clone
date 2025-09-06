import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PostCard = ({ post, onLike, onComment, onShare, onFollow }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(post?.isLiked);
  const [isFollowing, setIsFollowing] = useState(post?.author?.isFollowing);
  const [likesCount, setLikesCount] = useState(post?.likes);

  const handleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
    onLike(post?.id, newLikedState);
  };

  const handleFollow = () => {
    const newFollowState = !isFollowing;
    setIsFollowing(newFollowState);
    onFollow(post?.author?.id, newFollowState);
  };

  const handleComment = () => {
    if (newComment?.trim()) {
      onComment(post?.id, newComment);
      setNewComment('');
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - postTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Только что';
    if (diffInMinutes < 60) return `${diffInMinutes} мин назад`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ч назад`;
    return `${Math.floor(diffInMinutes / 1440)} дн назад`;
  };

  const renderPostContent = () => {
    switch (post?.type) {
      case 'chart':
        return (
          <div className="mt-4">
            <div className="bg-card rounded-lg p-4 border border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Icon name="TrendingUp" size={16} className="text-primary" />
                  <span className="text-sm font-medium text-foreground text-data">{post?.symbol}</span>
                  <span className={`text-sm font-medium ${post?.priceChange >= 0 ? 'text-success' : 'text-error'}`}>
                    {post?.priceChange >= 0 ? '+' : ''}{post?.priceChange}%
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">{post?.timeframe}</span>
              </div>
              <Image 
                src={post?.chartImage} 
                alt={`График ${post?.symbol}`}
                className="w-full h-48 object-cover rounded-md"
              />
            </div>
          </div>
        );
      case 'prediction':
        return (
          <div className="mt-4 bg-accent/10 border border-accent/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Target" size={16} className="text-accent" />
              <span className="text-sm font-medium text-accent">Прогноз</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Цель:</span>
                <span className="ml-2 font-medium text-success text-data">${post?.targetPrice}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Стоп:</span>
                <span className="ml-2 font-medium text-error text-data">${post?.stopLoss}</span>
              </div>
            </div>
          </div>
        );
      case 'educational':
        return (
          <div className="mt-4 bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="BookOpen" size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">Обучение</span>
            </div>
            {post?.image && (
              <Image 
                src={post?.image} 
                alt="Обучающий материал"
                className="w-full h-32 object-cover rounded-md mt-2"
              />
            )}
          </div>
        );
      default:
        return post?.image ? (
          <div className="mt-4">
            <Image 
              src={post?.image} 
              alt="Изображение поста"
              className="w-full max-h-96 object-cover rounded-lg"
            />
          </div>
        ) : null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-4">
      {/* Author Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Image 
            src={post?.author?.avatar} 
            alt={post?.author?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-foreground">{post?.author?.name}</h3>
              {post?.author?.verified && (
                <Icon name="BadgeCheck" size={16} className="text-primary" />
              )}
              <span className="text-sm text-muted-foreground">@{post?.author?.username}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>{formatTimeAgo(post?.timestamp)}</span>
              <span>•</span>
              <span>{post?.author?.followers} подписчиков</span>
            </div>
          </div>
        </div>
        <Button
          variant={isFollowing ? "outline" : "default"}
          size="sm"
          onClick={handleFollow}
          className="text-xs"
        >
          {isFollowing ? 'Отписаться' : 'Подписаться'}
        </Button>
      </div>
      {/* Post Content */}
      <div className="mb-4">
        <p className="text-foreground leading-relaxed">{post?.content}</p>
        {post?.hashtags && post?.hashtags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {post?.hashtags?.map((tag, index) => (
              <span key={index} className="text-primary text-sm hover:underline cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        )}
        {renderPostContent()}
      </div>
      {/* Engagement Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`flex items-center space-x-2 ${isLiked ? 'text-error' : 'text-muted-foreground'}`}
          >
            <Icon name={isLiked ? "Heart" : "Heart"} size={16} className={isLiked ? "fill-current" : ""} />
            <span className="text-sm">{likesCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
          >
            <Icon name="MessageCircle" size={16} />
            <span className="text-sm">{post?.comments?.length}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShare(post?.id)}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
          >
            <Icon name="Share" size={16} />
            <span className="text-sm">{post?.shares}</span>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <Icon name="Bookmark" size={16} />
        </Button>
      </div>
      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="space-y-3 mb-4">
            {post?.comments?.map((comment) => (
              <div key={comment?.id} className="flex space-x-3">
                <Image 
                  src={comment?.author?.avatar} 
                  alt={comment?.author?.name}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-foreground">{comment?.author?.name}</span>
                      <span className="text-xs text-muted-foreground">{formatTimeAgo(comment?.timestamp)}</span>
                    </div>
                    <p className="text-sm text-foreground">{comment?.content}</p>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground hover:text-foreground p-0 h-auto"
                    >
                      Нравится ({comment?.likes})
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground hover:text-foreground p-0 h-auto"
                    >
                      Ответить
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Add Comment */}
          <div className="flex space-x-3">
            <Image 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" 
              alt="Ваш аватар"
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 flex space-x-2">
              <input
                type="text"
                placeholder="Написать комментарий..."
                value={newComment}
                onChange={(e) => setNewComment(e?.target?.value)}
                className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                onKeyPress={(e) => e?.key === 'Enter' && handleComment()}
              />
              <Button
                variant="default"
                size="sm"
                onClick={handleComment}
                disabled={!newComment?.trim()}
              >
                <Icon name="Send" size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;